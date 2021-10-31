// // TaskFormUpdate
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   Link,
//   NavLink,
//   Switch,
//   Route,
//   Redirect,
//   useParams,
//   useHistory,
// } from 'react-router-dom';
// // import { DirectUpload } from "activestorage";

// import './TaskForm.css';

// import {
//   createTask,
//   updateTask,
//   deleteATask,
// } from '../../services/TasksServices';
// import {
//   ONETIMETASK,
//   MATERIALNEED,
//   userProfileFromHttpRes,
//   deviseAuthnResRefresh,
// } from '../../services/apiServices';
// import {
//   UserAuthnContext,
//   UserProfileContext,
//   NotificationPopup,
// } from '../../AppPrelude';
// import { STATUS_ERROR, STATUS_READY } from '../../services/appServices';
// import TasksContext from '../../services/TasksContext';
// import MapContext from '../../services/MapContext';

// export default function TaskForm({
//   // coords,
//   // userCoords,
//   // mapCoords,
//   // tasks,
//   // setTasksLastUpdateTimeTracker,
//   debug = false,
//   ...restOfProps
// }) {
//   const { userAuthn, setUserAuthn } = useContext(UserAuthnContext);
//   const { userProfile, setUserProfile } = useContext(UserProfileContext);
//   const {
//     // openTasks,
//     profileTasks,
//     setTasksLastUpdateTimeTracker,
//     setProfileTasksLastUpdateTimeTracker,
//   } = useContext(TasksContext);
//   const { userCoords, mapCoords } = useContext(MapContext);
//   const history = useHistory();
//   let { taskid } = useParams();

//   const [status, setstatus] = useState({ status: STATUS_READY, content: [] }); // <- TODO content should be initialized to null

//   // initial state: isUpdating: false, default is create new task
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [task, setTask] = useState(null);
//   if (taskid) {
//     // taskid exists; thus this is updating an existing task if task exists by taskid in current DB
//     const taskToUpdate = profileTasks.find((t) => {
//       return t.id == taskid;
//     });

//     if (taskToUpdate) {
//       // found the task to update by task id
//       setIsUpdating(true);
//       setTask(taskToUpdate);
//       // setIsCreating(false);
//     } else {
//       console.log(
//         "ERROR TASKFORM COULDN't FIND TASK TO UPDATE referenced as :taskid ",
//         taskid,
//         'in the loaded tasks DB'
//       );
//     }
//   }

//   // const [isCreating, setIsCreating] = useState(false);
//   const [title, setTitle] = useState('');
//   const [kind, setKind] = useState(MATERIALNEED); // default MATERIALNEED
//   const [description, setDescription] = useState('');
//   // if (description == null || description == undefined || description == "") {
//   //   setDescription(title);
//   // }
//   const [isPublished, setIsPublished] = useState(false);
//   const [isFullfilled, setIsFullfilled] = useState(false);

//   const [taskCoords, setTaskCoords] = useState(userCoords); // TODO: add location icon to fill in current location to override

//   // const handleToggleIsUpdating = (e) => {
//   //   e.preventDefault();
//   //   if (!isUpdating) {
//   //     setIsUpdating(true);
//   //   } else {
//   //     setIsUpdating(false);
//   //   }
//   // };

//   const handleFromMapCoords = (e) => {
//     e.preventDefault();
//     setTaskCoords(mapCoords);
//   };

//   const handleTitleChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setTitle(e.target.value);
//   };
//   const handleKindChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setKind(e.target.value);
//   };

//   const handleDescriptionChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setDescription(e.target.value);
//   };
//   const handleIsPublishedChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setIsPublished(e.target.value);
//   };
//   const handleIsFullfilledChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setIsFullfilled(e.target.value);
//   };

//   const handleTaskCoordsChange = (e) => {
//     e.preventDefault();
//     // console.log(e.target.value);
//     setTaskCoords(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isUpdating) {
//       console.log(
//         'MOCK UPDATE REQUEST: ',
//         title,
//         kind,
//         description,
//         isPublished,
//         isFullfilled,
//         taskCoords,

//         userAuthn
//       );
//       // updatin an existing task
//       // const { resCreateTask, resAuthnCredentials, error } = await createTask(
//       //   title,
//       //   kind,
//       //   description,
//       //   // isPublished,
//       //   isFullfilled,
//       //   // taskCoords,
//       //   // email,
//       //   // govId,
//       //   // password,
//       //   // passwordConfirmation,
//       //   userAuthn
//       // );

