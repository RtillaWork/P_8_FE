// Tasks

// State:
// allTasks = getTasks(loggedProfile.radius) from /tasks
// hiddenTasks = getHiddenTasks() from LocalStorage
// activeTasks = getActiveTasks() from allTasks and not in hiddenTasks
// selectedTask = null : if (loggedProfile.taskView==null // both views) selectedTask takes the onClicked task.id to highlight both
// TODO generator or iterator?

// TEST
// import tasks from './services/tasks';
// import { TasksDB } from "../testdata";
// END TEST
import axios from 'axios';

import {
    API_PROFILE_TASKS_ROUTE,
    API_TASK_STATS_ROUTE,
    API_TASKS_ROUTE,
    reqAuthnToHeaders,
    TASKS_API_TIMEOUT,
} from './apiServices';

///////////////////////////
// NEW as a Map
/// update tasks
// add new updates to tasks[]
// merge updates with previous version[]
// trigger loadedTasksUpdated / setLoadedTasksUpdated
//////////////////////////
const updateTaskStoreFrom = (previousTasks, createdList, updatedList) => {

    const taskMap = new Map(previousTasks); // previousTasks is assumed to be a Map or an iterator with [key, value]
    createdList.forEach((t) => {
        taskMap.set(t.id, t);
    });

    taskMap.forEach((tv, tid, map) => {
        // const id = tm.key;
        // const t = tm.value;

        const foundUpdated = updatedList.find((u) => u.id == tid);
        if (foundUpdated) {
            map.set(tid, {...tv, ...foundUpdated});
        }
    });

    return taskMap;
};

///////////////////////////
// NEW as a Map
/// update a task in the given tasks DB with the new info
// add new updates to tasks[]
// merge updates with previous version[]
// trigger loadedTasksUpdated / setLoadedTasksUpdated
//////////////////////////
const updateATaskInDb = (previousTasksMap, updatedTaskbyId) => {

    if (!previousTasksMap.has(updatedTaskbyId.id)) {
        return previousTasksMap;
    } else {
        const task = previousTasksMap.get(updatedTaskbyId.id);

        return previousTasksMap.set(updatedTaskbyId.id, {
            ...task,
            ...updatedTaskbyId,
        });
    }
};


///////////////////////////////
/////// generic fetch tasks function
//////////////////////////////
const fetchTasks = async (
    authn,
    userId,
    taskId,
    lat,
    lng,
    radius,
    since
) => {
    const reqConfig = {
        url: API_TASKS_ROUTE,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: TASKS_API_TIMEOUT,
        params: {
            user_id: userId,
            lat: lat,
            lng: lng,
            radius: radius,
            since: since,
        },
    };

    return axios(reqConfig);
};

///////////////////////////////
/////// fetch a single task/request with full data
//////////////////////////////
const fetchATask = async (
    authn,

    taskId

) => {
    const reqConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: TASKS_API_TIMEOUT,

    };

    return axios(reqConfig);
};

///////////////////////////////
/////// new
//////////////////////////////
const fetchProfileTasks = async (
    authn

) => {
    const reqConfig = {
        url: API_PROFILE_TASKS_ROUTE,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: TASKS_API_TIMEOUT,
    };

    return axios(reqConfig);
};

///////////////////////////////
/////// new
//////////////////////////////
const fetchUpdatedTasks = async (
    authn, //{ accessToken, client, expiry, uid, id },
    userId,
    taskId,
    lat,
    lng,
    radius,
    since
) => {
    const reqConfig = {
        url: API_TASKS_ROUTE,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: TASKS_API_TIMEOUT,
        params: {
            user_id: userId,
            lat: lat,
            lng: lng,
            radius: radius,
            since: since,
        },
    };

    return axios(reqConfig);
};

