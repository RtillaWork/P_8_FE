//
import React, {
  useState,
  useEffect,
  Context,
  createContext,
  useContext,
} from 'react';
import { ConversationsServices } from './ConversationsServices';

// Conversations Context

let ConversationsContext = createContext(new Map());
export default ConversationsContext;
