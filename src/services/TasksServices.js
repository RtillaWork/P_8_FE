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
import { GrNext } from 'react-icons/gr';

import {
  deviseAuthnResRefresh,
  TASKS_API_TIMEOUT,
  API_TASKS_ROUTE,
  API_PROFILE_TASKS_ROUTE,
  reqAuthnToHeaders,
  API_TASK_STATS_ROUTE,
} from './apiServices';

// ///////////////////////////
// /// OLD, as array, see new as a Map
// // update tasks
// // add new updates to tasks[]
// // merge updates with previous version[]
// // trigger loadedTasksUpdated / setLoadedTasksUpdated
// //////////////////////////
// const updateTasksDb = (tasks, createdList, updated) => {
//   // return createdList.concat(updated);
//   // let newTasks = tasks.concat(createdList);

//   // filter out any redundant createdList tasks...
//   //... that might be already be in tasks
//   let ids = tasks.map((t) => t.id);
//   let newTasks = tasks.concat(createdList.filter((c) => !ids.includes(c.id)));

//   updated.forEach((u) => {
//     const found = findATaskById(newTasks, u.id);
//     if (found) {
//       // const updateCount = newTasks[found.index].updateCount ?? 0;

//       newTasks[found.index] = {
//         ...newTasks[found.index],
//         ...u,
//         // updateCount: updateCount + 1,
//       };
//     }
//   });

///////////////////////////
// NEW as a Map
/// update tasks
// add new updates to tasks[]
// merge updates with previous version[]
// trigger loadedTasksUpdated / setLoadedTasksUpdated
//////////////////////////
const updateTaskStoreFrom = (previousTasks, createdList, updatedList) => {
  // console.log(
  //   '### DEBUGDEBUG BEGIN updateTaskStoreFrom return tasks: show previousTasks',
  //   previousTasks
  // );

  const taskMap = new Map(previousTasks); // previousTasks is assumed to be a Map or an iterator with [key, value]
  createdList.forEach((t) => {
    taskMap.set(t.id, t);
  });

  // const tasksIds = Array.from(taskMap.keys());

  // updatedList.forEach((t) => {
  //   if (t.id in tasksIds) {
  //     // only update taskMap we already have or that are in the new area
  //     taskMap.set(t.id, t);
  //   }
  // });

  // taskMap.forEach((tm) => {
  //   const id = tm.key;
  //   const t = tm.value;

  //   const foundUpdated = updatedList.find((u) => u.id == id);
  //   if (foundUpdated) {
  //     tm.set(id, { ...t, ...foundUpdated });
  //   }
  // });

  taskMap.forEach((tv, tid, map) => {
    // const id = tm.key;
    // const t = tm.value;

    const foundUpdated = updatedList.find((u) => u.id == tid);
    if (foundUpdated) {
      map.set(tid, { ...tv, ...foundUpdated });
    }
  });

  // console.log(
  //   '### DEBUGDEBUG END updateTaskStoreFrom return taskMap: ',
  //   taskMap
  // );
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
  // console.log(
  //   '### DEBUGDEBUG BEGIN updateATaskInDb return tasks: show previousTasksMap',
  //   previousTasksMap
  // );
  if (!previousTasksMap.has(updatedTaskbyId.id)) {
    return previousTasksMap;
  } else {
    const task = previousTasksMap.get(updatedTaskbyId.id);
    // console.log('### DEBUGDEBUG END updateATaskInDb updates with task: ', {
    //   id: updatedTaskbyId.id,
    //   task: { ...task, ...updatedTaskbyId },
    // });

    return previousTasksMap.set(updatedTaskbyId.id, {
      ...task,
      ...updatedTaskbyId,
    });
  }
};

// ///////////////////////////
// /// finds and returns a task and its index
// // or null if not found
// //////////////////////////
// const findATaskById = (tasks, id) => {
//   if (tasks.length > 0) {
//     const index = tasks.findIndex((t) => t.id == id);
//     if (index > -1) {
//       return { task: tasks[index], index: index };
//     } else {
//       console.log('### DEBUG findATaskById, task.id not found in tasks DB');
//       return null;
//     }
//   } else {
//     console.log('### DEBUG findATaskById, tasks DB is empty or invalid');
//     return null;
//   }
// };

