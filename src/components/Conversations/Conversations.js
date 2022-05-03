//
import React, {useContext, useEffect, useState} from 'react';
import Avatar from '../Avatar';

import {Link, useHistory, useParams,} from 'react-router-dom';
import './Conversations.css';

import ConversationData from '../ConversationData/ConversationData';
import {createActiveConversation, fetchAConversationByTaskId,} from '../../services/ConversationsServices';
import {ConversationsContext, Notification, STATUS_ERROR, STATUS_READY, TasksContext,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';

import {deviseAuthnFromErr, deviseAuthnFromRes,} from '../../services/apiServices';

// TODO should be rename ConversationTask
export default function Conversations({

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



    const [conversation, setConversation] = useState(null);
    const [conversationExists, setConversationExists] = useState(true);
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    useEffect(() => {
        if (!conversation && conversationExists) {
            fetchAConversationByTaskId(userAuthn, parseInt(taskid))
                .then((res) => {
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setConversation(res.data);
                    setConversationsTracker(0);
                    // setErrors([]);
                })
                .catch((err) => {

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

            if (!conversation && !conversationExists) {
                // a conversation was not already started...
                // ...create a new conversation and return a Conversation with the new Conversation
                // response =
                createActiveConversation(userAuthn, parseInt(taskid))
                    .then((res) => {
                        // console.log('###CREATE ACTIVE CONVERSATION RES: ', res);
                        setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                        setConversation(res.data);
                        setConversationsTracker(0);
                    })
                    .catch((err) => {

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


