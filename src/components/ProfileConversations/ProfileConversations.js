// Profileconversations
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import { FaParachuteBox, FaHandsHelping, FaLeaf } from 'react-icons/fa';

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
// import tasks from '../../services/TasksServices';
import './ProfileConversations.css';
// import {
//   getProfileConversations,
//   createConversation,
// } from "../../services/ConversationsServices";
// import { UserContext } from "../../services/LoggedProfileContext";
import Conversation from '../Conversation';
import ConversationData from '../ConversationData/ConversationData';
import {
  fetchConversations,
  // createConversation,
} from '../../services/ConversationsServices';
import {
  Notification,
  TasksContext,
  MapContext,
  AppStateContext,
  ConversationsContext,
} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';
import {
  ROLE_AS_OTHER,
  ROLE_AS_REQUESTOR,
  ROLE_AS_VOLUNTEER,
  ROLE_AS_ANY,
} from '../../services/appServices';

export default function ProfileConversations({
  // userAuthn,
  // setUserAuthn,
  // userProfile,
  // coords,
  // conversations,
  // setConversations,
  setNewConversation,
  ...restOfProps
}) {
  // NOTE TODO in the current routing ConversationList is reached through...
  // ... /profile/conversations, making :taskid==null always
  const { taskid } = useParams();
  const { userAuthn, setUserAuthn } = useContext(UserAuthnContext);
  const { userProfile, setUserProfile } = useContext(UserProfileContext);
  const { conversations, setConversations, setConversationsTracker } =
    useContext(ConversationsContext);
  const [displayedConversations, setDisplayedConversations] =
    useState(ROLE_AS_ANY); //

  if (taskid && conversations.size > 0) {
    // taskid not null, means resume conversation assocaited with taskid,...
    // ... or create new conversation associated with taskid
    // routed from new or resume conversation associated to :taskid
    const found = conversations.values().find((conv) => conv.task_id == taskid);
    if (found) {
      // a conversation was already started
      return <Conversation conversation={found} />;
    } else {
      return (
        <>
          <Notification
            type='error'
            message={`No Conversation is associated with this Task ${taskid}`}
          />
        </>
      );
    }
  } else if (conversations.size > 0) {
    // taskid null, means list all conversations related to current user: by current user and in reply to requests by current user

    const conversationsJSX = Array.from(conversations.values()).map(
      (conversation) => {
        // console.log('### ProfileConversations: conversation', conversation);
        return (
          <li key={conversation.id}>
            <div className='box'>
              <ConversationData conversation={conversation} />

              <Link to={`/conversations/${conversation.id}`} className='button'>
                Chat with
                <em>
                  {conversation?.requestor?.preferred_name
                    ? conversation.requestor.preferred_name
                    : 'Requestor'}
                </em>
                <Avatar
                  avatarUrl={conversation?.requestor?.avatar}
                  size='small'
                  description="Requestor's avatar"
                />
              </Link>
            </div>
          </li>
        );
      }
    );

    const conversationsAsVolunteerJSX = Array.from(conversations.values()).map(
      (conversation) => {
        if (conversation.role == ROLE_AS_VOLUNTEER) {
          return (
            <li key={conversation.id}>
              <div className='box'>
                <ConversationData conversation={conversation} />

                {conversation.is_active ? (
                  <Link
                    to={`/conversations/${conversation.id}`}
                    className='button is-large'>
                    Chat with:
                    <em>
                      {conversation.requestor?.preferred_name
                        ? conversation.requestor.preferred_name
                        : 'Requestor'}
                    </em>
                    {
                      // <Avatar
                      //   avatarUrl={conversation.requestor?.avatar}
                      //   size='small'
                      //   description="Requestor's avatar"
                      // />
                    }
                  </Link>
                ) : null}
              </div>
            </li>
          );
        } else {
          return null;
        }
      }
    );

    const conversationsAsRequestorJSX = Array.from(conversations.values()).map(
      (conversation) => {
        if (conversation.role == ROLE_AS_REQUESTOR) {
          return (
            <li key={conversation.id}>
              <div className='box'>
                <ConversationData conversation={conversation} />

                {conversation.is_active ? (
                  <Link
                    to={`/conversations/${conversation.id}`}
                    className='button is-large'>
                    View conversation
                  </Link>
                ) : null}
              </div>
            </li>
          );
        } else {
          return null;
        }
      }
    );

    return (
      <div className='container'>
        <div className='notification is-link'>
          <nav className='level'>
            <div className='level-left'>
              <div className='level-item'>
                <p className='subtitle is-5'>
                  <Avatar
                    avatarUrl={userProfile.avatar}
                    description="Volunteer's Avatar"
                  />
                </p>
              </div>
              <div className='level-item'>
                <div className='field has-addons'>
                  <p className='control'>
                    <span className='title'>{userProfile.preferredName}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='level-right'>
              <p
                className='level-item'
                onClick={() => setDisplayedConversations(ROLE_AS_ANY)}>
                <span className='tag'>
                  <strong>All</strong>
                </span>
              </p>
              <p
                className='level-item'
                onClick={() => setDisplayedConversations(ROLE_AS_VOLUNTEER)}>
                <span className='tag is-success'>
                  {' '}
                  <strong>As Volunteer</strong>
                </span>
              </p>
              <p
                className='level-item'
                onClick={() => setDisplayedConversations(ROLE_AS_REQUESTOR)}>
                <span className='tag is-info'>
                  {' '}
                  <strong>As Requestor</strong>
                </span>
              </p>
            </div>
          </nav>
        </div>
        {displayedConversations == ROLE_AS_ANY ||
        displayedConversations == ROLE_AS_VOLUNTEER ? (
          <>
            <div className='container'>
              <h1 className='title'>As Volunteer:</h1>
              <hr />
              <ul>{conversationsAsVolunteerJSX}</ul>
            </div>
          </>
        ) : null}
        <div>
          <hr />
        </div>
        {displayedConversations == ROLE_AS_ANY ||
        displayedConversations == ROLE_AS_REQUESTOR ? (
          <>
            <div className='container'>
              <h1 className='title'>As Requestor:</h1>
              <hr />
              <ul>{conversationsAsRequestorJSX}</ul>
            </div>
          </>
        ) : null}
      </div>
    );
  } else {
    return (
      <Notification
        type='INFORMATION'
        message='No Profile related Conversations'
      />
    );
  }
}
