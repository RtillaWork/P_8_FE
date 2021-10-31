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

export default function TaskDetails({ task, ...restOfProps }) {
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
  const [showMoreTaskData, setShowMoreTaskData] = useState(false);

  useEffect(() => {
    const refreshTaskData = () => {
      if (task?.id) {
        setstatus({
          type: STATUS_WAITING,
          content: { application: 'refreshing Request Data...' },
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

  const handleRefreshTaskData = (e) => {
    e.preventDefault();
    // let taskIndex = -1;
    if (task?.id) {
      setstatus({
        type: STATUS_WAITING,
        content: { application: 'refreshing Request Data...' },
      });
      // taskIndex = openTasks.findIndex((t) => t.id == task.id);
      fetchATask(userAuthn, task.id)
        .then((res) => {
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

  const toggleShowMoreTaskData = (e) => {
    e.preventDefault();
    setShowMoreTaskData((prevState) => !prevState);
  };

  const profileUserTaskButtons = (
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
      {
        //   aTask.is_fullfilled ? (
        //   <button
        //     type='button'
        //     onClick={handleDeleteATask}
        //     className='card-footer-item button is-danger'>
        //     delete
        //   </button>
        // ) : null
      }
    </>
  );

  const otherUserTaskButtons = (
    <>
      {aTask?.current_conversation_id && aTask?.is_published ? (
        <Link
          type='button'
          /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
          /**to={`/tasks/${props.aTask.id}/conversations`} */
          className='card-footer-item button is-success'
          to={`/conversations/${aTask.current_conversation_id}`}>
          Resume Conversation
        </Link>
      ) : aTask?.is_published ? (
        <Link
          type='button'
          /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
          /**to={`/tasks/${props.aTask.id}/conversations`} */
          className='card-footer-item button is-info'
          to={`/requests/${aTask.id}/conversations`}>
          Offer to fullfill
        </Link>
      ) : null}
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

  const openTaskButtons = (
    <>
      <Link
        type='button'
        className='card-footer-item button is-info'
        to={`/requests/${aTask.id}`}>
        Details
      </Link>
      <Link
        type='button'
        /**TODO? onClick={ CREATE HERE POST NEW /aTask/:id/conversations and get back its new ID then route     } */
        /**to={`/tasks/${props.aTask.id}/conversations`} */
        className='card-footer-item button is-primary'
        to={`/requests/${aTask.id}/conversations`}>
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
      {status.type != STATUS_READY ? (
        <Notification
          type={status.type}
          message={JSON.stringify(status.content)}
        />
      ) : null}

      <header className='card-header'>
        <p className='card-header-title'>
          {' '}
          <span className='title'> {aTask.title}</span>
        </p>
        <h3 className='title'>
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
        </h3>
      </header>
      <div className='card-content'>
        <div className='tile'>
          <div className='tile is-parent is-vertical'>
            <article className='tile is-child notification is-secondary'>
              <p className='title'>
                Request Data id: {aTask.id}
                <button
                  className='button is-small is-secondary'
                  onClick={toggleShowMoreTaskData}>
                  ...
                </button>
              </p>

              <p className='subtitle'>
                Active conversations: {aTask.active_conversations}
              </p>
              {showMoreTaskData ? (
                <>
                  <p className='subtitle'>
                    Inactive conversations: {aTask.inactive_conversations}
                  </p>
                  <p className='subtitle'>Created at: {aTask.created_at}</p>
                  <p className='subtitle'>Updated at: {aTask.updated_at}</p>

                  <p className='subtitle'>
                    Is Fullfilled: {aTask.is_fullfilled?.toString()}
                  </p>
                  <p className='subtitle'>
                    Is being Fullfilled: {aTask.is_fullfilling?.toString()}
                  </p>
                  <p className='subtitle'>
                    Is Published: {aTask.is_published?.toString()}
                  </p>
                  <p className='subtitle'>
                    Is republishable: {aTask.is_republishable?.toString()}
                  </p>
                  <p className='subtitle'>
                    Is within radius: {aTask.is_within_radius?.toString()}
                  </p>
                  <p className='subtitle'> Distance: {aTask.distance} m </p>
                  <p className='subtitle'>
                    {' '}
                    Position: {aTask.lat}, {aTask.lng}{' '}
                  </p>
                </>
              ) : null}
            </article>
            <article className='tile is-child notification is-success'>
              <p className='title'>Description:</p>
              <p className='subtitle'>
                {aTask.description ? (
                  <span className='content'>
                    {aTask.description}
                    {/* <br/> */}
                    {/* <time datetime={props.aTask.dateLastUpdate.toString()}>{Date(props.aTask.dateLastUpdate).toString()}</time> */}
                  </span>
                ) : (
                  <button
                    className='button is-warning is-fullwidth'
                    onClick={handleRefreshTaskData}>
                    click to resync Request Data{' '}
                  </button>
                )}
              </p>
            </article>
          </div>
        </div>
      </div>
      <footer className='card-footer'>
        {aTask.user_id == userProfile.id
          ? profileUserTaskButtons
          : otherUserTaskButtons}
      </footer>
    </div>
  );
}
