import React, {useContext, useEffect, useMemo, useState,} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import {
    ConversationsContext,
    MapContext,
    MIN_RADIUS,
    Notification,
    STATUS_ERROR,
    STATUS_READY,
    STATUS_WAITING,
    TasksContext,
    UserAuthnContext,
    UserProfileContext,
} from './AppPrelude';

import InfoBar from './components/InfoBar';
import Tasks from './components/Tasks';
import TaskList from './components/TaskList';
import UserProfile from './components/UserProfile';

import TaskShow from './components/TaskShow';
import TaskForm from './components/TaskForm';
import TaskConversations from './components/TaskConversations';
import ProfileConversations from './components/ProfileConversations';
import ProfileTasks from './components/ProfileTasks';
import Conversation from './components/Conversation';
import Logout from './components/Logout';

import {fetchProfileTasks, fetchTasks, fetchTaskStats, updateTaskStoreFrom,} from './services/TasksServices';
import {fetchConversations, updateConversationStoreFrom,} from './services/ConversationsServices';
import {
    CONVERSATIONS_PERIODICUPDATE_INTERVAL,
    deviseAuthnFromErr,
    deviseAuthnFromRes,
    TASKS_PERIODICUPDATE_INTERVAL,
} from './services/apiServices';

import {getDistanceFromLatLngInm} from './services/appServices';

