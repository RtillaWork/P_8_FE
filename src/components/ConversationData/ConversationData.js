// ConversationData
import React from 'react';
import {FaHandsHelping, FaLeaf, FaParachuteBox} from 'react-icons/fa';
// import tasks from '../../services/TasksServices';
import './ConversationData.css';
// import {
//   getProfileConversations,
//   createConversation,
// } from "../../services/ConversationsServices";
// import { UserContext } from "../../services/LoggedProfileContext";
import {ROLE_AS_REQUESTOR, ROLE_AS_VOLUNTEER,} from '../../services/appServices';
import {MATERIALNEED, ONETIMETASK} from '../../services/apiServices';

export default function ConversationData({conversation, debug = false}) {
    const conversationClassName = !conversation.is_active
        ? 'is-dark'
        : conversation.role == ROLE_AS_VOLUNTEER
            ? 'is-success'
            : 'is-info';

    return (
        <div className='tile mb-4'>
            <article
                className={`tile is-child notification ${conversationClassName}`}>
                <p className='subtitle'>
                    Conversation (id: {conversation.id} )
                    {conversation.is_active ? ' is active' : ' is not active'}
                </p>
                {debug ? (
                    <p className='subtitle'>
                        initiated by{' '}
                        {conversation.role == ROLE_AS_VOLUNTEER
                            ? 'you'
                            : conversation.role == ROLE_AS_REQUESTOR
                                ? ` User id ${conversation.user_id}`
                                : 'user'}
                    </p>
                ) : null}
                <p className='subtitle'>
                    Request id: {conversation.task_id}
                    <em>
                        {conversation?.task?.kind === MATERIALNEED ? (
                                <FaParachuteBox/>
                            ) : //<i className="fas fa-parachute-box" aria-hidden="true"></i>
                            conversation?.task?.kind === ONETIMETASK ? (
                                <FaHandsHelping/>
                            ) : (
                                // <i className="fas fa-hands-helping" aria-hidden="true"></i>
                                <FaLeaf/>
                                // <i className="fas fa-leaf" aria-hidden="true"></i>
                            )}
                    </em>
                </p>

                <p className='subtitle'>Request Title: {conversation?.task?.title}</p>
                {debug ? <p>Last updated: {conversation.updated_at}</p> : null}
            </article>
        </div>
    );
}