///////////////////////////////////////////
//////////// new
///////////////////////////////
const createTask = async (
    authn,
    title,
    kind,
    description,
    isPublished = true,
    isFullfilled,
    taskCoords
) => {

    const requestConfig = {
        url: API_TASKS_ROUTE,
        method: 'post',

        headers: reqAuthnToHeaders(authn),
        data: {
            title: title,
            kind: kind,
            description: description,
            is_published: true, // isPublished is always true on create task,
            is_fullfilled: isFullfilled,
            lat: taskCoords.lat,
            lng: taskCoords.lng,
        },

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const updateTask = async (
    authn,
    taskId,
    title,
    kind,
    description,
    isPublished,
    isFullfilled,
    taskCoords
) => {

    const requestConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'patch', // 'put',

        headers: reqAuthnToHeaders(authn),

        data: {
            title: title,
            kind: kind,
            description: description,
            is_published: isPublished,
            is_fullfilled: isFullfilled,
            lat: taskCoords.lat,
            lng: taskCoords.lng,
        },

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const updateATaskAsFullfilled = async (
    authn,
    taskId

) => {

    const requestConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'patch',

        headers: reqAuthnToHeaders(authn),

        data: {

            is_published: false,
            is_fullfilled: true,

        },

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const updateATaskAsPublished = async (
    authn,
    taskId

) => {

    const requestConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'patch',

        headers: reqAuthnToHeaders(authn),

        data: {

            is_published: true,

        },

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const updateATaskAsUnpublished = async (
    authn,
    taskId

) => {


    const requestConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'patch',

        headers: reqAuthnToHeaders(authn),

        data: {

            is_published: false,

        },

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};


const deleteATask = async (
    authn,
    taskId

) => {

    const requestConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
        method: 'delete',

        headers: reqAuthnToHeaders(authn),

        timeout: TASKS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

//////////////////////
/// fetchTaskStats
///////////////////////

const fetchTaskStats = async (
    authn
) => {
    const reqConfig = {
        url: API_TASK_STATS_ROUTE,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: TASKS_API_TIMEOUT,

    };

    return axios(reqConfig);
};

///////////////////////////////////
////////// Local storage functions
///////////////////////////////////
function pinTask(taskId) {
    // Add to LocalStorage
    console.log(`*******NOTE TODO: ADD PINNED TASK ${taskId} to LocalStorage`);
    return taskId;
}

function hideTask(taskId) {
    // Add to LocalStorage
    console.log(`*******NOTE TODO: ADD HIDDEN TASK ${taskId} to LocalStorage`);
    return taskId;
}

export {
    fetchTasks,
    fetchATask,
    fetchProfileTasks,
    fetchUpdatedTasks,
    pinTask,
    hideTask,
    createTask,
    updateTask,
    deleteATask,
    updateATaskAsFullfilled,
    updateATaskAsPublished,
    updateATaskAsUnpublished,
    updateTaskStoreFrom,
    fetchTaskStats,
};

////////////////////////////////////////////
// TODO TODO TODO TODO

// Started DELETE "/authn" for 127.0.0.1 at 2021-05-27 19:43:35 -0600
// Processing by DeviseTokenAuth::RegistrationsController#destroy as *
// /
// *
//   User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."uid" = $1 LIMIT $2  [["uid", "u60@m60.co"], ["LIMIT", 1]]
//    (0.2ms)  BEGIN
//   ActiveStorage::Attachment Load (0.2ms)  SELECT "active_storage_attachments".* FROM "active_storage_attachments" WHERE "active_storage_attachments"."record_id" = $1 AND "active_storage_attachments"."record_type" = $2 AND "active_storage_attachments"."name" = $3 LIMIT $4  [["record_id", 60], ["record_type", "User"], ["name", "gov_id_document"], ["LIMIT", 1]]
//   Task Load (0.4ms)  SELECT "tasks".* FROM "tasks" WHERE "tasks"."user_id" = $1  [["user_id", 60]]
//   Task Destroy (3.7ms)  DELETE FROM "tasks" WHERE "tasks"."id" = $1  [["id", 1238]]
//    (0.2ms)  ROLLBACK
// Completed 500 Internal Server Error in 80ms (ActiveRecord: 5.1ms | Allocations: 11276)

// ActiveRecord::InvalidForeignKey (PG::ForeignKeyViolation: ERROR:  update or delete on table "tasks" violates foreign key constraint "fk_rails_c000bf2b0b" on table "conversations"
// DETAIL:  Key (id)=(1238) is still referenced from table "conversations".
// ):

//////////////////////////////////////////////
