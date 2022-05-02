// Tasks
import React, {useContext, useState} from 'react';
import {MapContext, TasksContext, UserProfileContext,} from '../../AppPrelude';
import TaskMapContainer from '../TaskMapContainer';

import {getDefaultZoom} from '../../services/appServices';

export default function Tasks({
                                  taskListType,
                                  visibleComponents = 'TASKMAP_AND_TASKLIST',
                                  ...restOfProps
                              }) {
    // {
    // radius,
    // setIsOutOfRadius,
    // coords,
    // mapCoords,
    // setCoords,
    // setMapCoords,
    // userCoords,
    // tasks,
    // setUserCoords,
    // ...restOFprops
    // }

    // initial currentMapCoords from props.currentCoords=loggeedProfile.currentCoords
    // currentRadius: 5000, // in meters

    // const [currentCoords, setCurrentCoords] = useState(props.coords);
    // const [currentRadius, setCurrentRadisu] = useState(props.radius);

    // const [currentZoom, setCurrentZoom] = useState(getDefaultZoom); // default x13
    // getCurrentRadius: MapServices computed by view size/leflet OR from LocalStorage aka User Profile Settings

    // const [tasks, setTasks] = useState(getActiveTasks(props.radius));

    // selectedTask = null as default
    // selectedTask is valid only? if? (loggedProfile.taskView==null // both views)
    // selectedTask takes the onClicked task.id to highlight both at the same time; but validity still doesn't matter if it's only one view instead
    // const {
    //   openTasks,
    //   profileTasks,
    //   conversations,
    //   deviceCoords,
    //   userCoords,
    //   mapCoords,
    //   coords,
    //   userRadius,
    //   triggerTasks,
    //   triggerOutOfRadius,
    //   triggerProfileTasks,
    //   triggerConversations,
    //   setUserCoords,
    //   setMapCoords,
    //   refreshDeviceCoords,
    //   updateCoords,
    //   updateRadius,
    // } = useContext(AppStateContext);

    const {
        deviceCoords,
        userCoords,
        mapCoords,
        coords,
        userRadius,

        triggerOutOfRadius,

        setUserCoords,
        setMapCoords,
        refreshDeviceCoords,
        updateCoords,
        updateRadius,
    } = useContext(MapContext);

    const {
        openTasks,
        profileTasks,

        triggerTasks,

        triggerProfileTasks,
    } = useContext(TasksContext);

    const {userProfile} = useContext(UserProfileContext);
    let tasks = null;

    switch (taskListType) {
        case 'openTasks':
            tasks = openTasks.size ? Array.from(openTasks.values()) : null;
            // console.log('FROM TASKS build array tasks from MAP TASKS: ', tasks);
            break;
        case 'profileTasks':
            tasks = profileTasks.size ? Array.from(profileTasks.values()) : null;
            break;

        case 'allOpenTasks':
            tasks =
                openTasks.size && profileTasks.size
                    ? Array.from(openTasks.values()).concat(
                        Array.from(profileTasks.values())
                    )
                    : null;
            break;

        default:
            tasks =
                openTasks.size && profileTasks.size
                    ? Array.from(openTasks.values()).concat(
                        Array.from(profileTasks.values())
                    )
                    : null;
    }

    const [selectedTask, setSelectedTask] = useState(1); // task.id

    // Tasks mounted from root

    // TODO when map changed the zoom...
    // TODO ... the radius updateUserRadius must change

    // const taskComponentDisplayJSX = (
    //   <article className='message is-large is-info'>
    //     {' '}
    //     <p>Loading Tasks Map and/or List</p>
    //   </article>
    // );

    // const taskmapAndtasklistJSX = (
    //   <>
    //     <div className='column  is-three-quarters'>
    //       <TaskMapContainer
    //         zoom={getDefaultZoom(userRadius)}
    //         selectedTask={selectedTask}
    //         // radius={userRadius}
    //         // setIsOutOfRadius={setIsOutOfRadius}
    //         // triggerOutOfRadius={triggerOutOfRadius}
    //         // coords={coords}
    //         // setCoords={setCoords}
    //         // updateCoords={updateCoords}
    //         userCoords={userCoords}
    //         setUserCoords={setUserCoords}
    //         setMapCoords={setMapCoords}
    //         // tasks={openTasks}
    //         taskListType={taskListType}
    //       />
    //     </div>
    //     <div className='column is-tablet'>
    //       <TaskList taskListType={taskListType} selectedTask={selectedTask} />{' '}
    //     </div>
    //   </>
    // );

    // const taskmapJSX = (
    //   <>
    //     <div className='column'>
    //       <TaskMapContainer
    //         zoom={getDefaultZoom(userRadius)}
    //         selectedTask={selectedTask}
    //         // radius={userRadius}
    //         // setIsOutOfRadius={setIsOutOfRadius}
    //         // triggerOutOfRadius={triggerOutOfRadius}
    //         // coords={coords}
    //         // setCoords={setCoords}
    //         // updateCoords={updateCoords}
    //         userCoords={userCoords}
    //         setUserCoords={setUserCoords}
    //         setMapCoords={setMapCoords}
    //         // tasks={openTasks}
    //         taskListType={taskListType}
    //       />
    //     </div>
    //   </>
    // );

    // const tasklistJSX = (
    //   <>
    //     <div className='column is-tablet'>
    //       <TaskList taskListType={taskListType} selectedTask={selectedTask} />{' '}
    //     </div>
    //   </>
    // );

    return (
        // map.on('load moveend', function(e) { ... });
        // or zoomend
        // to loead tasks meanwhile
        // to add
        <>
            <div className='column'>
                <TaskMapContainer
                    userProfile={userProfile}
                    tasks={tasks}
                    zoom={getDefaultZoom(userRadius)}
                    selectedTask={selectedTask}
                    // radius={userRadius}
                    // setIsOutOfRadius={setIsOutOfRadius}
                    // triggerOutOfRadius={triggerOutOfRadius}
                    // coords={coords}
                    // setCoords={setCoords}
                    // updateCoords={updateCoords}
                    userCoords={userCoords}
                    setUserCoords={setUserCoords}
                    setMapCoords={setMapCoords}
                    // tasks={openTasks}
                    taskListType={taskListType}
                />
            </div>
        </>
    );
}

