import React, {useContext, useEffect, useState} from 'react';
import {FaHandsHelping, FaLeaf, FaParachuteBox} from 'react-icons/fa';
import {fetchATask,} from '../../services/TasksServices';
import {Notification, TasksContext, UserAuthnContext, UserProfileContext,} from '../../AppPrelude';
import {deviseAuthnFromErr, deviseAuthnFromRes, MATERIALNEED, ONETIMETASK,} from '../../services/apiServices';
import {STATUS_ERROR, STATUS_READY, STATUS_WAITING,} from '../../services/appServices';

export default function TaskPopup({task, ...restOfProps}) {
    const {userProfile} = useContext(UserProfileContext);
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {
        openTasks,
        profileTasks,
        setTasksUpdateTracker,
        setProfileTasksUpdateTracker,
    } = useContext(TasksContext);
    const [aTask, setATask] = useState(task);
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    useEffect(() => {
        const refreshTaskData = () => {
            if (task?.id) {
                setstatus({
                    type: STATUS_WAITING,
                    content: {application: 'refreshing Request Data...'},
                });
                // taskIndex = openTasks.findIndex((t) => t.id == task.id);
                fetchATask(userAuthn, task.id)
                    .then((res) => {
                        setUserAuthn(deviseAuthnFromRes(userAuthn, res));

                        setATask(res.data);
                        setstatus({
                            type: STATUS_READY,
                            content: null,
                        });
                    })
                    .catch((err) => {
                        console.log(
                            'Something went wrong with fetchATask catch error task in Task component.'
                        );
                        setUserAuthn(deviseAuthnFromErr(userAuthn, err));

                        setstatus({
                            type: STATUS_ERROR,
                            content: err.response.data,
                        });
                    });
            } else {
                console.log(
                    'Something went wrong with object task in Task component. object not found'
                );

                setstatus({
                    type: STATUS_ERROR,
                    content: {
                        application:
                            'Something went wrong with object task in Task component. object not found',
                    },
                });
                // {
                //   status.content?.description ? (
                //     <span className='tag is-warning'>
                //       {status.content?.description?.join(', ')}
                //     </span>
                //   ) : null;
                // }
            }
        };

        refreshTaskData();
    }, []);

    return (
        <>
            {status.type != STATUS_READY ? (
                <Notification
                    type={status.type}
                    message={JSON.stringify(status.content)}
                />
            ) : null}
            <header className='card-header'>
                <p className='card-header-title'>
                    {' '}
                    <span className='icon is-large'>
            {aTask.kind === MATERIALNEED ? (
                    <>
                        <FaParachuteBox/>
                    </>
                ) : //<i className="fas fa-parachute-box" aria-hidden="true"></i>
                aTask.kind === ONETIMETASK ? (
                    <>
                        {' '}
                        <FaHandsHelping/>
                    </>
                ) : (
                    // <i className="fas fa-hands-helping" aria-hidden="true"></i>
                    <FaLeaf/>
                    // <i className="fas fa-leaf" aria-hidden="true"></i>
                )}
          </span>
                    Request id {aTask.id}: {aTask.title}
                </p>
            </header>
            <div className='card-content'>
                <div className='tile'>
                    <h3>Active conversations: {aTask.active_conversations}</h3>
                </div>
                <div className='tile'>
                    <h3> distance: {parseInt(aTask.distance)} meters </h3>
                </div>
            </div>
        </>
    );
}
