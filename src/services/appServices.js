// Profile, LocalStorage, App Settings and config

import axios from 'axios';

import {
  deviseAuthnResRefresh,
  TASKS_API_TIMEOUT,
  API_APPSTATS_ROUTE,
  reqAuthnToHeaders,
} from './apiServices';

import haversine from 'haversine-distance';

const INFINITY_RADIUS = 30000000.0; // # in meters
const MIN_RADIUS = 50000.0;
const MAX_RADIUS = INFINITY_RADIUS;
const APP_DEFAULT_LAT = 0.1;
const APP_DEFAULT_LNG = 0.1;
const MIN_LATITUDE = -90.0;
const MAX_LATITUDE = 90.0;
const MIN_LONGITUDE = -180.0;
const MAX_LONGITUDE = 180.0;
const MIN_ZOOM = 0;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = MAX_ZOOM - 2;

const MESSAGE_MAX_SIZE = 280; // characters;

const PDF_REGEX_PATTERN = /^[a-zA-Z0-9_()\-\[\]\ \.]+\.pdf$/i; // RegExp('*.pdf$', 'i'); // /^[a-z0-9_()\-\[\]]+\.pdf$/i;
const JPEG_REGEX_PATTERN = /^[a-zA-Z0-9_()\-\[\]\ \.]+\.jpeg$/i; // RegExp('*.jpeg$', 'i'); //   /^[a-z0-9_()\-\[\]]+\.[jpg jpeg]$/i;
const JPG_REGEX_PATTERN = /^[a-zA-Z0-9_()\-\[\]\ \.]+\.jpg$/i; // RegExp('*.jpeg$', 'i'); //   /^[a-z0-9_()\-\[\]]+\.[jpg jpeg]$/i;
const PNG_REGEX_PATTERN = /^[a-zA-Z0-9_()\-\[\]\ \.]+\.png$/i; // RegExp('*.png$', 'i'); //   /^[a-z0-9_()\-\[\]]+\.png$/i;

// App status
const STATUS_WAITING = 'LOADING';
const STATUS_READY = 'READY';
const STATUS_ERROR = 'ERRORS';
const STATUS_INFO = 'INFO';

// User Role
const ROLE_AS_REQUESTOR = 'REQUESTOR';
const ROLE_AS_VOLUNTEER = 'VOLUNTEER';
const ROLE_AS_ADMIN = 'ADMIN';
const ROLE_AS_OTHER = 'OTHER';
const ROLE_AS_ANY = ROLE_AS_REQUESTOR + ROLE_AS_VOLUNTEER;

///////////////////////////////
/////// fetch App stats function exposed on /api/appstats
//////////////////////////////
const fetchAppStats = async (
  authn, //{ accessToken, client, expiry, uid, id },
  userId,
  taskId,
  lat,
  lng,
  radius,
  since
) => {
  const reqConfig = {
    url: API_APPSTATS_ROUTE,
    method: 'get',

    headers: reqAuthnToHeaders(authn),
    timeout: TASKS_API_TIMEOUT,
    params: {
      user_id: userId,
      lat: lat,
      lng: lng,
      radius: radius,
      since: since,
    },
  };

  return axios(reqConfig);
};

// const getCurrentRadius = () => {
//   // in meters
//   // read from LocalStorage
//   // or compute from view size and zoom using leaflet

//   // TEST
//   return MIN_RADIUS;
//   // END TEST
// };

// const getTasksView = () => {
//   // in {null, 'Map', 'List'}
//   // default of Profile, LocalStorage, default=null aka both in desktop and Map in mobile

//   // TEST
//   return null;
// };

// const degreeToRad = (degree) => {
//   return degree * (Math.PI / 180);
// };

// // Using Haversine formula
// const getDistanceFromLatLngInm = (
//   { lat: lat1, lng: lng1 },
//   { lat: lat2, lng: lng2 }
// ) => {
//   let R = 6371; // radius of the Earth(km)
//   let dlat = degreeToRad(lat2 - lat1);
//   let dlng = degreeToRad(lng2 - lng1);
//   let a =
//     Math.sin(dlat / 2) * Math.sin(dlat / 2) +
//     Math.cos(degreeToRad(lat1)) *
//       Math.cos(degreeToRad(lat2)) *
//       Math.sin(dlng / 2) *
//       Math.sin(dlng / 2);
//   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   let d = R * c * 1000; // Distance in m

//   return d;
// };

const getDistanceFromLatLngInm = (coords1, coords2) => {
  return haversine(coords1, coords2);
};

// const getCurrentZoom = (radius) => {
//   // default x18, in profile, LocalStorage
//   // compute from current radius and view size
//   // TEST
//   return 18;
// };

const getDefaultZoom = (radius) => {
  // default x18, in profile, LocalStorage
  // compute from current radius and view size
  // TEST
  return DEFAULT_ZOOM;
};

const loadLocalSettings = () => {
  // in meters
  // read from LocalStorage
  // or compute from view size and zoom using leaflet

  // TEST
  return { radius: 5000, zoom: 16 };
  // END TEST
};

const storeLocalSettings = () => {
  // in meters
  // read from LocalStorage
  // or compute from view size and zoom using leaflet

  // TEST
  console.log('storeLocalSettings ', { radius: 5000, zoom: 16 });
  return { radius: 5000, zoom: 16 };
  // END TEST
};

const randomInt = (min, max) => {
  // [min,max]
  return Math.floor((max - min) * Math.random() + min);
};

export {
  STATUS_WAITING,
  STATUS_READY,
  STATUS_ERROR,
  STATUS_INFO,
  ROLE_AS_ADMIN,
  ROLE_AS_OTHER,
  ROLE_AS_REQUESTOR,
  ROLE_AS_VOLUNTEER,
  ROLE_AS_ANY,
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
  randomInt,
  // getCurrentRadius,
  // getTasksView,
  // getCurrentZoom,
  getDefaultZoom,
  loadLocalSettings,
  storeLocalSettings,
  getDistanceFromLatLngInm,
  PDF_REGEX_PATTERN,
  JPEG_REGEX_PATTERN,
  JPG_REGEX_PATTERN,
  PNG_REGEX_PATTERN,
};