// ///////////////////////////
// /// returns an updated task with the new content
// // NOTE adds an updateCount counter to task object
// // or null if the merge is invalid
// //////////////////////////
// const updateATaskWith = (tasks, task, taskPropertiesUpdated) => {
//   // TODO : check that tasksPropertiesUpdated has valid task attributes
//   const found = findATaskById(tasks, task.id);
//   if (!found) {
//     console.log('### DEBUG task not found in tasks. Failed update');
//     return null;
//   } else {
//     const { aTask, index } = found;
//     const updateCount = aTask.updateCount ?? 0;
//     tasks[index] = {
//       ...aTask,
//       ...taskPropertiesUpdated,
//       updateCount: updateCount + 1,
//     };
//   }
// };

// ///////////////////////////
// /// returns an updated task with the new content
// // NOTE adds an updateCount counter to task object
// // or null if the merge is invalid
// //////////////////////////
// const updateATaskByIdWith = (tasks, id, taskPropertiesUpdated) => {
//   // TODO : check that tasksPropertiesUpdated has valid task attributes
//   const found = findATaskById(tasks, id);
//   if (!found) {
//     console.log('### DEBUG task not found in tasks. Failed update');
//     return null;
//   } else {
//     const { aTask, index } = found;
//     const updateCount = aTask.updateCount ?? 0;
//     tasks[index] = {
//       ...aTask,
//       ...taskPropertiesUpdated,
//       updateCount: updateCount + 1,
//     };
//   }
// };

///////////////////////////////
/////// generic fetch tasks function
//////////////////////////////
const fetchTasks = async (
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

///////////////////////////////
/////// fetch a single task/request with full data
//////////////////////////////
const fetchATask = async (
  authn, //{ accessToken, client, expiry, uid, id },
  // userId,
  taskId
  // lat,
  // lng,
  // radius,
  // since
) => {
  const reqConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'get',

    headers: reqAuthnToHeaders(authn),
    timeout: TASKS_API_TIMEOUT,
    // params: {
    //   user_id: userId,
    //   lat: lat,
    //   lng: lng,
    //   radius: radius,
    //   since: since,
    // },
  };

  return axios(reqConfig);
};

///////////////////////////////
/////// new
//////////////////////////////
const fetchProfileTasks = async (
  authn //{ accessToken, client, expiry, uid, id },
  // userId,
  // taskId,
  // // lat,
  // // lng,
  // // radius
) => {
  const reqConfig = {
    url: API_PROFILE_TASKS_ROUTE,
    method: 'get',

    headers: reqAuthnToHeaders(authn),
    timeout: TASKS_API_TIMEOUT,
    // params: {
    //   user_id: userId,
    //   lat: lat,
    //   lng: lng,
    //   radius: radius,
    // },
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
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  title,
  kind,
  description,
  isPublished = true,
  isFullfilled,
  taskCoords
) => {
  // console.log('### CREATETASK BEFORE AXIOS AUTHN and DATA: ', authn);

  const requestConfig = {
    url: API_TASKS_ROUTE,
    method: 'post',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
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
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  title,
  kind,
  description,
  isPublished,
  isFullfilled,
  taskCoords
) => {
  // console.log('### UPDATETASK BEFORE AXIOS AUTHN and DATA: ', authn);

  const requestConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'patch', // 'put',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
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
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  // title,
  // kind,
  // description,
  // isPublished,
  // isFullfilled,
  // taskCoords
) => {
  // console.log(
  //   '### UPDATETASK AS FULLFILLED BEFORE AXIOS AUTHN and DATA: ',
  //   authn
  // );

  const requestConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'patch',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
    data: {
      // title: title,
      // kind: kind,
      // description: description,
      is_published: false,
      is_fullfilled: true,
      // lat: taskCoords.lat,
      // lng: taskCoords.lng,
    },

    timeout: TASKS_API_TIMEOUT,
  };

  return axios(requestConfig);
};

const updateATaskAsPublished = async (
  authn,
  taskId
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  // title,
  // kind,
  // description,
  // isPublished,
  // isFullfilled,
  // taskCoords
) => {
  // console.log(
  //   '### UPDATETASK AS PUBLISHED BEFORE AXIOS AUTHN and DATA: ',
  //   authn
  // );

  const requestConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'patch',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
    data: {
      // title: title,
      // kind: kind,
      // description: description,
      is_published: true,
      // is_fullfilled: true,
      // lat: taskCoords.lat,
      // lng: taskCoords.lng,
    },

    timeout: TASKS_API_TIMEOUT,
  };

  return axios(requestConfig);
};

