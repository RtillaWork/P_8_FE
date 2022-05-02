// TaskForm
import React, {useContext, useState} from 'react';
import {useHistory, useParams,} from 'react-router-dom';
import {GrLocation, GrMapLocation} from 'react-icons/gr';

// import { DirectUpload } from "activestorage";
import './TaskForm.css';

import {createTask, deleteATask, updateTask,} from '../../services/TasksServices';
import {deviseAuthnFromErr, deviseAuthnFromRes, MATERIALNEED, ONETIMETASK,} from '../../services/apiServices';
import {UserAuthnContext, UserProfileContext,} from '../../AppPrelude';
import {STATUS_ERROR, STATUS_READY} from '../../services/appServices';

export default function TaskForm({
                                     // coords,
                                     userCoords,
                                     mapCoords,
                                     tasks,
                                     setTasksLastUpdateTimeTracker,
                                     debug = false,
                                     ...restOfProps
                                 }) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);

    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    const history = useHistory();
    let {taskid} = useParams();

    // const [status, setstatus] = useState({ status: STATUS_READY, message: [] });

    // initial state: isUpdating: false, default is create new task
    const [isUpdating, setIsUpdating] = useState(false);
    const [task, setTask] = useState(null);
    // if (taskid) {
    //   // taskid exists; thus this is updating an existing task if task exists by taskid in current DB
    //   const taskToUpdate = tasks.find((t) => {
    //     return t.id == taskid;
    //   });

    if (taskid) {
        // taskid exists; thus this is updating an existing task if task exists by taskid in current DB
        const taskToUpdate = tasks.get(taskid);

        if (taskToUpdate) {
            // found the task to update by task id
            setIsUpdating(true);
            setTask(taskToUpdate);
            // setIsCreating(false);
        } else {
            console.log(
                "ERROR TASKFORM COULDN't FIND A PROFILE TASK TO UPDATE referenced as :taskid ",
                taskid,
                'in the loaded tasks DB'
            );
        }
    }

    // const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [kind, setKind] = useState(MATERIALNEED); // default MATERIALNEED
    const [description, setDescription] = useState('');
    // if (description == null || description == undefined || description == "") {
    //   setDescription(title);
    // }
    const [isPublished, setIsPublished] = useState(false);
    const [isFullfilled, setIsFullfilled] = useState(false);

    const [taskCoords, setTaskCoords] = useState(userCoords); // TODO: add location icon to fill in current location to override

    // const handleToggleIsUpdating = (e) => {
    //   e.preventDefault();
    //   if (!isUpdating) {
    //     setIsUpdating(true);
    //   } else {
    //     setIsUpdating(false);
    //   }
    // };

    const handleFormChange = (e) => {
        e.preventDefault();
        setstatus({type: STATUS_READY, content: null});

        // console.log('FORM NAME: ', e.target.name);
        // console.log('FORM VALUE: ', e.target.value);
        switch (e.target.name) {
            case 'title': {
                setTitle(e.target.value);

                break;
            }
            case 'kind': {
                setKind(e.target.value);
                break;
            }
            case 'description': {
                setDescription(e.target.value);
                break;
            }
            case 'is_published': {
                setIsPublished(e.target.value);
                break;
            }
            case 'is_fullfilled': {
                setIsFullfilled(e.target.value);
                break;
            }
            case 'lat': {
                // setLat(e.target.value);
                setTaskCoords((prevCoords) => {
                    return {lat: e.target.value, lng: prevCoords.lng};
                });
                break;
            }
            case 'lng': {
                // setLng(e.target.value);
                setTaskCoords((prevCoords) => {
                    return {lat: prevCoords.lat, lng: e.target.value};
                });
                break;
            }
            // case 'task_coords': {
            //   setTaskCoords(e.target.value);
            //   break;
            // }
            // case 'password_confirmation': {
            //   setPasswordConfirmation(e.target.value);
            //   break;
            // }
            default:
                break;
        }
    };

    const handleUseAppCoords = (e) => {
        e.preventDefault();
        // setTaskCoords(userCoords);
        // NOTE: slightly randomize only coordiantes based on user position as position based on map is supposed to be more accurate
        setTaskCoords(() => ({
            lat: parseFloat(userCoords.lat) + Math.random() / 1e3,
            lng: parseFloat(userCoords.lng) + Math.random() / 1e3,
        }));
    };
    const handleUseMapCoords = (e) => {
        e.preventDefault();
        // setTaskCoords(mapCoords);
        setTaskCoords(() => ({
            lat: parseFloat(mapCoords.lat), // + Math.random() / 1e3,
            lng: parseFloat(mapCoords.lng), // + Math.random() / 1e3,
        }));
    };
    const handleFromMapCoords = (e) => {
        e.preventDefault();
        setTaskCoords(mapCoords);
    };

    // const handleTitleChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setTitle(e.target.value);
    // };
    // const handleKindChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setKind(e.target.value);
    // };

    // const handleDescriptionChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setDescription(e.target.value);
    // };
    // const handleIsPublishedChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setIsPublished(e.target.value);
    // };
    // const handleIsFullfilledChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setIsFullfilled(e.target.value);
    // };

    // const handleTaskCoordsChange = (e) => {
    //   e.preventDefault();
    //   // console.log(e.target.value);
    //   setTaskCoords(e.target.value);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUpdating) {
            console.log(
                'MOCK is UPDATING A PROFILE TASK WITH UPDATE REQUEST DATA: ',
                title,
                kind,
                description,
                isPublished,
                isFullfilled,
                taskCoords,

                userAuthn
            );
        } else {
            createTask(
                userAuthn,
                title,
                kind,
                description,
                isPublished,
                isFullfilled,
                taskCoords
            )
                .then((res) => {
                    // setUserAuthn(deviseAuthnResRefresh(userAuthn, res));
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setTasksLastUpdateTimeTracker(Date.now());
                    history.push('/');
                })
                .catch((err) => {
                    console.log(
                        'DEBUG createTask TASKFOM ERROR: ',
                        // err.response.headers,
                        // err.response.data,
                        JSON.stringify(err)
                    );
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data,
                    });
                    // setUserAuthn(deviseAuthnResRefresh(userAuthn, err.response));
                    // setstatus({ status: STATUS_ERROR, message: [...err.response.data] });
                });
        }
    };

    const handleCreateTask = (e) => {
        e.preventDefault();

        // Confirm with user for account deletion

        // <Redirect to="/app"></Redirect>;

        if (isUpdating) {
            createTask(userAuthn)
                .then((res) => {
                    console.log('### FROM <PROFILE> User Create: ', res);
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setTasksLastUpdateTimeTracker(Date.now());
                    history.push('/');
                    // if (res?.headers['status'] == 200) {
                    // } else {
                    //   // console.log("ERROR DELETING USER PROFILE");
                    // }
                })
                .catch((err) => {
                    console.log('# PROFILE Create user profile error: ', err);
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data,
                    });
                });
        }
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();

        // Confirm with user for account deletion

        // <Redirect to="/app"></Redirect>;

        if (isUpdating) {
            updateTask(userAuthn)
                .then((res) => {
                    console.log('### FROM <TaskForm> Task Delete: ', res);
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setTasksLastUpdateTimeTracker(Date.now());
                    // if (res?.headers['status'] == 200) {
                    // } else {
                    //   // console.log("ERROR DELETING USER PROFILE");
                    // }
                })
                .catch((err) => {
                    console.log('# TaskForm delete user profile error: ', err);
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data,
                    });
                });
        }
    };

    const handleDeleteTask = (e) => {
        e.preventDefault();
        // Confirm with user for account deletion
        // <Redirect to="/app"></Redirect>;

        if (isUpdating) {
            deleteATask(userAuthn)
                .then((res) => {
                    console.log('### FROM <PROFILE> User Delete: ', res);
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setTasksLastUpdateTimeTracker(Date.now());
                    // if (res?.headers['status'] == 200) {
                    // } else {
                    //   // console.log("ERROR DELETING USER PROFILE");
                    // }
                })
                .catch((err) => {
                    console.log('# PROFILE delete user profile error: ', err);
                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data,
                    });
                });
        }
    };

    return (
        <section className='container'>
            <div className='columns is-multiline'>
                <div className='column left has-text-centered'>
                    <h1 className='title is-4'>My Request</h1>
                    <div className='description'>
                        {isUpdating ? (
                            <div>
                                <strong>Update Request {task.id}</strong>
                            </div>
                        ) : (
                            <div>
                                <strong className='title is-4'>Create New Request</strong>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    Title:{' '}
                                    {status.content?.title ? (
                                        <span className='tag is-warning'>
                      {status.content?.title?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='title'
                                        type='text'
                                        placeholder='Request Title in 64 characters or less'
                                        value={title}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    Description:{' '}
                                    {status.content?.description ? (
                                        <span className='tag is-warning'>
                      {status.content?.description?.join(', ')}
                    </span>
                                    ) : null}
                                    <textarea
                                        className='input is-large'
                                        rows='3'
                                        name='description'
                                        type='textarea'
                                        placeholder='Request description in 300 characters or less '
                                        value={description}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    {status.content?.kind ? (
                                        <span className='tag is-warning'>
                      {status.content?.kind?.join(', ')}
                    </span>
                                    ) : null}
                                    <div className='select'>
                                        <select
                                            className='input is-medium'
                                            name='kind'
                                            value={kind}
                                            onChange={handleFormChange}>
                                            <option value={MATERIALNEED}>Material Need</option>
                                            <option value={ONETIMETASK}>One Time Task</option>
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {
                            //   debug ? (
                            //   <div className='field'>
                            //     <div className='columns is-hcentered'>
                            //       <div className='column'>
                            //         <div className='control'>
                            //           <label>
                            //             Published:{' '}
                            //             {status.content?.is_published ? (
                            //               <span className='tag is-warning'>
                            //                 {status.content?.is_published?.join(', ')}
                            //               </span>
                            //             ) : null}
                            //             <div className='select'>
                            //               <select
                            //                 className='input is-medium'
                            //                 name='is_published'
                            //                 value={isPublished}
                            //                 onChange={handleFormChange}>
                            //                 <option value={true}>Yes</option>
                            //                 <option value={false}>No</option>
                            //               </select>
                            //             </div>
                            //           </label>
                            //         </div>
                            //       </div>
                            //     </div>
                            //   </div>
                            // ) : null
                        }

                        {
                            // <div className='field'>
                            //   <div className='control'>
                            //     <label className='subtitle is-4'>
                            //       Fullfilled:{' '}
                            //       {status.content?.is_fullfilled ? (
                            //         <span className='tag is-warning'>
                            //           {status.content?.is_fullfilled?.join(', ')}
                            //         </span>
                            //       ) : null}
                            //       <div className='select'>
                            //         <select
                            //           className='input is-medium'
                            //           name='is_fullfilled'
                            //           value={isFullfilled}
                            //           onChange={handleFormChange}>
                            //           <option value={true}>Yes</option>
                            //           <option value={false}>No</option>
                            //         </select>
                            //       </div>
                            //     </label>
                            //   </div>
                            // </div>
                        }

                        {
                            // <div className='columns'>
                            //   <div className='column left'>
                            //   </div>
                            //   <div className='column right'>
                            //     <p></p>
                            //   </div>
                            // </div>
                        }

                        {
                            /////////////////
                        }

                        <div className='field'>
                            <div className='control'>
                                <div className='columns'>
                                    <div className='column'>
                                        <label className='subtitle is-6'>
                                            Latitude:{' '}
                                            {status.content?.lat ? (
                                                <span className='tag is-warning'>
                          {status.content?.lat?.join(', ')}
                        </span>
                                            ) : null}
                                            {status.content?.lat ? (
                                                <span className='tag is-warning'>
                          {status.content?.lat?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-small'
                                                name='lat'
                                                type='text'
                                                placeholder='0.1'
                                                value={taskCoords.lat}
                                                onChange={handleFormChange}
                                            />
                                        </label>

                                        <label className='subtitle is-6'>
                                            Longitude:{' '}
                                            {status.content?.lng ? (
                                                <span className='tag is-warning'>
                          {status.content?.lng?.join(', ')}
                        </span>
                                            ) : null}
                                            {status.content?.lng ? (
                                                <span className='tag is-warning'>
                          {status.content?.lng?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-small'
                                                name='lng'
                                                type='text'
                                                placeholder='0.1'
                                                value={taskCoords.lng}
                                                onChange={handleFormChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='columns'>
                                    <div className='column'>
                                        <button
                                            className=''
                                            name='user_app_coords'
                                            type='button'
                                            onClick={handleUseAppCoords}>
                                            Randomize around App coordinates <GrLocation/>
                                        </button>
                                        <button
                                            className=''
                                            name='user_map_coords'
                                            type='button'
                                            onClick={handleUseMapCoords}>
                                            Map coordinates <GrMapLocation/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            ////////////////////
                        }

                        {
                            //////////////
                        }

                        {
                            // <div className='columns'>
                            //   <button className='button is-info' onClick={handleFromMapCoords}>
                            //     Fill coordinates from current map location instead
                            //   </button>
                            //   <div className='column left'>
                            //     <div className='field'>
                            //       <div className='control'>
                            //         <label className='subtitle is-4'>
                            //           Latitude
                            //           <input
                            //             className='input is-medium'
                            //             name='lat'
                            //             type='text'
                            //             placeholder='lat'
                            //             value={taskCoords.lat}
                            //             onChange={handleTaskCoordsChange}
                            //           />
                            //         </label>
                            //       </div>
                            //     </div>
                            //   </div>
                            //   <div className='column right'>
                            //     <div className='field'>
                            //       <div className='control'>
                            //         <label className='subtitle is-4'>
                            //           Logitude
                            //           <input
                            //             className='input is-medium'
                            //             name='lng'
                            //             type='text'
                            //             placeholder='lng'
                            //             value={taskCoords.lng}
                            //             onChange={handleTaskCoordsChange}
                            //           />
                            //         </label>
                            //       </div>
                            //     </div>
                            //   </div>
                            // </div>
                        }
                        {
                            ///////////////////////////
                        }

                        {isUpdating ? (
                            <button
                                className='button is-block is-primary is-fullwidth is-medium'
                                type='submit'>
                                <em>Update My Request</em>
                            </button>
                        ) : (
                            <button
                                className='button is-block is-primary is-fullwidth is-medium'
                                type='submit'>
                                <em>Publish My Request</em>
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className='column right has-text-centered'>
                <div className='description'>
                    {isUpdating ? (
                        <div>
                            <strong>Delete my Account</strong>
                            <em>
                                <button className='button is-danger' onClick={handleDeleteTask}>
                                    Delete My Request
                                </button>
                            </em>{' '}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
