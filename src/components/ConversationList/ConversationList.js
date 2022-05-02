// Chat
import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import Avatar from '../Avatar';
import {FaHandsHelping, FaLeaf, FaParachuteBox} from 'react-icons/fa';
// import tasks from '../../services/TasksServices';
import './ConversationList.css';
// import {
//   getProfileConversations,
//   createConversation,
// } from "../../services/ConversationsServices";
// import { UserContext } from "../../services/LoggedProfileContext";
import {ConversationsContext, Notification,} from '../../AppPrelude';
import UserAuthnContext from '../../services/UserAuthnContext';
import UserProfileContext from '../../services/UserProfileContext';
import {MATERIALNEED, ONETIMETASK} from '../../services/apiServices';

export default function ConversationList({
                                             // userAuthn,
                                             // setUserAuthn,
                                             // userProfile,
                                             // coords,
                                             // conversations,
                                             // setConversations,
                                             // setNewConversation,
                                             taskid,
                                             // conversations,
                                             ...restOfProps
                                         }) {
    // NOTE TODO in the current routing ConversationList is reached through...
    // ... /profile/conversations, making :taskid==null always
    // const { taskid } = useParams();
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
                                        ) : //<i className="fas fa-parachute-box" aria-hidden="true"></i>
                                        c.task?.kind === ONETIMETASK ? (
                                            <FaHandsHelping/>
                                        ) : (
                                            // <i className="fas fa-hands-helping" aria-hidden="true"></i>
                                            <FaLeaf/>
                                            // <i className="fas fa-leaf" aria-hidden="true"></i>
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

    // return (
    //   <div className='container'>

    //     <ul>{conversationsJSX}</ul>
    //   </div>
    // );
}

///////////// MOST RECENT /////////////////////////////////

// else {
//    // taskid null, means list all conversations by userAuthn

//     const conversationsJSX = conversations.map((c) => {
//       return (
//         <li key={c.id}>
//           <div className='tile mb-4'>
//             <article className='tile is-child notification is-info'>
//               <p className='title'>
//                 Conversation about task <em>{c.requestor_task_kind}</em>{' '}
//                 {c.task_id}
//               </p>
//               <h3>Task title: {c.requestor_task_title}</h3>
//               <Link to={`/conversations/${c.id}`} className='button'>
//                 Chat with
//                 <em>
//                   {c.requestor_preferred_name
//                     ? c.requestor_preferred_name
//                     : 'Requestor'}
//                 </em>
//                 <Avatar
//                   avatarUrl={c.requestor_avatar}
//                   size='small'
//                   description="Requestor's avatar"
//                 />
//               </Link>
//               <p className='subtitle'>
//                 Active conversation {c.is_active.toString()}
//               </p>
//               <p>Last updated at {c.updated_at}</p>
//             </article>
//           </div>
//         </li>
//       );
//     });

//     return (
//       <div className='box chat'>
//         <h1>
//           Active Conversations for <strong>{userProfile.preferredName}</strong>
//           <Avatar
//             avatarUrl={userProfile.avatar}
//             description="Volunteer's Avatar"
//           />
//         </h1>

//         <div className='content'>
//           <ul>{conversationsJSX}</ul>
//         </div>
//       </div>
//     );
//   }

/////////////// END OF MOST RECENT

///////////////////////////////////////////
////////////////////////////////////////

// else {
//     // taskid null, means list all conversations by userAuthn

//     const conversationsJSX = conversations.map((c) => {
//       return (
//         <li key={c.id}>
//           <div className="tile mb-4">
//             <article className="tile is-child notification is-info">
//               <p className="title">
//                 Conversation about task <em>{c.requestor_task_kind}</em>{" "}
//                 {c.task_id}
//               </p>
//               <h3>Task title: {c.requestor_task_title}</h3>
//               <Link to={`/conversations/${c.id}`} className="button">
//                 Chat with
//                 <em>
//                   {c.requestor_preferred_name
//                     ? c.requestor_preferred_name
//                     : "Requestor"}
//                 </em>
//                 <Avatar
//                   avatarUrl={c.requestor_avatar}
//                   size="small"
//                   description="Requestor's avatar"
//                 />
//               </Link>
//               <p className="subtitle">
//                 Active conversation {c.is_active.toString()}
//               </p>
//               <p>Last updated at {c.updated_at}</p>
//             </article>
//           </div>
//         </li>
//       );
//     });

//     return (
//       <div className="box chat">
//         <h1>
//           Active Conversations for <strong>{userProfile.preferredName}</strong>
//           <Avatar
//             avatarUrl={userProfile.avatar}
//             description="Volunteer's Avatar"
//           />
//         </h1>

//         <div className="content">
//           <ul>{conversationsJSX}</ul>
//         </div>
//       </div>
//     );
//   }
// }

/////////////////////////////////////////////

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