const updateATaskAsUnpublished = async (
  authn,
  taskId
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  // title,
  // kind,
  // description,
  // isPublished,
  // isFullfilled,
  // taskCoords
) => {
  // console.log(
  //   '### UPDATETASK AS PUBLISHED BEFORE AXIOS AUTHN and DATA: ',
  //   authn
  // );

  const requestConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'patch',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
    data: {
      // title: title,
      // kind: kind,
      // description: description,
      is_published: false,
      // is_fullfilled: true,
      // lat: taskCoords.lat,
      // lng: taskCoords.lng,
    },

    timeout: TASKS_API_TIMEOUT,
  };

  return axios(requestConfig);
};

// const updateATaskAsPublished = async (
//   authn,
//   taskId
//   // updateAuthnFunc,
//   // updateDataFunc,
//   // updateCountFunc,
//   // updateDataTrackerFunc,
//   // title,
//   // kind,
//   // description,
//   // isPublished,
//   // isFullfilled,
//   // taskCoords
// ) => {
//   console.log(
//     '### UPDATETASK AS PUBLISHED BEFORE AXIOS AUTHN and DATA: ',
//     authn
//   );

//   const requestConfig = {
//     url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
//     method: 'put',

//     headers: reqAuthnToHeaders(authn),
//     // params: {
//     //   id: id,
//     //   lat: coords.lat,
//     //   lng: coords.lng,
//     //   radius: radius,
//     // },
//     // params: {
//     //   // id: id,
//     //   task_id: taskid.toString(),
//     //   // user_id: authn.id.toString(),
//     //   is_active: true,
//     // },
//     data: {
//       // title: title,
//       // kind: kind,
//       // description: description,
//       is_published: true,
//       // is_fullfilled: false,
//       // lat: taskCoords.lat,
//       // lng: taskCoords.lng,
//     },

//     timeout: TASKS_API_TIMEOUT,
//   };

//   return axios(requestConfig);
// };

// const updateATaskAsUnpublished = async (
//   authn,
//   taskId
//   // updateAuthnFunc,
//   // updateDataFunc,
//   // updateCountFunc,
//   // updateDataTrackerFunc,
//   // title,
//   // kind,
//   // description,
//   // isPublished,
//   // isFullfilled,
//   // taskCoords
// ) => {
//   console.log(
//     '### UPDATETASK AS UNPUBLISHED BEFORE AXIOS AUTHN and DATA: ',
//     authn
//   );

//   const requestConfig = {
//     url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
//     method: 'patch',

//     headers: reqAuthnToHeaders(authn),
//     // params: {
//     //   id: id,
//     //   lat: coords.lat,
//     //   lng: coords.lng,
//     //   radius: radius,
//     // },
//     // params: {
//     //   // id: id,
//     //   task_id: taskid.toString(),
//     //   // user_id: authn.id.toString(),
//     //   is_active: true,
//     // },
//     data: {
//       // title: title,
//       // kind: kind,
//       // description: description,
//       is_published: false,
//       // is_fullfilled: false,
//       // lat: taskCoords.lat,
//       // lng: taskCoords.lng,
//     },

//     timeout: TASKS_API_TIMEOUT,
//   };

//   return axios(requestConfig);
// };

const deleteATask = async (
  authn,
  taskId
  // updateAuthnFunc,
  // updateDataFunc,
  // updateCountFunc,
  // updateDataTrackerFunc,
  // title,
  // kind,
  // description,
  // isPublished,
  // isFullfilled,
  // taskCoords
) => {
  //console.log('### DELETEATASK BEFORE AXIOS AUTHN and DATA: ', authn);

  const requestConfig = {
    url: `${API_TASKS_ROUTE}/${parseInt(taskId)}`,
    method: 'delete',

    headers: reqAuthnToHeaders(authn),
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    // params: {
    //   // id: id,
    //   task_id: taskid.toString(),
    //   // user_id: authn.id.toString(),
    //   is_active: true,
    // },
    // data: {
    //   title: title,
    //   kind: kind,
    //   description: description,
    //   is_published: isPublished,
    //   is_fullfilled: isFullfilled,
    //   lat: taskCoords.lat,
    //   lng: taskCoords.lng,
    // },

    timeout: TASKS_API_TIMEOUT,
  };

  return axios(requestConfig);
};

//////////////////////
/// fetchTaskStats
///////////////////////

const fetchTaskStats = async (
  authn //{ accessToken, client, expiry, uid, id },
) => {
  const reqConfig = {
    url: API_TASK_STATS_ROUTE,
    method: 'get',

    headers: reqAuthnToHeaders(authn),
    timeout: TASKS_API_TIMEOUT,
    // params: {
    //   user_id: userId,
    //   lat: lat,
    //   lng: lng,
    //   radius: radius,
    //   since: since,
    // },
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
  // updateATaskByIdWith,
  // updateATaskWith,
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