export default function App({
                                userCoords,
                                deviceCoords,
                                setUserCoords,
                                setDeviceCoords,
                                ...restOfProps
                            }) {
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);

    const [status, setstatus] = useState({
        type: STATUS_WAITING,
        content: {info: ' Loading initial requests'},
    });

    const [coords, setCoords] = useState(userCoords);
    const [mapCoords, setMapCoords] = useState(null);

    const [userRadius, setUserRadius] = useState(MIN_RADIUS);
    // userRadius is in m, default 5000, can use localStorage profile to change/store/retrieve

    ////////////////////////////////
    ///  open tasks
    ////////////////////////////////
    const [tasks, setTasks] = useState(new Map());
    // tasksLastUpdateTimeTracker Date.now() time tracker for latest task update. Initially go to oldest timestamp

    const [tasksLastUpdateTimeTracker, setTasksLastUpdateTimeTracker] =
        useState(0);

    useEffect(() => {
        fetchTasks(
            userAuthn,
            null,
            null,
            mapCoords?.lat ?? userCoords.lat,
            mapCoords?.lng ?? userCoords.lng,
            userRadius,
            tasksLastUpdateTimeTracker - 2 * TASKS_PERIODICUPDATE_INTERVAL
        )
            .then((res) => {
                setUserAuthn((previoususerAuthn) => {
                    return deviseAuthnFromRes(previoususerAuthn, res);
                });

                if (res.data.created.length > 0 || res.data.updated.length > 0) {

                    setTasks((prevData) => {
                        return updateTaskStoreFrom(
                            prevData,
                            res.data.created,
                            res.data.updated
                        );
                    });
                }

                setstatus(() => {
                    return {type: STATUS_READY, content: null};
                });
            })
            .catch((err) => {
                const errRes = err.response ?? {
                    headers: null,
                    data: err.message,
                };
                setUserAuthn((previoususerAuthn) =>
                    deviseAuthnFromErr(previoususerAuthn, err)
                );
                setstatus(() => {
                    return {
                        type: STATUS_ERROR,
                        content: {error: 'ERROR: Failed to load requests'},
                    };
                });
            });
    }, [tasksLastUpdateTimeTracker]);

    ///////////////////////
    // user profile's tasks
    ///////////////////////

    const [profileTasks, setProfileTasks] = useState(new Map());
    const [
        profileTasksLastUpdateTimeTracker,
        setProfileTasksLastUpdateTimeTracker,
    ] = useState(Date.now()); // Date.now() time tracker for latest task update

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {

            fetchProfileTasks(userAuthn) //, userProfile.id, null, null, null, null)
                .then((res) => {
                    setUserAuthn((previoususerAuthn) =>
                        deviseAuthnFromRes(previoususerAuthn, res)
                    );
                    setProfileTasks(() =>
                        updateTaskStoreFrom(new Map(), res.data, res.data)
                    );
                })
                .catch((err) => {

                    setstatus(() => {
                        return {
                            type: STATUS_ERROR,
                            content: {error: 'ERROR: FAILED TO LOAD PROFILE REQUERSTS'},
                        };
                    });
                });
        }

        return () => {
            isMounted = false;
        };
    }, [profileTasksLastUpdateTimeTracker]);

    // //////////////////////////////
    // // Periodic poll for updates by last updated
    // //////////////////////////////

    // useEffect(() => {
    //   const periodicTracker = setInterval(() => {
    //     // fetchAppStats().then(res=> {

    //     // }).catch(err=>console.log("FETCH TASK STATS ERROR: ", err));

    //     setTasksLastUpdateTimeTracker(() => Date.now());
    //     // setConversationsTracker(() => Date.now());
    //     // setConversationsTracker(Date.now());
    //   }, TASKS_PERIODICUPDATE_INTERVAL);

    //   return () => {
    //     clearInterval(periodicTracker);
    //   };
    // });

    //////////////////////////////
    // re-zero the tasksLastUpdateTracker to reload all tasks data again...
    // ...  by swiping the map out of the radius
    //////////////////////////////
    useEffect(() => {
        if (
            mapCoords &&
            getDistanceFromLatLngInm(mapCoords, coords) >= userRadius
        ) {
            console.log(
                '###DEBUG mapCoords triggers more tasks to load, mapCoords-coords >= userRadius:',
                getDistanceFromLatLngInm(mapCoords, coords),
                mapCoords && getDistanceFromLatLngInm(mapCoords, coords) >= userRadius
            );

            setstatus(() => {
                return {
                    type: STATUS_WAITING,
                    content: {info: 'INFO: Loading new area requests'},
                };
            });

            setCoords(() => mapCoords);
            setTasksLastUpdateTimeTracker((previous) => {

                return 0;
            });
        }

        return () => {
            // isMounted=false;
        };
    }, [mapCoords]); // [deviceCoords]

    //////////////////////////////
    // re-zero the tasksLastUpdateTracker to reload all tasks data again...
    // ...  by changing the use (current app's) coordinates
    //////////////////////////////
    useEffect(() => {
        if (tasks.size) {
            setstatus(() => {
                return {
                    type: STATUS_WAITING,
                    content: {info: 'INFO: Re-loading requests on new map location'},
                };
            });
        }
        setCoords(() => userCoords);
        setTasks(() => new Map()); //NOTE: experiemnt comment out to remove the flicker and accidental reload
        setTasksLastUpdateTimeTracker(() => 0);

        return () => {
            // isMounted=false;
        };
    }, [userCoords]); // [deviceCoords]

    //////////////////////////////
    // re-zero the tasksLastUpdateTracker to reload all tasks data again...
    // ...  by changing the radius
    //////////////////////////////
    useEffect(() => {
        let isMounted = true;

        if (isMounted && tasks.size) {
            setstatus(() => {
                return {
                    type: STATUS_WAITING,
                    content: {info: 'INFO: Re-loading requests on new radius'},
                };
            });
        }
        // setTasks((prevData) => {
        //   return prevData.clear(); <- returns undefined. unwanted behaviour
        // };

        setTasks(() => new Map()); //NOTE: experiemnt comment out to remove the flicker and accidental reload
        setTasksLastUpdateTimeTracker(() => 0);

        return () => {
            isMounted = false;
        };
    }, [userRadius]); // [deviceCoords]

    //////////////////////
    // user profile's conversations
    // includes conversations as volunteer (user_id==current_user.id)...
    // and conversations as requestor (user_id<=:current.user<:tasks<:conversations)
    ////////////////////////

    const [conversations, setConversations] = useState(new Map());

    const [conversationsTracker, setConversationsTracker] = useState(0); // was Date.now() // trackes last update time

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchConversations(userAuthn)
                .then(function (res) {
                    console.log(
                        '#FROM FETCH CONVERSATIONS THEN res: ',
                        res.data,
                        res.status,
                        res.statusText,
                        res.headers
                        // res.request
                    );

                    setUserAuthn((previoususerAuthn) =>
                        deviseAuthnFromRes(previoususerAuthn, res)
                    );
                    setConversations((prevData) => {
                        return updateConversationStoreFrom(prevData, res.data);
                    });
                })
                .catch((err) => {
                    const errRes = err.response ?? {
                        headers: 'DEBUG REQ NOT SENT: WRONG APP REQUEST FORMAT',
                        data: err.message,
                    };

                    setUserAuthn((previoususerAuthn) =>
                        deviseAuthnFromErr(previoususerAuthn, errRes)
                    );
                    setstatus(() => {
                        return {
                            type: STATUS_ERROR,
                            content: {
                                error: 'ERROR: FAILED TO LOAD PROFILE CONVERSATIONS',
                            },
                        };
                    });
                });

            // setIsConversationsLoaded(true);
            // return () => setConversations(tasks);
        }

        return () => {
            isMounted = false;
        };
    }, [conversationsTracker]);

    ////////////////////////////////
    ///  task stats
    ////////////////////////////////
    const [taskStats, setTaskStats] = useState(null);

    useEffect(() => {
        fetchTaskStats(userAuthn)
            .then((res) => {

                setUserAuthn((previoususerAuthn) => {
                    return deviseAuthnFromRes(previoususerAuthn, res);
                });

                setTaskStats((prevData) => {
                    // return [...prevState, ...res.data.created]; // updateTaskStoreFrom(
                    return res.data;
                });
            })
            .catch((err) => {
                const errRes = err.response ?? {
                    headers: null,
                    data: err.message,
                };

                setUserAuthn((previoususerAuthn) =>
                    deviseAuthnFromErr(previoususerAuthn, err)
                );
                setstatus(() => {
                    return {
                        type: STATUS_ERROR,
                        content: {
                            error: ['ERROR: Failed to fetch Task stats load requests'],
                        },
                    };
                });
            });
        // }

        // return () => {
        //   isMounted = false;
        // };
    }, [tasksLastUpdateTimeTracker, conversationsTracker]);

    // //////////////////////////////
    // // Periodic poll for conversations updates by last requested at: for now reloads all conversations
    // //////////////////////////////
    // useEffect(() => {
    //   const periodicConversationTracker = setInterval(() => {
    //     setConversationsTracker(() => Date.now());
    //   }, CONVERSATIONS_PERIODICUPDATE_INTERVAL);

    //   return () => {
    //     clearInterval(periodicConversationTracker);
    //   };
    // });

    //////////////////////////////
    // Periodic poll for updates by last updated
    //////////////////////////////

    useEffect(() => {
        const periodicTaskTracker = setInterval(() => {

            setTasksLastUpdateTimeTracker(() => Date.now());
            setProfileTasksLastUpdateTimeTracker(() => Date.now());

        }, TASKS_PERIODICUPDATE_INTERVAL);

        const periodicConversationTracker = setInterval(() => {

            setConversationsTracker(() => Date.now());
        }, CONVERSATIONS_PERIODICUPDATE_INTERVAL);

        return () => {
            clearInterval(periodicTaskTracker);
            clearInterval(periodicConversationTracker);
        };
    }, []); // [tasks, profileTasks, conversations]

    /////////////////////////////////////
    // Controls the layout of the UI
    //////////////////////////////////////
    const [visibleComponents, setVisibleComponents] = useState('TASKMAP');

    ////////////////////////////////////////
    // Memoization to limit flicker when updating tasks
    //////////////////////////////////////

    // const app = useMemo(() => {
    //   return JSON.stringify(tasks);
    // }, [tasks]);

    const taskListOpenTasksRoute = useMemo(() => {
        return <TaskList taskListType={'openTasks'} selectedTask={null}/>;
    }, [tasks]); // [tasks, tasksLastUpdateTimeTracker]

    const tasksOpenTasksMapRoute = useMemo(() => {
        return <Tasks taskListType={'openTasks'} visibleComponents={'TASKMAP'}/>;
    }, [tasks]); // [tasks, tasksLastUpdateTimeTracker]
    return (
        <MapContext.Provider
            value={{
                deviceCoords: deviceCoords,
                userCoords: userCoords,
                mapCoords: mapCoords,
                coords: coords,
                userRadius: userRadius,
                setDeviceCoords: setDeviceCoords,
                setUserCoords: setUserCoords,
                setMapCoords: setMapCoords,
                setCoords: setCoords,
                setUserRadius: setUserRadius,
            }}>
            <TasksContext.Provider
                value={{
                    openTasks: tasks,
                    profileTasks: profileTasks,
                    setTasksLastUpdateTimeTracker: setTasksLastUpdateTimeTracker,
                    triggerProfileTasks: setProfileTasksLastUpdateTimeTracker,
                    taskStats,
                }}>
                <ConversationsContext.Provider
                    value={{
                        conversations: conversations,
                        setConversations: setConversations,
                        setConversationsTracker: setConversationsTracker,
                    }}>
                    {status.content ? (
                        <Notification type={status.type} message={status.content}/>
                    ) : (
                        <InfoBar

                        />
                    )}
                    <Switch>
                        <Route exact path='/profile/settings'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <UserProfile
                                        radius={userRadius}
                                        setCoords={setCoords}
                                        setRadius={setUserRadius}
                                        userCoords={userCoords}
                                        mapCoords={mapCoords}
                                    />
                                </div>
                            </div>
                        </Route>

                        {
                            // Default route: all tasks minus logged in user's
                            // based and sorted by on user's default lat,lng and default b-e userRadius
                        }
                        <Route exact path='/'>
                            <div className='columns is-centered is-gapless'>
                                {tasksOpenTasksMapRoute}
                            </div>
                        </Route>

                        {
                            // All tasks minus logged in user's
                            // based and sorted by on user's device current lat,lng and default b-e userRadius
                        }
                        <Route exact path='/requests/all'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    {taskListOpenTasksRoute}
                                </div>
                            </div>
                        </Route>

                        <Route exact path='/profile/requests'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <ProfileTasks

                                    />
                                </div>
                            </div>
                        </Route>

                        {
                            // create new Task by logged in user
                        }
                        <Route exact path='/request'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <TaskForm
                                        userAuthn={userAuthn}
                                        setUserAuthn={setUserAuthn}
                                        userProfile={userProfile}
                                        userCoords={userCoords}
                                        mapCoords={mapCoords}
                                        tasks={profileTasks}
                                        setTasksLastUpdateTimeTracker={
                                            setProfileTasksLastUpdateTimeTracker
                                        }
                                    />
                                </div>
                            </div>
                        </Route>

                        {
                            // TaskShow info about a Task by :taskid
                        }

                        <Route exact path='/requests/:taskid'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <TaskShow/>
                                </div>
                            </div>
                        </Route>

                        {
                            // Active conversations for logged in user
                        }
                        <Route exact path='/profile/conversations'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <ProfileConversations setConversations={setConversations}/>
                                </div>
                            </div>
                        </Route>

                        {
                            // check for the existence of conversation associated to task_id...
                            // .. in case it already exists, resume it...
                            // ... OR create a new one otherwise
                        }

                        <Route exact path='/requests/:taskid/conversations'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column  is-three-quarters'>
                                    <TaskConversations/>
                                </div>
                            </div>
                        </Route>

                        {
                            //  a specific conversation  by conversation id
                            // ... conversation_id related to user_id X task_id
                        }
                        <Route exact path='/conversations/:convid'>
                            <div className='columns is-centered is-gapless'>
                                <div className='column is-centered is-gapless'>
                                    <Conversation/>
                                </div>
                            </div>
                        </Route>

                        <Route exact path='/signout'>
                            <Logout
                                userAuthn={userAuthn}
                                userProfile={userProfile}
                                setUserAuthn={setUserAuthn}
                                setUserProfile={setUserProfile}
                            />
                        </Route>
                    </Switch>
                </ConversationsContext.Provider>
            </TasksContext.Provider>
        </MapContext.Provider>
    );
}
