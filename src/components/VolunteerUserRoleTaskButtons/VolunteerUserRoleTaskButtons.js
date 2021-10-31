import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import { FaParachuteBox, FaHandsHelping, FaLeaf } from 'react-icons/fa';
import {
  fetchATask,
  fetchTasks,
  updateATaskAsFullfilled,
  updateATaskAsPublished,
  updateATaskAsUnpublished,
  deleteATask,
  // hideTask,
  // pinTask,
} from '../../services/TasksServices';
import {
  Notification,
  UserProfileContext,
  UserAuthnContext,
  TasksContext,
} from '../../AppPrelude';
import {
  MATERIALNEED,
  ONETIMETASK,
  deviseAuthnFromRes,
  deviseAuthnFromErr,
} from '../../services/apiServices';
import TaskData from '../TaskData';
import {
  STATUS_READY,
  STATUS_ERROR,
  STATUS_WAITING,
} from '../../services/appServices';

export default function VolunteerUserRoleTaskButtons({ task, ...restOfProps }) {
  const { userProfile } = useContext(UserProfileContext);
  const { userAuthn, setUserAuthn } = useContext(UserAuthnContext);
  const {
    openTasks,
    profileTasks,
    setTasksUpdateTracker,
    setProfileTasksUpdateTracker,
  } = useContext(TasksContext);
  const [aTask, setATask] = useState(task);
  const [status, setstatus] = useState({ type: STATUS_READY, content: null });

  const handleMarkATaskAsFullfilled = (e) => {
    e.preventDefault();
    updateATaskAsFullfilled(userAuthn, parseInt(aTask.id))
      .then((res) => {
        console.log('TASK IS FULLFILLED');
        setATask((prev) => {
          return { ...prev, is_fullfilled: true };
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
          return { ...prev, is_published: true };
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
          return { ...prev, is_published: false };
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
      {aTask?.current_conversation_id ? (
        <Link
          type='button'
          /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
          /**to={`/tasks/${props.aTask.id}/conversations`} */
          className='card-footer-item button is-success'
          to={`/conversations/${aTask.current_conversation_id}`}>
          Resume Conversation
        </Link>
      ) : (
        <Link
          type='button'
          /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
          /**to={`/tasks/${props.aTask.id}/conversations`} */
          className='card-footer-item button is-info'
          to={`/requests/${aTask.id}/conversations`}>
          Offer to fullfill
        </Link>
      )}
      <Link
        type='button'
        className='card-footer-item button is-link'
        to={`/requests/${aTask.id}`}>
        Details
      </Link>
      {aTask.authz_volunteer_ids?.includes(userProfile.id) ? (
        <button
          type='button'
          onClick={handleMarkATaskAsFullfilled}
          className='card-footer-item button is-warning'>
          Mark Fullfilled
        </button>
      ) : null}
    </>
  );
}
