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
  Notification,
  TasksContext,
  UserProfileContext,
  UserAuthnContext,
} from '../../AppPrelude';
import Task from '../Task';
import TaskData from '../TaskData';
import TaskAction from '../TaskAction/TaskAction';
import TaskDetails from '../TaskDetails';
import ConversationList from '../ConversationList';
// import Tasks from '../Tasks';
import {
  fetchTasks,
  fetchATask,
  hideTask,
  pinTask,
  updateATaskAsFullfilled,
  updateATaskAsPublished,
  updateATaskAsUnpublished,
  deleteATask,
  // hideTask,
  // pinTask,
} from '../../services/TasksServices';

import {
  // deviseAuthnResRefresh,
  deviseAuthnFromRes,
  deviseAuthnFromErr,
} from '../../services/apiServices';
import { STATUS_ERROR, STATUS_READY } from '../../services/appServices';
import { MATERIALNEED, ONETIMETASK } from '../../services/apiServices';

export default function TaskShow({
  // taskListType,
  task = null,
  ...restOfProps
}) {
  const { userProfile, setUserProfile } = useContext(UserProfileContext);
  const { userAuthn, setUserAuthn } = useContext(UserAuthnContext);
  const { openTasks, profileTasks } = useContext(TasksContext);

  const [aTask, setATask] = useState(task);
  const [status, setstatus] = useState({ type: STATUS_READY, content: null });
  const { taskid } = useParams();

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
      <TaskDetails task={aTask} />
      {
        // <div className='container'>
        //   <ConversationList taskid={aTask.id} />
        // </div>
      }
    </>
  ) : (
    <Notification type='Error' content={status?.content?.toString()} />
  );
}