//       // console.log("### FROM <PROFILE> User update: ", resTask);
//       // console.log("### FROM <PROFILE>Authn update: ", resAuthnCredentials);
//       // if (resTask) {
//       //   setTask(resTask);
//       //   console.log("# UPDATED USER PROFILE: resTask", resTask);
//       // } else {
//       //   console.log("ERROR PROFILE UPDATE: ERR", error);
//       // }
//       // if (resAuthnCredentials) {
//       //   setUserAuthn(resAuthnCredentials);
//       //   console.log(
//       //     "# UPDATED USER AUTHN after update: resAuthnCredentials",
//       //     resAuthnCredentials
//       //   );
//       // } else {
//       //   console.log("ERROR PROFILE UPDATE: ERR", error);
//       // }
//     }
//     // if Signin error returns user does not exist
//     // setIsSignUp(true);

//     // if is
//     else {
//       // Create a new Request

//       // creating a new task
//       // const {
//       // resCreateTask,

//       //   resAuthnCredentials,
//       //   error,
//       // } = createTask(
//       //   userAuthn,
//       //   setUserAuthn,
//       //   // setTask,
//       //   setTasksLastUpdateTimeTracker,
//       //   title,
//       //   kind,
//       //   description,
//       //   isPublished,
//       //   isFullfilled,
//       //   taskCoords
//       // );

//       createTask(
//         userAuthn,
//         title,
//         kind,
//         description,
//         isPublished,
//         isFullfilled,
//         taskCoords
//       )
//         .then((res) => {
//           setUserAuthn(deviseAuthnResRefresh(userAuthn, res));
//           setTasksLastUpdateTimeTracker(Date.now());
//           history.push('/');
//         })
//         .catch((err) => {
//           console.log(
//             'DEBUG createTask TASKFOM ERROR: ',
//             err?.response?.headers,
//             err?.response?.data,
//             JSON.stringify(err?.response)
//           );
//           // setUserAuthn(deviseAuthnResRefresh(userAuthn, err.response));
//           // setstatus({ status: STATUS_ERROR, content: [...err.response.data] });
//         });

//       // .catch((err) => console.log('DEBUG ERROR TASK CREATE: ', err));

//       // .then((yes) => {
//       //   console.log(" CREATE REQUEST SUCCESS returns: ", yes);
//       //   // setTasksLastUpdateTimeTracker(Date.now());s
//       // })
//       // .catch((err) => console.log("createTask returns error: ", err));

//       //   console.log("### FROM <TaskFrom> Create Task: ", resCreateTask);
//       //   console.log(
//       //     "### FROM <TaskFrom> Create Task:Authn update: ",
//       //     resAuthnCredentials
//       //   );
//       //   if (resCreateTask) {
//       //     setTask(resCreateTask);
//       //     console.log("# UPDATED setTASK in TaskForm: resTask", resCreateTask);
//       //   } else {
//       //     console.log("ERROR PROFILE UPDATE: ERR", error);
//       //   }
//       //   if (resAuthnCredentials) {
//       //     // setUserAuthn(resAuthnCredentials);
//       //     console.log(
//       //       "# UPDATED USER AUTHN after update: resAuthnCredentials",
//       //       resAuthnCredentials
//       //     );
//       //   } else {
//       //     console.log("ERROR PROFILE UPDATE: ERR", error);
//       //   }
//       // }
//       // if Signin error returns user does not exist
//       // setIsSignUp(true);

//       // if is
//     }
//   };

//   const handleCreateTask = (e) => {
//     e.preventDefault();

//     // Confirm with user for account deletion

//     // <Redirect to="/app"></Redirect>;

//     if (isUpdating) {
//       createTask(userAuthn)
//         .then((response) => {
//           console.log('### FROM <PROFILE> User Create: ', response);
//           if (response?.headers['status'] == 200) {
//           } else {
//             // console.log("ERROR DELETING USER PROFILE");
//           }
//         })
//         .catch((err) =>
//           console.log('# PROFILE Create user profile error: ', err)
//         );
//     }
//   };

//   const handleUpdateTask = (e) => {
//     e.preventDefault();

//     // Confirm with user for account deletion

//     // <Redirect to="/app"></Redirect>;

//     if (isUpdating) {
//       updateTask(userAuthn)
//         .then((response) => {
//           console.log('### FROM <TaskForm> Task Delete: ', response);
//           if (response?.headers['status'] == 200) {
//           } else {
//             // console.log("ERROR DELETING USER PROFILE");
//           }
//         })
//         .catch((err) =>
//           console.log('# TaskForm delete user profile error: ', err)
//         );
//     }
//   };

//   const handleDeleteTask = (e) => {
//     e.preventDefault();

//     // Confirm with user for account deletion

//     // <Redirect to="/app"></Redirect>;

//     if (isUpdating) {
//       deleteATask(userAuthn)
//         .then((response) => {
//           console.log('### FROM <PROFILE> User Delete: ', response);
//           if (response?.headers['status'] == 200) {
//           } else {
//             // console.log("ERROR DELETING USER PROFILE");
//           }
//         })
//         .catch((err) =>
//           console.log('# PROFILE delete user profile error: ', err)
//         );
//     }
//   };

