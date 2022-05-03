// TaskList
import {useContext} from 'react';
import './TaskList.css';
import TaskDetails from '../TaskDetails';
import {Notification, TasksContext} from '../../AppPrelude';

export default function TaskList({
                                     taskListType,
                                     selectedTask,
                                     ...restOfProps
                                 }) {
    const {openTasks, profileTasks} = useContext(TasksContext);
    let taskList = null;


    switch (taskListType) {
        case 'openTasks':
            taskList = openTasks.size ? Array.from(openTasks.values()) : null;
            console.log('FROM TASKS build array taskList from MAP TASKS: ', taskList);
            break;
        case 'profileTasks':
            taskList = profileTasks.size ? Array.from(profileTasks.values()) : null;
            break;

        case 'allOpenTasks':
            taskList =
                openTasks.size && profileTasks.size
                    ? Array.from(openTasks.values()).concat(
                        Array.from(profileTasks.values())
                    )
                    : null;
            break;

        default:
            taskList =
                openTasks.size && profileTasks.size
                    ? Array.from(openTasks.values()).concat(
                        Array.from(profileTasks.values())
                    )
                    : null;
    }

    if (taskList) {
        const listItems = taskList?.map((task) => (
            <div className='block' key={task.id}>
                <li>
                    <TaskDetails task={task}/>
                </li>
            </div>
        ));

        return (
            <>
                <h1>There are {taskList.length} requests</h1>

                <div className='box tasklist'>
                    <ul>{listItems}</ul>
                </div>
            </>
        );
    } else {
        return (
            <div className='box tasklist'>
                <Notification type='Information' message='No Requests to Display'/>
            </div>
        );
    }
}
