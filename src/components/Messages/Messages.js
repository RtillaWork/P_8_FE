import React, {useContext} from 'react';
import UserProfileContext from '../../services/UserProfileContext';
import Message from '../Message';

export default function Messages({messages, ...restOfProps}) {
    const {userProfile} = useContext(UserProfileContext);

    const messagesJSX = (
        <div style={{heigth: '30vh', width: '70vw'}}>
            {messages.map((message, i) => {
                const isCurrentUserClass = message.user_id == userProfile.id;
                return (
                    <li key={message.id.toString()}>
                        <div
                            style={{
                                padding: '.25em',
                                textAlign: isCurrentUserClass ? 'left' : 'right',
                                height: 'unset',
                                whiteSpace: 'unset',
                            }}>
                            <div
                                className={`tag is-medium ${
                                    isCurrentUserClass ? 'is-success' : 'is-info'
                                }`}
                                style={{
                                    height: 'unset',
                                    whiteSpace: 'unset',
                                }}>
                                <Message message={message}/>
                            </div>
                        </div>
                    </li>
                );
            })}
        </div>
    );

    return <ul>{messagesJSX}</ul>;
}

// const messagesJSX = messages.map((message) => {
//   return (
//     <li key={message.id.toString()}>
//       <Message message={message} />
//     </li>
//   );
// });
