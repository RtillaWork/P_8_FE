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
                    userCoords={userCoords}
                    setUserCoords={setUserCoords}
                    setMapCoords={setMapCoords}
                    taskListType={taskListType}
                />
            </div>
        </>
    );
}

