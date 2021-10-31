//
import React, {
  useState,
  useEffect,
  Context,
  createContext,
  useContext,
} from "react";
import { geolocationServices } from "./geolocationServices.js";

// Conversations Context

let MapContext = createContext();
export default MapContext;
