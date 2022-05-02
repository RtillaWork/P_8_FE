// Chat
import React, {useContext, useEffect, useState} from 'react';

import {Link, useHistory, useParams,} from 'react-router-dom';
// import tasks from '../../services/TasksServices';
import './TaskConversations.css';
// import {
//   getProfileConversations,
//   createActiveConversation,
// } from "../../services/ConversationsServices";
// import { UserContext } from "../../services/LoggedProfileContext";
import ConversationData from '../ConversationData/ConversationData';
import {createActiveConversation,} from '../../services/ConversationsServices';
import {ConversationsContext, Notification, STATUS_ERROR, STATUS_READY, TasksContext,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';

import {deviseAuthnFromErr, deviseAuthnFromRes,} from '../../services/apiServices';

// TODO should be rename ConversationTask
export default function TaskConversations({
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
    const {profileTasks} = useContext(TasksContext);
    const {conversations, setConversations, setConversationsTracker} =
        useContext(ConversationsContext);
    const history = useHistory();

    const {taskid} = useParams();

    // const [conversation, setConversation] = useState(
    //   findConversationsByTaskId(conversations, parseInt(taskid))
    // );
    const [conversation, setConversation] = useState(null);
    // const [conversationExists, setConversationExists] = useState(true);
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    if (!taskid) {
        setstatus({
            type: STATUS_ERROR,
            content: {application: ['taskid in the link cannot be blank']},
        });
    }

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
            if (!conversation) {
                // a conversation was not already started...
                // ...create a new conversation and return a Conversation with the new Conversation
                // response =
                createActiveConversation(userAuthn, parseInt(taskid))
                    .then((res) => {
                        console.log('###CREATE ACTIVE CONVERSATION RES: ', res);
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
                        console.log(
                            'DEBUG DEBUG CREATE A CONVERSATIONS in USEEFFECT in <CONVERSATIONS> ERROR: ',
                            // err.response.headers,
                            // err.response.data,
                            JSON.stringify(err)
                        );
                        setUserAuthn(deviseAuthnFromErr(userAuthn, err));
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

    if (profileTasks.has(parseInt(taskid))) {
        // list of conversations associated with user task
        return (
            <>
                <Link
                    type='button'
                    className='card-footer-item button is-primary'
                    to={`/profile/conversations`}>
                    Go to My Conversations
                </Link>
            </>
        );
    } else if (taskid && conversation) {
        return (
            <>
                <ConversationData conversation={conversation}/>
                {conversation.is_active ? (
                    <Link
                        type='button'
                        className='card-footer-item button is-primary'
                        to={`/conversations/${conversation.id}`}>
                        Start this Chat
                    </Link>
                ) : (
                    <Link
                        type='button'
                        className='card-footer-item button is-secondary'
                        to={`/`}>
                        Home
                    </Link>
                )}
            </>
        );
    } else {
        return (
            <>
                <Notification type='INFO' message={JSON.stringify(status.content)}/>
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
