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
import { Notification } from '../../AppPrelude';
import UserProfileContext from '../../services/UserProfileContext';
import UserAuthnContext from '../../services/UserAuthnContext';
import { MATERIALNEED, ONETIMETASK } from '../../services/apiServices';
import TasksContext from '../../services/TasksContext';

export default function Task({ task, ...restOfProps }) {
  const { userProfile } = useContext(UserProfileContext);
  const { userAuthn } = useContext(UserAuthnContext);
  const {
    openTasks,
    profileTasks,
    setTasksUpdateTracker,
    setProfileTasksUpdateTracker,
  } = useContext(TasksContext);
  const [aTask, setATask] = useState(task);

  const handleLoadTaskDescription = (e) => {
    e.preventDefault();
    // let taskIndex = -1;
    if (task) {
      // taskIndex = openTasks.findIndex((t) => t.id == task.id);
      fetchATask(userAuthn, task.id)
        .then((res) => {
          if (openTasks.has(task.id)) {
            const previousTaskData = openTasks.get(task.id);
            openTasks.set(task.id, { ...previousTaskData, ...res.data });
          } else {
            openTasks.set(res.data.id, res.data);
          }
          setATask(res.data);
        })
        .catch((err) => {
          console.log(
            'Something went wrong with fetchATask catch error task in Task component.'
          );
        });
    } else {
      console.log(
        'Something went wrong with object task in Task component. object not found'
      );
    }
  };

  const handleMarkATaskAsFullfilled = (e) => {
    e.preventDefault();
    updateATaskAsFullfilled(userAuthn, parseInt(aTask.id))
      .then((res) => (aTask.is_fullfilled = true))
      .catch((err) => console.log(err));
  };

  const handleMarkATaskAsPublished = (e) => {
    e.preventDefault();
    updateATaskAsPublished(userAuthn, parseInt(aTask.id))
      .then((res) => (aTask.is_published = true))
      .catch((err) => console.log(err));
  };

  const handleMarkATaskAsUnpublished = (e) => {
    e.preventDefault();
    updateATaskAsUnpublished(userAuthn, parseInt(aTask.id))
      .then((res) => (aTask.is_published = false))
      .catch((err) => console.log(err));
  };
  const handleDeleteATask = (e) => {
    e.preventDefault();
    deleteATask(userAuthn, parseInt(aTask.id))
      .then((res) => setATask(null))
      .catch((err) => console.log(err));
  };

  const profileUserTaskButtons = (
    <>
      <Link
        type='button'
        /**TODO? onClick={ CREATE HERE POST NEW /task/:id/conversations and get back its new ID then route     } */
        /**to={`/tasks/${props.task.id.toString()}/conversations`} */
        className='card-footer-item button is-primary'
        to={`/requests/${aTask.id.toString()}/conversations`}>
        Conversation
      </Link>{' '}
      <Link
        type='button'
        className='card-footer-item button is-info'
        to={`/requests/${aTask.id.toString()}`}>
        Details
      </Link>
      <button
        type='button'
        onClick={handleMarkATaskAsFullfilled}
        className='card-footer-item button is-warning'>
        Mark Fullfilled
      </button>{' '}
      {aTask.is_republishable ? (
        <button
          type='button'
          onClick={() => handleMarkATaskAsPublished}
          className='card-footer-item button is-warning'>
          Republish
        </button>
      ) : (
        <button type='button' className='card-footer-item button is-info'>
          Can&#39;t Republish
        </button>
      )}
      <button
        type='button'
        onClick={() => handleMarkATaskAsUnpublished}
        className='card-footer-item button is-warning'>
        Unpublish
      </button>{' '}
      {
        // <button
        //   type='button'
        //   onClick={() => handleDeleteATask}
        //   className='card-footer-item button is-danger'>
        //   delete
        // </button>
      }
    </>
  );

  const otherUserTaskButtons = (
    <>
      <Link
        type='button'
        /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
        /**to={`/tasks/${props.aTask.id.toString()}/conversations`} */
        className='card-footer-item button is-primary'
        to={`/requests/${aTask.id.toString()}/conversations`}>
        Offer to fullfill
      </Link>{' '}
      <Link
        type='button'
        className='card-footer-item button is-info'
        to={`/requests/${aTask.id.toString()}`}>
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

  const openTaskButtons = (
    <>
      <Link
        type='button'
        className='card-footer-item button is-info'
        to={`/requests/${aTask.id.toString()}`}>
        Details
      </Link>
      <Link
        type='button'
        /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
        /**to={`/tasks/${props.aTask.id.toString()}/conversations`} */
        className='card-footer-item button is-primary'
        to={`/requests/${aTask.id.toString()}/conversations`}>
        Offer Help
      </Link>
      {
        // <button
        //   type='button'
        //   onClick={() => {
        //     // console.log(userProfile);
        //     hideTask(parseInt(aTask.id));
        //   }}
        //   className='card-footer-item button is-link'>
        //   Hide
        // </button>
        // <button
        //   type='button'
        //   onClick={() => pinTask(parseInt(aTask.id))}
        //   className='card-footer-item button is-link'>
        //   Pin
        // </button>
      }
    </>
  );

  return (
    <div className='card'>
      <p> position={[aTask.lat, aTask.lng]} </p>
      <p>Active conversations: {aTask.active_conversations}</p>
      <p>Inactive conversations: {aTask.inactive_conversations}</p>

      <p>Created at {aTask.created_at}</p>
      <p>Is Fullfilled: {aTask.is_fullfilled?.toString()}</p>
      <p>Is being Fullfilled: {aTask.is_fullfilling?.toString()}</p>
      <p>Is Published: {aTask.is_published?.toString()}</p>
      <p>Is republishable: {aTask.is_republishable?.toString()}</p>
      <p>Is within radius: {aTask.is_within_radius?.toString()}</p>

      <p> distance={aTask.distance} </p>
      <p>key or aTask.id={aTask.id.toString()} </p>
      <header className='card-header'>
        <p className='card-header-title'>{aTask.title}</p>

        <span className='icon is-large'>
          {aTask.kind === MATERIALNEED ? (
            <FaParachuteBox />
          ) : //<i className="fas fa-parachute-box" aria-hidden="true"></i>
          aTask.kind === ONETIMETASK ? (
            <FaHandsHelping />
          ) : (
            // <i className="fas fa-hands-helping" aria-hidden="true"></i>
            <FaLeaf />
            // <i className="fas fa-leaf" aria-hidden="true"></i>
          )}
        </span>
      </header>
      <div className='card-content'>
        {aTask.description ? (
          <div className='content'>
            {aTask.description}
            {/* <br/> */}
            {/* <time datetime={props.aTask.dateLastUpdate.toString()}>{Date(props.aTask.dateLastUpdate).toString()}</time> */}
          </div>
        ) : (
          <button onClick={handleLoadTaskDescription}>Load description </button>
        )}
      </div>
      <footer className='card-footer'>
        {aTask.user_id == userProfile.id
          ? profileUserTaskButtons
          : otherUserTaskButtons}
      </footer>
    </div>
  );
}
