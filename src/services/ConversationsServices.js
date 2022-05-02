// Conversations

// State:
// allConversations = getConversations(loggedProfile.radius) from /conversations
// hiddenConversations = getHiddenConversations() from LocalStorage
// activeConversations = getActiveConversations() from allConversations and not in hiddenConversations
// selectedTask = null : if (loggedProfile.taskView==null // both views) selectedTask takes the onClicked task.id to highlight both
// TODO generator or iterator?

import axios from 'axios';

import {
    API_CONVERSATIONS_ROUTE,
    API_MESSAGES_ROUTE,
    API_TASKS_ROUTE,
    CONVERSATIONS_API_TIMEOUT,
    reqAuthnToHeaders,
} from './apiServices';

const updateConversationStoreFrom = (previousState, data) => {
    const newConvs = new Map(previousState);
    data.forEach((c) => {
        newConvs.set(c.id, c);
    });
    console.log('updateConversationStoreFrom: ', newConvs);
    return newConvs;
};

const findConversationsByTaskId = (conversationMap, taskid) => {
    const foundList = [];
    conversationMap.forEach((c) => {
        if (c.task_id == taskid) {
            foundList.push(c);
        }
    });
    return foundList;
};

// TODO flip the fetchTask params order similarily
const fetchConversations = async (
    authn //{ accessToken, client, expiry, uid, id },
    // updateAuthnFunc,
    // updateDataFunc,
    // updateCountfunc
) => {
    const reqConfig = {
        url: API_CONVERSATIONS_ROUTE,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: CONVERSATIONS_API_TIMEOUT,
        // params: {
        //   user_id: userId,
        //   lat: lat,
        //   lng: lng,
        //   radius: radius,
        // },
    };

    return axios(reqConfig);
};

//
const fetchAConversation = async (
    authn, //{ accessToken, client, expiry, uid, id },
    convId
    // updateAuthnFunc,
    // updateDataFunc,
    // updateCountfunc
) => {
    const reqConfig = {
        url: `${API_CONVERSATIONS_ROUTE}/${parseInt(convId)}`,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: CONVERSATIONS_API_TIMEOUT,
        // params: {
        //   user_id: userId,
        //   lat: lat,
        //   lng: lng,
        //   radius: radius,
        // },
    };

    return axios(reqConfig);
};

// fetches a conversation by taskID for the current user
const fetchAConversationByTaskId = async (
    authn, //{ accessToken, client, expiry, uid, id },
    taskId
    // updateAuthnFunc,
    // updateDataFunc,
    // updateCountfunc
) => {
    const reqConfig = {
        url: `${API_TASKS_ROUTE}/${parseInt(taskId)}/conversation`,
        method: 'get',

        headers: reqAuthnToHeaders(authn),
        timeout: CONVERSATIONS_API_TIMEOUT,
        // params: {
        //   user_id: userId,
        //   lat: lat,
        //   lng: lng,
        //   radius: radius,
        // },
    };

    return axios(reqConfig);
};

