import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
// import tasks from '../../services/TasksServices';
// import { Messages } from "../../testdata";

export default function Message({ message, restOfProps }) {
  /**
   * {
  id,
  conversationId,
  timestamp = null,
  speaker,
  text = null,
}
   */
  return <>{message.text}</>;
}

// return (
//   <article className='message'>
//     <div className='message-header'>
//       <p>
//         Time {message.created_at} |{message.user_id} said:
//       </p>
//       {
//         // <button class="delete" aria-label="delete"></button>
//       }
//     </div>
//     <div className='message-body'>{message.text}</div>
//   </article>
// );