//   return (
//     <section className='container'>
//       <div className='columns is-multiline'>
//         <div className='column left has-text-centered'>
//           <h1 className='title is-4'>My Request</h1>
//           <div className='description'>
//             {isUpdating ? (
//               <div>
//                 <strong>Update Request {task.id}</strong>
//               </div>
//             ) : (
//               <div>
//                 <strong>Create New Request</strong>
//               </div>
//             )}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className='field'>
//               <div className='control'>
//                 <label>
//                   Request Title:
//                   <input
//                     className='input is-medium'
//                     name='title'
//                     type='text'
//                     placeholder='title'
//                     value={title}
//                     onChange={handleTitleChange}
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className='field'>
//               <div className='control'>
//                 <label>
//                   Request kind: One Time Task or Material Need
//                   <div className='select'>
//                     <select
//                       className='input is-medium'
//                       name='kind'
//                       value={kind}
//                       onChange={handleKindChange}>
//                       <option value={MATERIALNEED}>Material Need</option>
//                       <option value={ONETIMETASK}>One Time Task</option>
//                     </select>
//                   </div>
//                 </label>
//               </div>
//             </div>
//             <div className='field'>
//               <div className='control'>
//                 <label>
//                   Request Description (300 characters or less)
//                   <textarea
//                     className='input is-medium'
//                     name='description'
//                     type='textarea'
//                     placeholder='Description in 300 characters or less '
//                     value={description}
//                     onChange={handleDescriptionChange}
//                   />
//                 </label>
//               </div>
//             </div>
//             {debug ? (
//               <div className='field'>
//                 <div className='columns is-hcentered'>
//                   <div className='column'>
//                     <div className='control'>
//                       <label>
//                         Request is Published:
//                         <div className='select'>
//                           <select
//                             className='input is-medium'
//                             name='is_published'
//                             value={isPublished}
//                             onChange={handleIsPublishedChange}>
//                             <option value={true}>Yes</option>
//                             <option value={false}>No</option>
//                           </select>
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : null}

//             <div className='field'>
//               <div className='control'>
//                 <label>
//                   Request is Fullfilled:
//                   <div className='select'>
//                     <select
//                       className='input is-medium'
//                       name='is_fullfilled'
//                       value={isFullfilled}
//                       onChange={handleIsFullfilledChange}>
//                       <option value={true}>Yes</option>
//                       <option value={false}>No</option>
//                     </select>
//                   </div>
//                 </label>
//               </div>
//             </div>
//             <div className='columns'>
//               <button className='button is-info' onClick={handleFromMapCoords}>
//                 Fill coordinates from current map location instead
//               </button>
//               <div className='column left'>
//                 <div className='field'>
//                   <div className='control'>
//                     <label>
//                       Latitude
//                       <input
//                         className='input is-medium'
//                         name='lat'
//                         type='text'
//                         placeholder='lat'
//                         value={taskCoords.lat}
//                         onChange={handleTaskCoordsChange}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div className='column right'>
//                 <div className='field'>
//                   <div className='control'>
//                     <label>
//                       Logitude
//                       <input
//                         className='input is-medium'
//                         name='lng'
//                         type='text'
//                         placeholder='lng'
//                         value={taskCoords.lng}
//                         onChange={handleTaskCoordsChange}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {isUpdating ? (
//               <button
//                 className='button is-block is-primary is-fullwidth is-medium'
//                 type='submit'>
//                 <em>Update My Request</em>
//               </button>
//             ) : (
//               <button
//                 className='button is-block is-primary is-fullwidth is-medium'
//                 type='submit'>
//                 <em>Create and Publish My Request</em>
//               </button>
//             )}
//           </form>
//         </div>
//       </div>

//       <div className='column right has-text-centered'>
//         <div className='description'>
//           {isUpdating ? (
//             <div>
//               <strong>Delete my Account</strong>
//               <em>
//                 <button className='button is-danger' onClick={handleDeleteTask}>
//                   Delete My Request
//                 </button>
//               </em>{' '}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </section>
//   );
// }

// /**
//  * return (
//     <>
//       <NotificationPopup
//         notification={{
//           type: "Hello",
//           content: `From TaskFrom with :taskid ${taskid}`,
//         }}
//       />
//       <h1>
//         {JSON.stringify(userAuthn)}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(setUserAuthn.toString())}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(userProfile)}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(coords)}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(userCoords)}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(tasks.length)}
//         <br />
//         <br />
//         <br />
//         {JSON.stringify(setTasksLastUpdateTimeTracker.toString())}
//         <br />
//         <br />
//         <br />
//       </h1>
//     </>
//   );
//  */
