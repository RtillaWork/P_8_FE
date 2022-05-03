import React, {useContext, useState} from 'react';
import {Link,} from 'react-router-dom';
import {
    deleteATask,
    updateATaskAsFullfilled,
    updateATaskAsPublished,
    updateATaskAsUnpublished,
} from '../../services/TasksServices';
import {TasksContext, UserAuthnContext, UserProfileContext,} from '../../AppPrelude';
import {STATUS_ERROR, STATUS_READY,} from '../../services/appServices';

export default function RequestorUserRoleTaskButtons({task, ...restOfProps}) {
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

    const handleMarkATaskAsFullfilled = (e) => {
        e.preventDefault();
        updateATaskAsFullfilled(userAuthn, parseInt(aTask.id))
            .then((res) => {
                console.log('TASK IS FULLFILLED');
                setATask((prev) => {
                    return {...prev, is_fullfilled: true};
                });
                // (aTask.is_fullfilled = true);
            })
            .catch((err) => {
                console.log('TASK FAILED TO BE FULLFILLED', err);
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data,
                });
            });
    };

    const handleMarkATaskAsPublished = (e) => {
        e.preventDefault();
        updateATaskAsPublished(userAuthn, parseInt(aTask.id))
            .then((res) => {
                console.log('Task IS PUBLISHED');
                setATask((prev) => {
                    return {...prev, is_published: true};
                });
                // (aTask.is_published = true)
            })
            .catch((err) => {
                console.log('TASK FAILED TO BE PUBLISHED, ', err);
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data,
                });
            });
    };

    const handleMarkATaskAsUnpublished = (e) => {
        e.preventDefault();
        updateATaskAsUnpublished(userAuthn, parseInt(aTask.id))
            .then((res) => {
                console.log('Task IS UNPUBLISHED');
                setATask((prev) => {
                    return {...prev, is_published: false};
                });
                // (aTask.is_published = false)
            })
            .catch((err) => {
                console.log('TASK FAILED TO BE UNPUBLISHED, ', err);
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data,
                });
            });
    };
    const handleDeleteATask = (e) => {
        e.preventDefault();
        deleteATask(userAuthn, parseInt(aTask.id))
            .then((res) => setATask(null))
            .catch((err) => {
                console.log('TASK FAILED TO BE DELETED, ', err);
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data,
                });
            });
    };

    return (
        <>
            <Link
                type='button'
                /**TODO? onClick={ CREATE HERE POST NEW /task/:id/conversations and get back its new ID then route     } */
                /**to={`/tasks/${props.task.id.toString()}/conversations`} */
                className='card-footer-item button is-primary'
                to={`/requests/${aTask.id}/conversations`}>
                Conversation(s)
            </Link>{' '}
            <Link
                type='button'
                className='card-footer-item button is-info'
                to={`/requests/${aTask.id}`}>
                Details
            </Link>
            {aTask.is_fullfilled ? (
                <button type='button' className='card-footer-item button is-success'>
                    Already Fullfilled
                </button>
            ) : (
                <button
                    type='button'
                    onClick={handleMarkATaskAsFullfilled}
                    className='card-footer-item button is-warning'>
                    Mark Fullfilled
                </button>
            )}
            {!aTask.is_fullfilled && !aTask.is_published && aTask.is_republishable ? (
                <button
                    type='button'
                    onClick={handleMarkATaskAsPublished}
                    className='card-footer-item button is-success'>
                    Republish
                </button>
            ) : !aTask.is_fullfilled &&
            !aTask.is_published &&
            !aTask.is_republishable ? (
                <button type='button' className='card-footer-item button is-dark'>
                    Can&#39;t Republish
                </button>
            ) : null}
            {!aTask.is_fullfilled && aTask.is_published ? (
                <button
                    type='button'
                    onClick={handleMarkATaskAsUnpublished}
                    className='card-footer-item button is-warning'>
                    Unpublish
                </button>
            ) : null}

        </>
    );
}
