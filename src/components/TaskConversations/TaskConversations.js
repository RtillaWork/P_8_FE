//
import React, {useContext, useEffect, useState} from 'react';

import {Link, useHistory, useParams,} from 'react-router-dom';
import './TaskConversations.css';

import ConversationData from '../ConversationData/ConversationData';
import {createActiveConversation,} from '../../services/ConversationsServices';
import {ConversationsContext, Notification, STATUS_ERROR, STATUS_READY, TasksContext,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';

import {deviseAuthnFromErr, deviseAuthnFromRes,} from '../../services/apiServices';

// TODO should be rename ConversationTask
export default function TaskConversations({

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
                    })
                    .catch((err) => {

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

