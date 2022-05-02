import React, {useContext, useEffect, useState} from 'react';
import {useParams,} from 'react-router-dom';

import {Notification, TasksContext, UserAuthnContext, UserProfileContext,} from '../../AppPrelude';
import TaskDetails from '../TaskDetails';
// import Tasks from '../Tasks';
import {fetchATask,} from '../../services/TasksServices';

import {deviseAuthnFromErr, deviseAuthnFromRes,} from '../../services/apiServices';
import {STATUS_ERROR, STATUS_READY} from '../../services/appServices';

export default function TaskShow({
                                     // taskListType,
                                     task = null,
                                     ...restOfProps
                                 }) {
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {openTasks, profileTasks} = useContext(TasksContext);

    const [aTask, setATask] = useState(task);
    const [status, setstatus] = useState({type: STATUS_READY, content: null});
    const {taskid} = useParams();

    let aTaskJSX = null;

    // make sure aTask is refreshed from backend
    useEffect(() => {
        if (!aTask) {
            fetchATask(userAuthn, taskid ?? null)
                .then((res) => {
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    console.log('TaskShow using /:taskid THEN res.data: ', res.data);
                    setATask(res.data);
                })
                .catch((err) => {
                    console.log(
                        'DEBUG ASKDATA api by /:taskid  ERROR: ',
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
        } else {
            fetchATask(userAuthn, aTask?.id ?? null)
                .then((res) => {
                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    console.log('TaskShow using task.id THEN res.data: ', res.data);
                    setATask(res.data);
                })
                .catch((err) => {
                    console.log(
                        'DEBUG ASKDATA api by task.id  ERROR: ',
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
    }, []);

    return aTask ? (
        <>
            {
                // <TaskData task={aTask} />
            }
            <TaskDetails task={aTask}/>
            {
                // <div className='container'>
                //   <ConversationList taskid={aTask.id} />
                // </div>
            }
        </>
    ) : (
        <Notification type='Error' content={status?.content?.toString()}/>
    );
}
