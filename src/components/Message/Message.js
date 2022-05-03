import React from 'react';
// import tasks from '../../services/TasksServices';
// import { Messages } from "../../testdata";

export default function Message({message, restOfProps}) {
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