/**
 *
 *
 *  <TaskMap
 selectedTask={selectedTask}
 radius={radius}
 coords={coords}
 tasks={tasks}
 />
 *         <TaskList tasks={tasks} selectedTask={selectedTask} />

 <p>{JSON.stringify(tasks)}</p>


 */

/*
  <div className='columns'>
        <Map className='column is-three-quarters'/>
        <TaskList className='column tasklist box' />
    </div>

        return <h1>task is {JSON.stringify(tasks.find((t) => t.id == id))}</h1>;

*/

/**********************
 import React, { useState, useEffect } from "react";
 import {
  BrowserRouter,
  Route,
  Link,
  NavLink,
  Switch,
  useParams,
} from "react-router-dom";
 import TaskList from "../TaskList";
 import TaskMap from "../TaskMap";

 // import {getCurrentLocation} from './components/api/api';
 // import loggedProfile from './services/user';
 import TaskInfo from "../TaskInfo";

 import { getActiveTasks } from "../../services/TasksServices";

 export default function Tasks(props) {
  // initial currentMapCoords from props.currentCoords=loggeedProfile.currentCoords
  // currentRadius: 5000, // in meters

  // const [currentCoords, setCurrentCoords] = useState(props.coords);
  // const [currentRadius, setCurrentRadisu] = useState(props.radius);

  // const [currentZoom, setCurrentZoom] = useState(getDefaultZoom); // default x13
  // getCurrentRadius: MapServices computed by view size/leflet OR from LocalStorage aka User Profile Settings

  const [tasks, setTasks] = useState(getActiveTasks(props.radius));

  // selectedTask = null as default
  // selectedTask is valid only? if? (loggedProfile.taskView==null // both views)
  // selectedTask takes the onClicked task.id to highlight both at the same time; but validity still doesn't matter if it's only one view instead
  const [selectedTask, setSelectedTask] = useState(null);

  let { id } = useParams();

  if (id == null) {
    // Tasks mounted from root
    return (
      // map.on('load moveend', function(e) { ... });
      // or zoomend
      // to loead tasks meanwhile
      // to add
      <>
        <div className="column  is-three-quarters">
          <TaskMap
            tasks={tasks}
            selectedTask={selectedTask}
            coords={props.coords}
            radius={props.radius}
          />
        </div>
        <div className="column is-tablet">
          <TaskList tasks={tasks} selectedTask={selectedTask} />
        </div>
      </>
    );
  } else {
    // id = parseInt(id);

    return <TaskInfo task={tasks.find((t) => t.id == id)} />; // WARNING === breaks it, use only == for now
  }
}

 ******************************/

/*
  <div className='columns'>
        <Map className='column is-three-quarters'/>
        <TaskList className='column tasklist box' />
    </div>

        return <h1>task is {JSON.stringify(tasks.find((t) => t.id == id))}</h1>;

*/
