// Chat
import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import Avatar from '../Avatar';
import {FaHandsHelping, FaLeaf, FaParachuteBox} from 'react-icons/fa';
import './ConversationList.css';

import {ConversationsContext, Notification,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';
import {MATERIALNEED, ONETIMETASK} from '../../services/apiServices';

export default function ConversationList({

                                             taskid,
                                             ...restOfProps
                                         }) {
    // NOTE TODO in the current routing ConversationList is reached through...
    // ... /profile/conversations, making :taskid==null always
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {conversations, setConversations} = useContext(ConversationsContext);

    let conversationsJSX = null;

    const taskConversations = Array.from(conversations.values()).filter(
        (conv) => conv.task_id == taskid
    );

    // const taskConversations = findConversationsByTaskId(conversations, taskid);

    if (taskConversations) {
        // a conversation was already started
        conversationsJSX = taskConversations.map((c) => {
            return (
                <li key={c.id}>
                    <div className='tile mb-4'>
                        <article className='tile is-child notification is-info'>
                            <p className='title'>
                                <em>
                                    {c.task?.kind === MATERIALNEED ? (
                                            <FaParachuteBox/>
                                        ) :
                                        c.task?.kind === ONETIMETASK ? (
                                            <FaHandsHelping/>
                                        ) : (

                                            <FaLeaf/>

                                        )}
                                </em>
                                Request:{c.task_id} | {c.requestor_task_title}
                            </p>

                            <Link to={`/conversations/${c.id}`} className='button'>
                                Chat with
                                <em>
                                    {c.requestor_preferred_name
                                        ? c.requestor_preferred_name
                                        : 'Requestor'}
                                </em>
                                <Avatar
                                    avatarUrl={c.requestor_avatar}
                                    size='small'
                                    description="Requestor's avatar"
                                />
                            </Link>
                            <p className='subtitle'>
                                Active conversation {c.is_active.toString()}
                            </p>
                            <p>Last updated at {c.updated_at}</p>
                        </article>
                    </div>
                </li>
            );
        });

        return (
            <div className='container'>
                <ul>{conversationsJSX}</ul>
            </div>
        );
    } else {
        conversationsJSX = (
            <>
                <Notification
                    type='error'
                    message={`No Conversation is associated with this Task ${taskid}`}
                />
            </>
        );

        return <div className='container'>{conversationsJSX}</div>;
    }


}

