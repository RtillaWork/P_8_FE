// Conversation
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {useParams,} from 'react-router-dom';
// import tasks from '../../services/TasksServices';
import './Conversation.css';
import Messages from '../Messages';
import ConversationData from '../ConversationData/ConversationData';

import {
    createMessage,
    fetchAConversation,
    fetchMessagesByConversationId,
    leaveAConversation,
} from '../../services/ConversationsServices';

import {
    ConversationsContext,
    MESSAGE_MAX_SIZE,
    Notification,
    STATUS_ERROR,
    STATUS_READY,
    STATUS_WAITING,
} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';

import {deviseAuthnFromErr, deviseAuthnFromRes, MESSAGES_PERIODICUPDATE_INTERVAL,} from '../../services/apiServices';

export default function Conversation({...restOfProps}) {
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {conversations, setConversations, triggerConversations} =
        useContext(ConversationsContext);
    const history = useHistory();

    let {convid} = useParams();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesTracker, setMessagesTracker] = useState(null);
    const [chatText, setChatText] = useState('');

    useEffect(() => {
        if (!conversation) {
            setstatus({
                type: STATUS_WAITING,
                content: {application: 'FETCHING CONVERSATION'},
            });
            fetchAConversation(userAuthn, parseInt(convid))
                .then((res) => {
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setConversation(res.data);
                    setMessagesTracker(Date.now());
                    setstatus({
                        type: STATUS_READY,
                        content: null,
                    });
                })
                .catch((err) => {

                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response?.data,
                    });
                });
        }
    }, [conversation]);

    useEffect(() => {
        if (conversation) {

            fetchMessagesByConversationId(userAuthn, conversation.id)
                .then((res) => {

                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setMessages(res.data);
                })
                .catch((err) => {
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response?.data,
                    });
                });
        }
    }, [messagesTracker]);

    //////////////////////////////
    // Periodic poll for messages update by last requested at: for now reloads all conversations
    //////////////////////////////
    useEffect(() => {
        const periodicMessageTracker = setInterval(() => {
            setMessagesTracker(Date.now());
        }, MESSAGES_PERIODICUPDATE_INTERVAL);

        return () => {
            clearInterval(periodicMessageTracker);
        };
    });


    const handleChatText = (e) => {
        // update
        e.preventDefault();
        setChatText(e.target.value);
    };

    const handleLeaveConversation = (e) => {
        e.preventDefault();
        leaveAConversation(userAuthn, conversation.id)
            .then((res) => {

                setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                history.push('/profile/conversations');
            })
            .catch((err) => {

                setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response?.data,
                });
            });
    };

    const handleSendMessage = (e) => {
        // create new message associated with props.
        e.preventDefault();

        createMessage(userAuthn, conversation.id, chatText)
            .then((res) => {
                // console.log(res);
                setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                // setMessages((prevData) =>{
                //   prevData.push(res.data);
                // });
                setMessagesTracker(Date.now());
                setChatText('');
            })
            .catch((err) => {
                // console.log(err);
                // setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                console.log(
                    'DEBUG CREATE MESSAGE in handleSendMessage in <CONVERSATION> ERROR: ',
                    // err.response.headers,
                    // err.response.data,
                    JSON.stringify(err)
                );
                setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data,
                });
                // setMessagesTracker(Date.now());
            });
    };

    if (conversation) {
        return (
            <div className='container'>
                <section className='hero is-small'>
                    <div className='hero-head is-hidden-mobile'>
                        <header className='hero is-secondary is-bold'>
                            <ConversationData conversation={conversation}/>
                        </header>
                    </div>
                    <div className='box chatbox'>
                        <div className='hero-body'>
                            <Messages messages={messages}/>
                        </div>
                    </div>

                    <div className='hero-foot'>
                        <footer className='section is-small'>
                            <div className='field has-addons'>
                                <div className='control is-expanded'>
                                    <input
                                        className='input'
                                        type='text'
                                        value={chatText}
                                        name='chat_text'
                                        onChange={handleChatText}
                                        maxLength={MESSAGE_MAX_SIZE}
                                        placeholder='Type your message: 280 characters or less'
                                    />
                                </div>
                            </div>
                            <div className='field'>
                                <div className='control'>
                                    <button
                                        className='button is-fullwidth is-success'
                                        aria-label='send'
                                        onClick={handleSendMessage}>
                                        Send
                                    </button>
                                </div>
                            </div>
                            <div className='field'>
                                <div className='control'>
                                    <button
                                        className='button is-fullwidth is-warning'
                                        onClick={handleLeaveConversation}>
                                        Leave Conversation
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </section>
            </div>
        );
    } else {
        return (
            <>
                <Notification
                    type='information'
                    message={`LOADING CONVERSATION /conversations/${convid}`}
                />
            </>
        );
    }
}
