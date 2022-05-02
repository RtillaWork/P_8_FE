// Chat
import React, {useContext, useEffect, useState} from 'react';
import Avatar from '../Avatar';

import {Link, useHistory, useParams,} from 'react-router-dom';
// import tasks from '../../services/TasksServices';
import './Conversations.css';
// import {
//   getProfileConversations,
//   createActiveConversation,
// } from "../../services/ConversationsServices";
// import { UserContext } from "../../services/LoggedProfileContext";
import ConversationData from '../ConversationData/ConversationData';
import {createActiveConversation, fetchAConversationByTaskId,} from '../../services/ConversationsServices';
import {ConversationsContext, Notification, STATUS_ERROR, STATUS_READY, TasksContext,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';

import {deviseAuthnFromErr, deviseAuthnFromRes,} from '../../services/apiServices';

// TODO should be rename ConversationTask
export default function Conversations({
                                          // userAuthn,
                                          // setUserAuthn,
                                          // userProfile,
                                          // coords,
                                          // conversations,
                                          // setConversations,
                                          // setConversationCount,
                                          // newConversation,
                                          // setNewConversation,
                                          ...restOfProps
                                      }) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {openTasks, profileTasks} = useContext(TasksContext);
    const {conversations, setConversations, setConversationsTracker} =
        useContext(ConversationsContext);
    const history = useHistory();

    // TODO strong assumption: taskid exists...
    // ... been routed from path="/requests/:taskid/conversations"
    const {taskid} = useParams();

    // setConversation(conversations.find((conv) => conv.task_id == taskid));
    // const existingConversation = conversations.find(
    //   (conv) => conv.task_id == parseInt(taskid)
    // );

    const [conversation, setConversation] = useState(null);
    const [conversationExists, setConversationExists] = useState(true);
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    // const [errors, setErrors] = useState([]);
    useEffect(() => {
        if (!conversation && conversationExists) {
            fetchAConversationByTaskId(userAuthn, parseInt(taskid))
                .then((res) => {
                    // console.log('###FETCH A CONVERSATION by taskId RES: ', res);
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setConversation(res.data);
                    setConversationsTracker(0);
                    // setErrors([]);
                })
                .catch((err) => {
                    //   console.log(
                    //   'DEBUG FETCH A CONVERSATION in USEEFFECT in <CONVERSATION> ERROR: ',
                    //   err?.message?,
                    //   err?.response?.headers,
                    //   err?.response?.data,
                    //   JSON.stringify(err)
                    // );
                    // setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    // console.log(
                    //   'DEBUG fetchAConversationByTaskId  FETCH A CONVERSATION in USEEFFECT in <CONVERSATIONS>ERROR: ',
                    //   // err.response.headers,
                    //   // err.response.data,
                    //   JSON.stringify(err)
                    // );
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setConversationExists(false);
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response?.data,
                    });
                });
        }
    });

    useEffect(() => {
        let isMounted = true;
        // let response = null;

        if (isMounted) {
            // console.log(
            //   "### useEFFECT FETCHTASKS isMOUNTED tasks= ",
            //   data,
            //   "RESPONSE/NEXT AUTHN= ",
            //   authnCredentials
            // );
            if (!conversation && !conversationExists) {
                // a conversation was not already started...
                // ...create a new conversation and return a Conversation with the new Conversation
                // response =
                createActiveConversation(userAuthn, parseInt(taskid))
                    .then((res) => {
                        // console.log('###CREATE ACTIVE CONVERSATION RES: ', res);
                        setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                        setConversation(res.data);
                        // setConversationsCount(res.data.length);
                        setConversationsTracker(0);
                        // setErrors([]);
                    })
                    .catch((err) => {
                        //   console.log(
                        //   'DEBUG FETCH A CONVERSATION in USEEFFECT in <CONVERSATION> ERROR: ',
                        //   err?.message?,
                        //   err?.response?.headers,
                        //   err?.response?.data,
                        //   JSON.stringify(err)
                        // );
                        // setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                        // console.log(
                        //   'DEBUG DEBUG CREATE A CONVERSATIONS in USEEFFECT in <CONVERSATIONS> ERROR: ',
                        //   // err.response.headers,
                        //   // err.response.data,
                        //   JSON.stringify(err)
                        // );
                        setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                        setConversationExists(false);
                        setstatus({
                            type: STATUS_ERROR,
                            content: err.response?.data,
                        });
                    });
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    if (conversation) {
        return (
            <>
                <ConversationData conversation={conversation}/>

                {
                    // <Link
                    //   type='button'
                    //   className='card-footer-item button is-primary'
                    //   to={`/conversations/${conversation.id.toString()}`}>
                    //   Start this Chat
                    // </Link>
                }

                <Link to={`/conversations/${conversation.id}`} className='button'>
                    Chat with
                    <em>
                        {conversation.requestor_preferred_name
                            ? conversation.requestor_preferred_name
                            : 'Requestor'}
                    </em>
                    <Avatar
                        avatarUrl={conversation.requestor_avatar}
                        size='small'
                        description="Requestor's avatar"
                    />
                </Link>
            </>
        );
    } else {
        return (
            <>
                <Notification
                    type='INFO'
                    message='LOADING OR CREATING A NEW CONVERSATION'
                />
            </>
        );
    }
}

/**
 * <Conversation
 conversation={conversation}
 conversations={conversations}
 // conversation,
 userAuthn={userAuthn}
 setUserAuthn={setUserAuthn}
 />
 */

/**
 *
 *     if (newConversation) {
        // a conversation was already started
        return <Conversation conversation={newConversation} />;
      } else {
        return (
          <>
            <Notification
              notification={{
                type: "error",
                content: "FAILED TO INITIATE CONVERSATION",
              }}
            />
          </>
        );
      }
 */

/**
 *
 *
 *  if (taskid) {
    // taskid not null, means resume conversation assocaited with taskid,...
    // ... or create new conversation associated with taskid
    // routed from new or resume conversation associated to :taskid
    let conversation = conversations.find((conv) => conv.task_id == taskid);
    if (conversation) {
      // a conversation was already started
      return <Conversation conversation={conversation} />;
    } else {
      // create a new conversation and return a Conversation with the new Conversation
      // let newConversation =
      createActiveConversation(userAuthn, setUserAuthn, taskid, setNewConversation);
      if (newConversation) {
        // a conversation was already started
        return <Conversation conversation={newConversation} />;
      } else {
        return (
          <>
            <Notification
              notification={{
                type: "error",
                content: "FAILED TO INITIATE CONVERSATION",
              }}
            />
          </>
        );
      }
    }
  } else {
    // taskid null, means there was an error in routing

    return (
      <>
        <Notification
          notification={{
            type: "error",
            content: ":taskid is null",
          }}
        />
      </>
    );
  }
 }

 */

/**

 // Chat
 import React, { useState, useEffect } from "react";
 import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
 import { Icon } from "leaflet";
 import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
 // import tasks from '../../services/TasksServices';
 import "./index.css";

 export default function Chat(props) {
  // let chatBox = {
  //   activeChats: [],
  //   activeChat: null,
  // }

  let [chatBox, setChatBox] = useState({
    activeChats: [],
    activeChat: null,
  });

  let { id } = useParams();
  // taskId <-> with chatId
  // one task <-> one chat
  // if taskId in activeChats
  // then { GET {activeConversation} }
  // else {chatBox.activeChats.push(taskId); chatBox.activeChat=taskId }
  // switches to the most recent chat and/or reopens ChatBox on most recent conversation}

 return (
 <div className="box chat">
 <h1>active chatbox tabs</h1>

 <span className="icon">
 <i className="fas fa-home"></i>
 </span>

 <h3>Chat box Tab {id}</h3>

 <div className="content">
 <ul>
 <li className="notification is-primary">chat msg etc</li>
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li>
 </ul>
 </div>
 </div>
 );
 }



 // ChatBox
 import React, { useState, useEffect } from "react";
 import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
 import { Icon } from "leaflet";
 import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
 // import tasks from '../../services/TasksServices';
 import "./index.css";

 export default function Conversation(props) {
  // let chatBox = {
  //   activeChats: [],
  //   activeChat: null,
  // }

  // let [conversation, setChatBox] = useState({
  //   activeChats: [],
  //   activeChat: null,
  // });

  let { id } = useParams();
  // taskId <-> with chatId
  // one task <-> one chat
  // if taskId in activeChats
  // then { GET {activeConversation} }
  // else {chatBox.activeChats.push(taskId); chatBox.activeChat=taskId }
  // switches to the most recent chat and/or reopens ChatBox on most recent conversation}

 return (
 <div className="box chat">
 <h1>active chatbox tabs</h1>

 <span className="icon">
 <i className="fas fa-home"></i>
 </span>

 <h3>Chat box Tab {id}</h3>

 <div className="content">
 <ul>
 <li className="notification is-primary">chat msg etc</li>
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li> <li>chat msg etc</li> <li>chat msg etc</li>{" "}
 <li>chat msg etc</li>
 </ul>
 </div>
 </div>
 );
 }
 */
