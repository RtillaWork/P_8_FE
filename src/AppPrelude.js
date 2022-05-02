import {
    APP_DEFAULT_LAT,
    APP_DEFAULT_LNG,
    DEFAULT_ZOOM,
    getDefaultZoom,
    getDistanceFromLatLngInm,
    INFINITY_RADIUS,
    JPEG_REGEX_PATTERN,
    JPG_REGEX_PATTERN,
    loadLocalSettings,
    MAX_LATITUDE,
    MAX_LONGITUDE,
    MAX_RADIUS,
    MAX_ZOOM,
    MESSAGE_MAX_SIZE,
    MIN_LATITUDE,
    MIN_LONGITUDE,
    MIN_RADIUS,
    MIN_ZOOM,
    PDF_REGEX_PATTERN,
    PNG_REGEX_PATTERN,
    ROLE_AS_ADMIN,
    ROLE_AS_OTHER,
    ROLE_AS_REQUESTOR,
    ROLE_AS_VOLUNTEER,
    STATUS_ERROR,
    STATUS_INFO,
    STATUS_READY,
    STATUS_WAITING,
    storeLocalSettings,
} from './services/appServices';

import UserProfileContext from './services/UserProfileContext';
import UserAuthnContext from './services/UserAuthnContext';

import TasksContext from './services/TasksContext';
import ConversationsContext from './services/ConversationsContext';
// import GeolocationContext from "./services/GeolocationContext";
import MapContext from './services/MapContext';

import AppStateContext from './services/AppStateContext';

import Notification from './components/Notification';

export {
    STATUS_WAITING,
    STATUS_READY,
    STATUS_ERROR,
    STATUS_INFO,
    ROLE_AS_ADMIN,
    ROLE_AS_OTHER,
    ROLE_AS_REQUESTOR,
    ROLE_AS_VOLUNTEER,
    INFINITY_RADIUS,
    MIN_RADIUS,
    MAX_RADIUS,
    APP_DEFAULT_LAT,
    APP_DEFAULT_LNG,
    MIN_LATITUDE,
    MAX_LATITUDE,
    MIN_LONGITUDE,
    MAX_LONGITUDE,
    MIN_ZOOM,
    MAX_ZOOM,
    DEFAULT_ZOOM,
    MESSAGE_MAX_SIZE,
    // getCurrentRadius,
    // getTasksView,
    // getCurrentZoom,
    getDefaultZoom,
    getDistanceFromLatLngInm,
    loadLocalSettings,
    storeLocalSettings,
    UserProfileContext,
    UserAuthnContext,
    TasksContext,
    ConversationsContext,
    // GeolocationContext,
    MapContext,
    AppStateContext,
    Notification,
    PDF_REGEX_PATTERN,
    JPEG_REGEX_PATTERN,
    JPG_REGEX_PATTERN,
    PNG_REGEX_PATTERN,
};
