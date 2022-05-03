// InfomationPopup
// Should use a Bulma level, stay level on mobile is-mobile modifier
// https://leafletjs.com/reference-1.7.1.html#map-event

import {Link, useHistory} from 'react-router-dom';

import {STATUS_ERROR, STATUS_INFO, STATUS_READY, STATUS_WAITING,} from '../../AppPrelude';

import './Notification.css';

export default function Notification({
                                         type = 'Notification',
                                         message = 'Undeterminate',
                                         redirectMessage,
                                         ...restOfProps
                                     }) {
    const history = useHistory();
    // default parameters are
    const DELAY_TIMEOUT = 5000; // 5 seconds


    let notificationClassName = 'notification ';
    type == STATUS_ERROR
        ? (notificationClassName += ' is-error')
        : type == STATUS_WAITING
            ? (notificationClassName += ' is-warning')
            : type == STATUS_READY
                ? (notificationClassName += ' is-success')
                : type == STATUS_INFO || type == 'LOADING'
                    ? (notificationClassName += ' is-link')
                    : (notificationClassName += ' is-link');

    let messageContent = message;
    // console.log('NOTIFICATION MESSAGE: ', message);
    type == STATUS_ERROR
        ? (messageContent = message?.join('\n'))
        : type == STATUS_WAITING
            ? (messageContent = message?.info ?? 'LOADING...')
            : type == STATUS_READY
                ? (messageContent = message ?? 'READY')
                : type == STATUS_INFO || type == 'LOADING'
                    ? (messageContent = message ?? 'LOADING...')
                    : (messageContent = message ?? 'PLEASE WAIT...');

    return (
        <div className='box notification-overlay'>
            <div className='notification is-info'>
                <h1>{messageContent}</h1>
                <Link to='/' className='button  is-success'>
                    Dismiss
                </Link>
            </div>
        </div>
    );
}