/////// New
// Create a conversation between volunteer userAuthn.id and taskid.user_id regarding taskid
const createActiveConversation = async (authn, taskid) => {
    // console.log('### CREATECONVERSATTION BEFORE AXIOS AUTHN and DATA: ', authn);

    const requestConfig = {
        url: API_CONVERSATIONS_ROUTE,
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
            task_id: parseInt(taskid),
            // user_id: authn.id.toString(),
            is_active: true,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};
///// END New createConversation

/////// New
// test creating an conversation between volunteer userAuthn.id and taskid.user_id regarding taskid
const createInactiveConversation = async (authn, taskid) => {
    const requestConfig = {
        url: API_CONVERSATIONS_ROUTE,
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
            task_id: parseInt(taskid),
            // user_id: authn.id.toString(),
            is_active: false,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};
///// END New createConversation

///////
// update a conversation between volunteer userAuthn.id and taskid.user_id regarding taskid by switch is_active true/false
const updateAConversation = async (authn, convId, taskId, isActive) => {
    // console.log('### CREATECONVERSATTION BEFORE AXIOS AUTHN and DATA: ', authn);

    const requestConfig = {
        url: `${API_CONVERSATIONS_ROUTE}/${parseInt(convId)}`,
        method: 'put',

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
            task_id: parseInt(taskId),
            // user_id: authn.id.toString(),
            is_active: isActive,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};
///// END  updateConversation

///////
// leave a conversation between volunteer userAuthn.id and taskid.user_id regarding taskid by switch is_active true/false
const leaveAConversation = async (authn, convId) => {
    // console.log('### CREATECONVERSATTION BEFORE AXIOS AUTHN and DATA: ', authn);

    const requestConfig = {
        url: `${API_CONVERSATIONS_ROUTE}/${parseInt(convId)}`,
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
            // task_id: parseInt(taskId),
            // user_id: authn.id.toString(),
            is_active: false,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};
///// END  updateConversation

///////
// delete a conversation between volunteer userAuthn.id and taskid.user_id regarding taskid
const deleteAConversation = async (authn, convId) => {
    const requestConfig = {
        url: `${API_CONVERSATIONS_ROUTE}/${parseInt(convId)}`,
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
        //   task_id: parseInt(taskid),
        //   // user_id: authn.id.toString(),
        //   is_active: isActive,
        // },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};
///// END deleteConversation

//////////////////////////////
////// fetch messages by conversation id
////////////////////////////
const fetchMessagesByConversationId = async (
    authn,
    conversationId
    //{ accessToken, client, expiry, uid, id },
    // updateAuthnFunc,
    // updateDataFunc
) => {
    // console.log(
    //   '### ConversationServices fetchMessages BEFORE AXIOS AUTHN and DATA: conversationId= ',
    //   conversationId,
    //   authn
    // );

    const requestConfig = {
        url: API_MESSAGES_ROUTE,
        method: 'get',
        headers: reqAuthnToHeaders(authn),
        timeout: CONVERSATIONS_API_TIMEOUT,
        // params: {
        //   // id: id,
        //   conversation_id: parseInt(conversationId), //.toString(),
        //   // user_id: authn.id.toString(),
        //   // text: text,
        // },
        params: {
            conversation_id: conversationId,
            // user_id: authn.id.toString(),
        },
        data: {
            message: {
                conversation_id: conversationId,
                // user_id: authn.id.toString(),
            },
        },
    };

    return axios(requestConfig);
};

//
const createMessage = async (
    authn,
    conversationId,
    text //{ accessToken, client, expiry, uid, id },
    // updateAuthnFunc,
    // updateDataFunc
) => {
    // console.log(
    //   '### ConversationServices fetchMessages BEFORE AXIOS AUTHN and DATA: conversationId= ',
    //   conversationId,
    //   authn
    // );

    const requestConfig = {
        url: API_MESSAGES_ROUTE,
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
        //   conversation_id: parseInt(conversationId),
        //   // user_id: authn.id.toString(),
        //   text: text,
        // },
        data: {
            // id: id,
            conversation_id: parseInt(conversationId),
            // user_id: authn.id.toString(),
            text: text,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const updateMessageAsDeleted = async (
    authn,
    conversationId
    // text //{ accessToken, client, expiry, uid, id },
    // updateAuthnFunc,
    // updateDataFunc
) => {
    // console.log(
    //   '### ConversationServices updateMessageAsDeleted BEFORE AXIOS AUTHN and DATA: conversationId= ',
    //   conversationId,
    //   authn
    // );

    const requestConfig = {
        url: API_MESSAGES_ROUTE,
        method: 'put',
        headers: reqAuthnToHeaders(authn),
        // params: {
        //   id: id,
        //   lat: coords.lat,
        //   lng: coords.lng,
        //   radius: radius,
        // },
        // params: {
        //   // id: id,
        //   conversation_id: parseInt(conversationId),
        //   // user_id: authn.id.toString(),
        //   text: text,
        // },
        data: {
            // id: id,
            conversation_id: parseInt(conversationId),
            // user_id: authn.id.toString(),
            text: `THIS MESSAGE HAS BEEN REMOVED BY USER ID ${
                authn.uid
            } on ${Date.now()}`,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

const deleteMessage = async (
    authn,
    conversationId
    // text //{ accessToken, client, expiry, uid, id },
    // updateAuthnFunc,
    // updateDataFunc
) => {
    // console.log(
    //   '### ConversationServices deleteMessages BEFORE AXIOS AUTHN and DATA: conversationId= ',
    //   conversationId,
    //   authn
    // );

    const requestConfig = {
        url: API_MESSAGES_ROUTE,
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
        //   conversation_id: parseInt(conversationId),
        //   // user_id: authn.id.toString(),
        //   text: text,
        // },
        data: {
            // id: id,
            conversation_id: parseInt(conversationId),
            // user_id: authn.id.toString(),
            // text: text,
        },

        timeout: CONVERSATIONS_API_TIMEOUT,
    };

    return axios(requestConfig);
};

export {
    updateConversationStoreFrom,
    fetchConversations,
    fetchAConversation,
    createActiveConversation,
    createInactiveConversation,
    updateAConversation,
    leaveAConversation,
    deleteAConversation,
    // fetchMessages,
    fetchMessagesByConversationId,
    fetchAConversationByTaskId,
    createMessage,
    updateMessageAsDeleted,
    deleteMessage,
    findConversationsByTaskId,
};
