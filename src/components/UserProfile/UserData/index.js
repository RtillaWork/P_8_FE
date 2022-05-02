// UserData
import React from "react";

export default function UserData({
                                     userAuthn,
                                     setUserAuthn,
                                     userProfile,
                                     setUserProfile,
                                     radius,
                                     coords,
                                     mapCoords,
                                     tasks,
                                     setCoords,
                                     setMapCoords,
                                     setRadius,
                                     userCoords,
                                     ...restOfProps
                                 }) {
    return (
        <>
            {" "}
            <h1 className="title is-2">User Data</h1>
            <h2 className="subtitle is-4">User Data </h2>
            <br/>
            <p className="has-text-centered">
                <a className="button is-medium is-info is-outlined">Update</a>
            </p>
        </>
    );
}

////////////////////////////////////////////////////////

/**




 * */

/*******************
 *
 * return (
 <div>
 <h1>APP</h1>
 <h2>PROFILE</h2>
 <br />
 <p>
 {console.log("### PROFILE returns: userAuthn", userAuthn)}
 {JSON.stringify(userAuthn)}
 </p>
 <br />
 <p>{radius}</p>
 <br />
 <p>User coords</p>

 <p>{JSON.stringify(coords)}</p>
 <br />
 <p>map coords</p>
 <p>{JSON.stringify(mapCoords)}</p>
 <br />
 <p></p>
 <p>user coords</p>
 <p>{JSON.stringify(userCoords)}</p>
 <br />
 <p>
 {console.log("### PROFILE returns useProfile: ", userProfile)}
 {JSON.stringify(userProfile)}
 </p>
 <br />
 <p> </p>
 <br />
 {console.log("### PROFILE returns TASKS: ", tasks)}

 <p>{JSON.stringify(tasks)}</p>
 <br />
 </div>
 );
 */

/////////////////////////////////
/******************************

 import {
  getCurrentRadius,
  getTasksView,
  getCurrentZoom,
} from "../../services/AppServices";
 import { getCurrentCoords } from "../../services/MapServices";

 import AuthService from "../../services/AuthnServices";
 import {
  fetchAllTasks,
  getHiddenTasks,
  getActiveTasks,
} from "../../services/TasksServices";

 import { getProfileConversations } from "../../services/ConversationsServices";
 import { getTasksAsRequestor } from "../../services/TasksServices";

 export default function Profile(props) {
  let currentUserTasks = fetchAllTasks().filter(
    (task) => task.userId === props.user.user.id
  );
  let currentUserTasksJsx = currentUserTasks.map((task) => (
    <div className="box"> {JSON.stringify(task)} </div>
  ));

  let currentUserConversations = props.conversations.filter(
    (conv) => conv.userId === props.user.user.id
  );
  let currentUserConversationsJsx = currentUserConversations.map((conv) => (
    <div className="box"> {JSON.stringify(conv)} </div>
  ));

  return (
    <div>
      <h1>User {props.user.user.id} Profile</h1>
      {JSON.stringify(props.user, null, "    ")}

      <br />
      <br />
      <br />
      <br />

      <h1>Tasks this user {props.user.user.id} created</h1>
      <div>{currentUserTasksJsx}</div>

      <br />
      <br />
      <br />
      <br />

      <h1>chats this user {props.user.user.id} replied to</h1>
      <div>{currentUserConversationsJsx}</div>

      <br />
      <br />
      <br />
      <br />

      <h1>
        Tasks this user {props.user.user.id} started as a Requestor
        getTasksAsRequestor{" "}
      </h1>
      <div>{JSON.stringify(getTasksAsRequestor(props.user.user.id))}</div>
      <br />
      <br />
      <br />
      <br />

      <h1>
        chats this user {props.user.user.id} associated with either way
        getProfileConversations
      </h1>
      <div>{JSON.stringify(getProfileConversations(props.user.user.id))}</div>
    </div>
  );
}


 ***************************************************/

// const currentUser = AuthService.getCurrentUser();

// return (
//   <div>
//     <header>
//       <h2>
//         <strong>{currentUser.email}</strong> Profile
//       </h2>
//     </header>
//     <p>
//       <strong>Token:</strong> {currentUser.authToken}
//     </p>
//     <p>
//       <strong>Id:</strong> {currentUser.id}
//     </p>

//   </div>
// );

/*********************************
 let currentUserTasks = props.tasks.filter(task => task.userId === props.user.user.id);
 let currentUserTasksJsx = currentUserTasks.map(task => <div className="box"> {JSON.stringify(task)} </div>    ) ;

 let currentUserChats = props.chats.filter(chat => chat.userId === props.user.user.id);
 let currentUserChatsJsx = currentUserChats.map(chat => <div className="box"> {JSON.stringify(chat)} </div> );


 return <div><h1>User {props.user.user.id} Profile</h1>
 {JSON.stringify(props.user, null, "    ")}

 <br/>
 <br/>
 <br/>
 <br/>

 <h1>Tasks this user {props.user.user.id} created</h1>
 <div>
 {currentUserTasksJsx}
 </div>

 <br/>
 <br/>
 <br/>
 <br/>

 <h1>chats this user {props.user.user.id} replied to</h1>
 <div>{ currentUserChatsJsx  }</div>

 </div>
 };


 ***********/
