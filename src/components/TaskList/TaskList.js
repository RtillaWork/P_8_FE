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

    // switch (taskListType) {
    //   case 'openTasks':
    //     taskList = openTasks;
    //     break;
    //   case 'profileTasks':
    //     taskList = profileTasks;
    //     break;

    //   case 'allOpenTasks':
    //     taskList = profileTasks.concat(openTasks);
    //     break;

    //   default:
    //     taskList = profileTasks.concat(openTasks);
    // }

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

// active_conversations: 0
// ​​​
// created_at: "2021-06-13T14:02:07.148Z"
// ​​​
// distance: 2133.659015783616
// ​​​
// id: 661
// ​​​
// inactive_conversations: 0
// ​​​
// is_fullfilled: false
// ​​​
// is_fullfilling: false
// ​​​
// is_published: true
// ​​​
// is_republishable: null
// ​​​
// is_within_radius: true
// ​​​
// kind: "MN"
// ​​​
// lat: -23.534658740850542
// ​​​
// lng: -46.64508842951527
// ​​​
// query_since: "1969-12-31T17:00:00.000-07:00"
// ​​​
// republishable_start_time: null
// ​​​
// title: "Title by requestor 34: Can you please help with MN"
// ​​​
// updated_at: "2021-06-13T14:02:07.148Z"
// ​​​
// user_id: 34
