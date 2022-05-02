//
import axios from 'axios';
import {STATUS_ERROR, STATUS_READY, STATUS_WAITING} from './appServices';

// BEGIN EXPORT CONSTANTS RELATED TO API and REQ/RES SYMBOLS
// export const API_SYMBOLS = {
export const ONETIMETASK = 'OTT'; // 'one_time_task';
export const MATERIALNEED = 'MN'; // 'material_need';
// };
export const MAX_API_TIMEOUT = 0; // seconds
export const MAX_RENDER_TIMEOUT = 3000; // seconds
export const MAX_UI_TIMEOUT = MAX_API_TIMEOUT + MAX_RENDER_TIMEOUT;
export const MAX_TIMEOUT = MAX_UI_TIMEOUT;
export const TASKS_API_TIMEOUT = 0; // no timeout
export const CONVERSATIONS_API_TIMEOUT = 0; // no timeout
export const TASKS_PERIODICUPDATE_INTERVAL = 5000; // refresh tasks DB every 11 seconds
export const CONVERSATIONS_PERIODICUPDATE_INTERVAL = 7000; // refresh conversations DB every 5 seconds
export const MESSAGES_PERIODICUPDATE_INTERVAL = 2000; // refresh messages every 1 seconds

// END EXPORT CONSTANTS RELATED TO API and REQ/RES SYMBOLS

////////////////////////
// BEGIN ROBOHASH ONLINE AVATAR SERVICE CONSTANTS
// Here defaults to PNG and 512x512, but can have jpeg, bmp and any other size
const ROBOHASH_BASE_URL = 'https://robohash.org';
const ROBOHASH_ASIZE = '256x256';
const ROBOHASH_SETS = {
    Robopocalypse: 'set1',
    Monsterstein: 'set2',
    Roboheads: 'set3',
    Kittens: 'set4',
    TechsupportResistance: 'set5',
    any: 'any',
};

const buildMyRobohashUrl = (name) => {
    return `${ROBOHASH_BASE_URL}/${name}.png?size=${ROBOHASH_ASIZE}&set=${ROBOHASH_SETS['Robopocalypse']}`;
};
///////////////////////
// END  ROBOHASH ONLINE AVATAR SERVICE CONSTANTS
//////////////////////////////

////////////////////////////////
// BEGIN API CONSTANTS
///////////////////////////
//const API_HOST = 'http://127.0.0.1';
const API_HOST_IP = '35.209.0.121';
// const API_HOST_IP = '127.0.0.1';
const API_HOST_DOMAIN = 'mapp8.xyz';
// const API_HOST = 'http://35.209.0.121';
const API_HOST = 'http://127.0.0.1';
// const API_HOST = 'https://mapp8.xyz';

const API_PORT = '8443';
const API_BASE_URL = `${API_HOST}:${API_PORT}`;

const API_SIGNUP_ROUTE = '/authn';
const API_SIGNUP_METHOD = 'POST';
const API_DELETE_USER_ROUTE = '/authn';
const API_DELETE_USER_METHOD = 'DELETE';
const API_UPDATE_USER_ROUTE = '/authn';
const API_UPDATE_USER_METHOD = 'PUT';

const API_PASSWORD_UPDATE_ROUTE = '/authn/password';
const API_PASSWORD_UPDATE_METHOD = 'PUT';

const API_SIGNIN_ROUTE = '/authn/sign_in';
const API_SIGNIN_METHOD = 'POST';
const API_SIGNOUT_ROUTE = '/authn/sign_out';
const API_SIGNOUT_METHOD = 'DELETE';

const API_ACTIVESTORAGE_DIRECTUPLOAD_ROUTE = `${API_BASE_URL}/rails/active_storage/direct_uploads`;
const API_ACTIVESTORAGE_DIRECTUPLOAD_METHOD = 'POST';

// NOTE: for now, defaults to index on all tasks minus those of current user...,
// ...as all tasks minus current user's are visible to all
const API_TASKS_ROUTE = `${API_BASE_URL}/tasks`;
const API_TASKS_SHOW_METHOD = 'GET';
const API_TASKS_CREATE_METHOD = 'POST';
const API_PROFILE_TASKS_ROUTE = `${API_BASE_URL}/tasks/user`;
const API_TASK_STATS_ROUTE = `${API_BASE_URL}/tasks/stats`;

// NOTE: for now, defaults to index on all conversations initiatied by current user...,
//
const API_CONVERSATIONS_ROUTE = `${API_BASE_URL}/conversations`;
const API_CONVERSATIONS_SHOW_METHOD = 'GET';
const API_CONVERSATIONS_CREATE_METHOD = 'POST';

// NOTE: for now, defaults to index on all messages belonging to conversation initiated by current user as volunteer...,
//
const API_MESSAGES_ROUTE = `${API_BASE_URL}/messages`;
const API_MESSAGES_METHOD = 'GET';

// App Statistics route
const API_APPSTATS_ROUTE = `${API_BASE_URL}/appstats`;
const API_APPSTATS_METHOD = 'GET';

// Axios defaults and instances

axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.headers.common["Authorization"] = "Bearer undefined";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Origin'] = 'http://35.209.0.121:8443';
axios.defaults.headers.common['Origin'] = `${API_HOST_IP}`;
// axios.defaults.headers.common['Origin'] = '127.0.0.1';

// http: axios.defaults.headers.common["Accept"] = "*/*";
//// axios.defaults.headers.common['Accept'] = '*/*';
axios.defaults.headers.common['Connection'] = 'keep-alive';
axios.defaults.headers.common['Content-Type'] =
    'application/json; charset=utf-8';
////axios.defaults.headers.common['Cache-Control'] =
////('max-age=0, private, must-revalidate');
// axios.defaults.headers.common["Access-Control-Request-Headers"] = "X-Custom-Header-project; X-Requested-With; etc...";
// axios.defaults.headers.common["X-Requested-With"] = "this app";
// axios.defaults.headers.common["X-Custom-Header-project"] = "this proj";
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.post["Content-Type"] =   "application/x-www-form-urlencoded";
/**
 * curl -H "Origin: http://example.com" \
 -H "Access-Control-Request-Method: POST" \
 -H "Access-Control-Request-Headers: X-Requested-With" \
 -X OPTIONS --verbose \
 https://www.googleapis.com/discovery/v1/apis?fields=

 *
 */

// Utility http/s, devise and axios functions

//////////////////////////////
/// Check if devise Authn Object is blank or broken
///////////////////////////

const isAuthnObjectInvalid = (authn) => {
    if (
        authn == null ||
        authn == undefined ||
        !authn?.accessToken ||
        !authn?.tokenType ||
        !authn?.expiry ||
        !authn?.client ||
        !authn?.uid
    ) {
        return true;
    } else {
        return false;
    }
};

// //////////////////////////////
// /// Check if devise Authn Object is blank or broken
// // this version is for both response.headers and error.response.headers
// ///////////////////////////

// const isAuthnObjectInvalidResErr = (headers) => {
//   if (
//     headers == null ||
//     headers == undefined ||
//     headers == '' ||
//     !headers?.accessToken ||
//     !headers?.tokenType ||
//     !headers?.expiry ||
//     !headers?.client ||
//     !headers?.uid ||

//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

// //////////////////////////////
// /// A less strict version of isAuthnObjectInvalid to accomodate for...
// // ... deviceTokenAuth keep-alive and burst replies with missing access-token and/or expiry
// //  Check if devise Authn Object is blank or broken, less strict
// ///////////////////////////

// const isAuthnObjectInvalidLenient= (authn) => {
//   if (
//     authn == null ||
//     authn == undefined ||
//     // !authn?.accessToken ||
//     // !authn?.tokenType ||
//     // !authn?.expiry ||
//     // !authn?.client ||
//     !authn?.uid
//   ) {
//     console.log(
//       'DEBUG ### isAuthnObjectInvalidLenientResErr RESPONSE headers NULL OR UNDEFINED'
//     );
//     return true;
//   } else {
//     console.log(
//       'DEBUG ### isAuthnObjectInvalidLenientResErr RESPONSE headers exist and uid exists'
//     );
//     return false;
//   }
// };

//////////////////////////////
/// Check if user Profile Object is blank or broken
///////////////////////////

const isUserProfileObjectInvalid = (profile) => {
    if (
        profile == null ||
        profile == undefined ||
        !profile?.id ||
        !profile?.uid ||
        profile?.id == '' ||
        profile?.uid == ''
    ) {
        return true;
    } else {
        return false;
    }
};

//////////////////////////////
/// Check if user Profile Object is incomplete, mostly because of Signup state
///////////////////////////

const isUserProfileObjectIncomplete = (profile) => {
    if (isUserProfileObjectInvalid(profile)) {
        // Make sure first it is not broken or invalid
        console.log(
            'ERROR isUserProfileObjectIncomplete=TRUE ;; profile=',
            profile
        );
    } else if (
        // we care mainly about govId and b-e required parameters for signup
        profile?.firstName == '' ||
        profile?.firstName == null ||
        profile?.firstName == undefined ||
        profile?.lastName == '' ||
        profile?.lastName == null ||
        profile?.lastName == undefined ||
        profile?.govId == '' ||
        profile?.govId == null ||
        profile?.govId == undefined
    ) {
        return true;
    } else {
        return false;
    }
};

/////////////////////////
// converts userAuthn object to the equivalent HTTP headers entries
///////////////////
const authnToHttpHeaders = (authn) => {
    const authnHttpHeaders = {
        'access-token': authn.accessToken,
        'token-type': authn.tokenType ?? 'Bearer', // "Bearer" or tokenType: res.headers["token-type"],
        'client': authn.client,
        'expiry': authn.expiry,
        'uid': authn.uid,
    };

    return authnHttpHeaders;
};

///////////////////////////////////////////
// converts userAuthn object to the equivalent HTTP headers entries
/////////////////////
const deviseAuthnToHttpHeaders = (authn) => {
    const deviseAuthnHttpHeaders = {
        'access-token': authn.accessToken,
        'token-type': 'Bearer', // or tokenType: res.headers["token-type"],
        'client': authn.client,
        'expiry': authn.expiry,
        'uid': authn.uid,
    };

    return deviseAuthnHttpHeaders;
};

////////////////////////
/// returns a more exapanded axios headers
// NOTE subjec to to change and experiements because of CORS
///////////////////////
const reqAuthnToHeaders = (authn) => {
    const headers = {
        'access-token': authn.accessToken,
        'token-type': authn.tokenType ?? 'Bearer', // "Bearer" or tokenType: res.headers["token-type"],
        'client': authn.client,
        'expiry': authn.expiry,
        'uid': authn.uid,
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Accept': '*/*',
        'Host': '127.0.0.1:3001',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    };

    // timeout: 3000,
    // params: {
    //   id: id,
    //   lat: coords.lat,
    //   lng: coords.lng,
    //   radius: radius,
    // },
    return headers;
};

////////////////////////////////////////////////////////
///// converts users data from response to userProfile object
//////////////////////////////////////
const userProfileFromHttpRes = (res) => {
    /** res.data.data, */
        // userProfile {}:
    let userProfile = {
            address: null,
            allowPasswordChange: null,
            avatar: null,
            email: null,
            firstName: null,
            govId: null,
            id: null,
            lastLoggedIn: null,
            lastActive: null,
            lastName: null,
            preferredName: null,
            provider: null,
            uid: null,
            lat: null,
            lng: null,
        };

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## USER PROFILE response data userProfileFromHttpRes: ',
    //   res.data,
    //   res.status,
    //   res.statusText,
    //   res.headers
    //   // res.request
    // );
    if (res.status == 200) {
        userProfile = {
            address: res.data.data.address,
            allowPasswordChange: res.data.data.allow_password_change,
            avatar: res.data.data.avatar,
            email: res.data.data.email,
            firstName: res.data.data.first_name,
            govId: res.data.data.gov_id,
            id: res.data.data.id,
            lastLoggedIn: res.data.data.last_loggedin,
            lastActive: res.data.data.last_active,
            lastName: res.data.data.last_name,
            preferredName: res.data.data.preferred_name,
            provider: res.data.data.provider,
            uid: res.data.data.uid,
            lat: res.data.data.default_lat,
            lng: res.data.data.default_lng,
        };
    }

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## USER PROFILE RETURN OBJECT: {userProfile, ...}',
    //   { userProfile: userProfile, status: res.status }
    // );

    // return { userProfile: userProfile, status: res.status };
    return userProfile;
};

////////////////////////////////////////////////////////
///// set status from response or error to status object
//////////////////////////////////////
const statusFromHttpResOrErr = (resOrErr) => {
    /** res.data.data, */
    let status = STATUS_WAITING;
    let message = 'UNDETERMINATE';

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## USER PROFILE response data userProfileFromHttpRes: ',
    //   resOrErr ??
    //     'resOrErr: Response Or Error is null. Possibly XHR Query or Network Error',
    //   resOrErr?.data,
    //   resOrErr?.status,
    //   resOrErr?.statusText,
    //   resOrErr?.headers,
    //   resOrErr?.response ?? 'OK NO ERR RESPONSE'
    //   // res.request
    // );

    // if resOrErr is an error with the shape
    // {response:
    //      {headers:, status: , statusText:, data:
    //                                   {status:"error", errors:[,]}
    //        }
    //     }
    if (resOrErr?.response) {
        resOrErr = resOrErr.response;
    }
    // QUERY error
    else if (resOrErr?.message) {
        throw Error;
    }
    // else regular response
    else {
        // console.log(
        //   'DEBUG ##### APISERVICES # ## ## NO ERRORS USER PROFILE response data userProfileFromHttpRes: ',
        //   resOrErr ??
        //     'resOrErr: Response Or Error is null. Possibly XHR Query or Network Error',
        //   resOrErr?.data,
        //   resOrErr?.status,
        //   resOrErr?.statusText,
        //   resOrErr?.headers,
        //   resOrErr?.response ?? 'OK NO ERR RESPONSE'
        //   // res.request
        // );
        if (resOrErr?.status >= 100 && resOrErr?.status < 300) {
            status = STATUS_READY;
            message = [
                resOrErr?.data?.message ??
                'STATUS READY' + resOrErr.status + resOrErr.statusText,
            ];
        } else {
            status = STATUS_READY;
            message = [
                resOrErr?.data ??
                'STATUS READY' + resOrErr.status + resOrErr.statusText,
            ];
        }
    }

    if (resOrErr?.status >= 400 && resOrErr?.status < 500) {
        status = STATUS_ERROR;
        message = [
            resOrErr?.message
                ? resOrErr?.message
                : 'ERROR: DEBUG REQUEST NOT SENT: WRONG APP REQUEST FORMAT',
        ];
        message.push(
            resOrErr?.data?.errors
                ? JSON.stringify(resOrErr?.data?.errors)
                : 'ERROR: DEBUG NO ERROR RESPONSE OR ERROR DATA'
        );

        message.push(
            JSON.stringify(
                resOrErr?.headers
                    ? JSON.stringify(resOrErr?.headers)
                    : 'ERROR: DEBUG NO ERROR RESPONSE HEADERS'
            )
        );
    } else {
        message = [
            resOrErr?.response ?? 'ERROR: HTTP Response is UNDEFINED. STATUS ERROR',
        ];
    }

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## statusFromHttpRes',
    //   status,
    //   message
    // );

    // return { userProfile: userProfile, status: res.status };
    return {status: status, message: JSON.stringify(message)};
};

////////////////////////////////////////////////////////
///// New set status from response to status object
//////////////////////////////////////
const statusFromHttpRes = (res) => {
    /** res.data.data, */
    let status = STATUS_WAITING;
    let message = 'RES SUCCESS';

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## USER PROFILE response data userProfileFromHttpRes: ',
    //   res ??
    //     'res: Response Or Error is null. Possibly XHR Query or Network Error',
    //   res?.data,
    //   res?.status,
    //   res?.statusText,
    //   res?.headers,
    //   res?.response ?? 'OK NO ERR RESPONSE'
    //   // res.request
    // );

    // if err is an error with the shape
    // {response:
    //      {headers:, status: , statusText:, data:
    //                                   {status:"error", errors:[,]}
    //        }
    //     }
    if (res?.response) {
        res = res.response;
    }
    // QUERY error
    else if (res?.message) {
        throw Error;
    }
    // else regular response
    else {
        // console.log(
        //   'DEBUG ##### APISERVICES # ## ## NO ERRORS USER PROFILE response data userProfileFromHttpRes: ',
        //   res ??
        //     'res: Response Or Error is null. Possibly XHR Query or Network Error',
        //   res?.data,
        //   res?.status,
        //   res?.statusText,
        //   res?.headers,
        //   res?.response ?? 'OK NO ERR RESPONSE'
        //   // res.request
        // );
        if (res?.status >= 100 && res?.status < 300) {
            status = STATUS_READY;
            message = [
                res?.data?.message ?? 'STATUS READY' + res.status + res.statusText,
            ];
        } else {
            status = STATUS_READY;
            message = [res?.data ?? 'STATUS READY' + res.status + res.statusText];
        }
    }

    if (res?.status >= 400 && res?.status < 500) {
        status = STATUS_ERROR;
        message = [
            res?.message
                ? res?.message
                : 'ERROR: DEBUG REQUEST NOT SENT: WRONG APP REQUEST FORMAT',
        ];
        message.push(
            res?.data?.errors
                ? JSON.stringify(res?.data?.errors)
                : 'ERROR: DEBUG NO ERROR RESPONSE OR ERROR DATA'
        );

        message.push(
            JSON.stringify(
                res?.headers
                    ? JSON.stringify(res?.headers)
                    : 'ERROR: DEBUG NO ERROR RESPONSE HEADERS'
            )
        );
    } else {
        message = [
            res?.response ?? 'ERROR: HTTP Response is UNDEFINED. STATUS ERROR',
        ];
    }

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## statusFromHttpRes',
    //   status,
    //   message
    // );

    // return { userProfile: userProfile, status: res.status };
    return {status: status, message: JSON.stringify(message)};
};

////////////////////////////////////////////////////////
///// NEW set status from  error to status object
//////////////////////////////////////
const statusFromHttpErr = (err) => {
    /** err.data.data, */
    let status = STATUS_WAITING;
    let body = {};

    if (
        err?.response?.status == 401 || // Unauthorized
        err?.response?.status == 422 || // Unprocessable
        err?.response?.status == 500 // internal server error
    ) {
        status = STATUS_ERROR;
        body = {...body, ...err?.response.data.errors};
    }

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## USER PROFILE response data userProfileFromHttpRes: ',
    //   err ??
    //     'err: Response Or Error is null. Possibly XHR Query or Network Error',
    //   err?.data,
    //   err?.status,
    //   err?.statusText,
    //   err?.headers,
    //   err?.response ?? 'OK NO ERR RESPONSE'
    //   // res.request
    // );

    // if err is an error with the shape
    // {response:
    //      {headers:, status: , statusText:, data:
    //                                   {status:"error", errors:[,]}
    //        }
    //     }
    // if (err?.response) {
    //   err = err.response;
    // }
    // // QUERY error
    // else if (err?.message) {
    //   throw Error;
    // }
    // // else regular response
    // else {
    //   console.log(
    //     'DEBUG ##### APISERVICES # ## ## NO ERRORS USER PROFILE response data userProfileFromHttpRes: ',
    //     err ??
    //       'err: Response Or Error is null. Possibly XHR Query or Network Error',
    //     err?.data,
    //     err?.status,
    //     err?.statusText,
    //     err?.headers,
    //     err?.response ?? 'OK NO ERR RESPONSE'
    //     // res.request
    //   );
    //   if (err?.status >= 100 && err?.status < 300) {
    //     status = STATUS_READY;
    //     message = [
    //       err?.data?.message ?? 'STATUS READY' + err.status + err.statusText,
    //     ];
    //   } else {
    //     status = STATUS_READY;
    //     message = [err?.data ?? 'STATUS READY' + err.status + err.statusText];
    //   }
    // }

    // if (err?.status >= 400 && err?.status < 500) {
    //   status = STATUS_ERROR;
    //   message = [
    //     err?.message
    //       ? err?.message
    //       : 'ERROR: DEBUG REQUEST NOT SENT: WRONG APP REQUEST FORMAT',
    //   ];
    //   message.push(
    //     err?.data?.errors
    //       ? JSON.stringify(err?.data?.errors)
    //       : 'ERROR: DEBUG NO ERROR RESPONSE OR ERROR DATA'
    //   );

    //   message.push(
    //     JSON.stringify(
    //       err?.headers
    //         ? JSON.stringify(err?.headers)
    //         : 'ERROR: DEBUG NO ERROR RESPONSE HEADERS'
    //     )
    //   );
    // } else {
    //   message = [
    //     err?.response ?? 'ERROR: HTTP Response is UNDEFINED. STATUS ERROR',
    //   ];
    // }

    // console.log(
    //   'DEBUG ##### APISERVICES # ## ## statusFromHttpRes',
    //   status,
    //   message
    // );

    // return { userProfile: userProfile, status: res.status };
    return {status: status, body: body};
};

//
// Returns refreshed device authn headers in case of change or undef or empty, otherwise keep the same
//
const deviseAuthnResRefresh = (previousAuthn, res) => {
    // CASE OF missing or broken res headers because of network or query setup error...
    // keep previousAuthnToken WARNING: initial Authn response missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case res is null
    if (res == null || res == undefined) {
        // console.log(
        //   'DEBUG ### deviceTokenAuthRefresh RESPONSE IS NULL OR UNDEFINED, HEADERs from THEN= HTTP HEADERS'
        // );
        return previousAuthn;
    }
    // END CASE OF missing or broken res headers because of network or query setup error WARNING: NO ID

    // CASE OF catch with err with the shape err: {response: {headers:, data:,...}}...
    // devise sends here a valid token, ecept that res = res.response
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case res is null
    if (res.response?.headers) {
        // console.log(
        //   'DEBUG ### deviceTokenAuthRefresh RESPONSE exists OR with HEADERs from Catch err headers= HTTP HEADERS'
        // );

        return previousAuthn;
    }
    // END CASE OF  OF catch with err with the shape err: {response: {headers:, data:,...}}...

    // console.log(
    //   'DEBUG ### deviceTokenAuthRefresh HEADERs from THEN= HTTP HEADERS',
    //   {
    //     acessToken: res?.headers['access-token'],
    //     tokenType: res?.headers['token-type'],
    //     expiry: res?.headers['expiry'],
    //     client: res?.headers['client'],
    //     uid: res?.headers['uid'],
    //   }
    // );

    const responseAccessToken = res.headers['access-token'];
    const responseClient = res.headers['client']; // TODO check for security with this later
    const responseTokenType = res.headers['token-type'];
    const responseExpiry = res.headers['expiry'];
    const responseUid = res.headers['uid']; // TODO check with security with this later

    // CASE OF INITIAL AUTHn TOKEN; WARNING: initial Authn response missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE previousAuthn Object is always assumed to be valid except during first query/login/signup as null
    if (previousAuthn == null || previousAuthn == undefined) {
        return {
            accessToken: responseAccessToken,
            tokenType: responseTokenType,
            client: responseClient,
            expiry: responseExpiry,
            uid: responseUid,
            // id: "", NOTE: no id here, needs to be re-combined from userProfile.id
        };
    }
    // END CASE OF INITIAL AUTHn TOKEN; WARNING: NO ID

    // BEGIN CASE of out of order res object with responseExpiry < previousAuthn.expiry
    // in this case skip refresh and return same previousAuthn
    if (responseExpiry < previousAuthn.expiry) {
        let refreshedAccessToken = previousAuthn.accessToken;
        let refreshedClient = previousAuthn.client;
        let refreshedExpiry = previousAuthn.expiry;
        let refreshedTokenType = 'Bearer'; // previousAuthn.tokenType;
        let refreshedUid = previousAuthn.uid;
        // authnCredentials
        const refreshedAuthn = {
            accessToken: refreshedAccessToken,
            tokenType: 'Bearer', // refreshedTokenType, // res.headers["token-type"], // Should always be "Bearer"
            client: refreshedClient, // previousAuthn.client, previousAuthn.client,
            expiry: refreshedExpiry,
            uid: refreshedUid, // previousAuthn.uid,
            // id: previousAuthn?.id,
        };
        // console.log(
        //   'DEBUG ###### deviceAuthnResRefresh CURRENT REFRESHED? SKIPPED BECAUSE res.expiry<previous.expiry AUTHN DIDNT CHANGE =',
        //   refreshedAuthn
        // );

        return refreshedAuthn;
    }
    // END CASE of out of order res object with responseExpiry < previousAuthn.expiry

    // BEGIN CASE of response exipiry more recent than previousAuthn.expiry
    // fill in empty response fields with valid data from previousAuthn, keep the rest
    let refreshedAccessToken = null;
    let refreshedClient = null;
    let refreshedExpiry = null;

    if (responseAccessToken != '' && responseAccessToken != undefined) {
        refreshedAccessToken = responseAccessToken;
    } else {
        refreshedAccessToken = previousAuthn.accessToken;
    }

    if (responseClient != '' && responseClient != undefined) {
        refreshedClient = responseClient;
    } else {
        refreshedClient = previousAuthn.client;
    }

    if (responseExpiry != '' && responseExpiry != undefined) {
        refreshedExpiry = responseExpiry;
    } else {
        refreshedExpiry = previousAuthn.expiry;
    }

    // authnCredentials
    const refreshedAuthn = {
        accessToken: refreshedAccessToken,
        tokenType: 'Bearer', //responseTokenType, // res.headers["token-type"], // Should always be "Bearer"
        client: refreshedClient, // previousAuthn.client, previousAuthn.client,
        expiry: refreshedExpiry,
        uid: responseUid, // previousAuthn.uid,
        // id: previousAuthn?.id,
    };
    // console.log(
    //   'DEBUG ###### deviceAuthnResRefresh CURRENT REFRESHED? AUTHN =',
    //   refreshedAuthn
    // );

    return refreshedAuthn;
};

//
//  NEW Returns refreshed device authn headers in case of change or undef or empty, otherwise keep the same
// only for successful responses... see below for case of catch(err=>{})
//
const deviseAuthnFromRes = (previousAuthn, res) => {
    // CASE OF missing or broken res headers because of network or query setup error...
    // keep previousAuthnToken WARNING: initial Authn response missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case res is null
    if (!res || !res?.headers) {
        if (isAuthnObjectInvalid(previousAuthn)) {
            throw new Error('DEVISE AUTHN FROM RES ERROR');
        } else {
            return previousAuthn;
        }
    }
    // END CASE OF missing or broken res headers because of network or query setup error WARNING: NO ID

    // console.log('DEBUG ### deviseAuthnFromRes HEADERs from THEN= HTTP HEADERS', {
    //   acessToken: res?.headers['access-token'],
    //   expiry: res?.headers['expiry'],
    //   client: res?.headers['client'],
    //   uid: res?.headers['uid'],
    //   tokenType: res?.headers['token-type'],
    // });

    const responseAuthn = {
        accessToken: res.headers['access-token'],
        client: res.headers['client'], // TODO check for security with this later
        expiry: res.headers['expiry'],
        uid: res.headers['uid'], // TODO check with security with this later
        tokenType: res.headers['token-type'],
    };

    // CASE OF INITIAL AUTHn TOKEN; WARNING: initial Authn response missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE previousAuthn Object is always assumed to be valid except during first query/login/signup as null
    if (!previousAuthn) {
        return responseAuthn;
    }
    // END CASE OF INITIAL AUTHn TOKEN; WARNING: NO ID

    // BEGIN CASE of out of order res object with responseExpiry < previousAuthn.expiry
    // in this case skip refresh and return same previousAuthn
    if (responseAuthn.expiry < previousAuthn.expiry) {
        // console.log(
        //   'DEBUG ###### deviseAuthnFromRes CURRENT REFRESHED? SKIPPED BECAUSE res.expiry<previous.expiry AUTHN DIDNT CHANGE =',
        //   previousAuthn
        // );

        return previousAuthn;
    }
    // END CASE of out of order res object with responseExpiry < previousAuthn.expiry

    // BEGIN CASE of response expiry more recent than previousAuthn.expiry
    // start with responseAuthn values, fill in empty response fields with valid data from previousAuthn, keep the rest
    const refreshedAuthn = {
        ...responseAuthn,
    };
    if (!refreshedAuthn.accessToken) {
        refreshedAuthn.accessToken = previousAuthn.accessToken;
    }
    if (!refreshedAuthn.client) {
        refreshedAuthn.client = previousAuthn.client;
    }
    if (!refreshedAuthn.expiry) {
        refreshedAuthn.expiry = previousAuthn.expiry;
    }
    if (!refreshedAuthn.uid) {
        refreshedAuthn.uid = previousAuthn.uid;
    }
    if (!refreshedAuthn.tokenType) {
        refreshedAuthn.tokenType = previousAuthn.tokenType ?? 'Bearer';
    }

    // console.log(
    //   'DEBUG ###### deviseAuthnFromRes CURRENT REFRESHED? updated between res and previous token AUTHN DID CHANGE =',
    //   refreshedAuthn
    // );

    return refreshedAuthn;
};

//
//  NEW Returns refreshed device authn headers in case of change or undef or empty, otherwise keep the same
// only for Error responses... see above for for case of then(res=>{})
// res is expected to be = error.response if present
// in case there is no error.response, it's probably an internal server error or a query error...
// that would require to return the previousToken, although the chain of authentication will...
// likely be broken at that point
const deviseAuthnFromErr = (previousAuthn, err) => {
    // CASE OF missing or broken err headers because of network or query setup error...
    // keep previousAuthnToken WARNING: initial Authn errponse missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case err is null
    if (!err?.response || !err?.response?.headers) {
        if (isAuthnObjectInvalid(previousAuthn)) {
            throw new Error('DEVISE AUTHN FROM RES ERROR');
        } else {
            return previousAuthn;
        }
    }
    // END CASE OF missing or broken res headers because of network or query setup error WARNING: NO ID

    const res = err.response;

    // console.log('DEBUG ### deviseAuthnFromErr HEADERs from THEN= HTTP HEADERS', {
    //   acessToken: res?.headers['access-token'],
    //   expiry: res?.headers['expiry'],
    //   client: res?.headers['client'],
    //   uid: res?.headers['uid'],
    //   tokenType: res?.headers['token-type'],
    // });

    const responseAuthn = {
        accessToken: res.headers['access-token'],
        client: res.headers['client'], // TODO check for security with this later
        expiry: res.headers['expiry'],
        uid: res.headers['uid'], // TODO check with security with this later
        tokenType: res.headers['token-type'],
    };

    // CASE OF INITIAL AUTHn TOKEN; WARNING: initial Authn response missing user ID
    // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
    // NOTE previousAuthn Object is always assumed to be valid except during first query/login/signup as null
    if (!previousAuthn) {
        return responseAuthn;
    }
    // END CASE OF INITIAL AUTHn TOKEN; WARNING: NO ID

    // BEGIN CASE of out of order res object with responseExpiry < previousAuthn.expiry
    // in this case skip refresh and return same previousAuthn
    if (responseAuthn.expiry < previousAuthn.expiry) {
        // console.log(
        //   'DEBUG ###### deviseAuthnFromErr CURRENT REFRESHED? SKIPPED BECAUSE res.expiry<previous.expiry AUTHN DIDNT CHANGE =',
        //   previousAuthn
        // );

        return previousAuthn;
    }
    // END CASE of out of order res object with responseExpiry < previousAuthn.expiry

    // BEGIN CASE of response expiry more recent than previousAuthn.expiry
    // start with responseAuthn values, fill in empty response fields with valid data from previousAuthn, keep the rest
    const refreshedAuthn = {
        ...responseAuthn,
    };
    if (!refreshedAuthn.accessToken) {
        refreshedAuthn.accessToken = previousAuthn.accessToken;
    }
    if (!refreshedAuthn.client) {
        refreshedAuthn.client = previousAuthn.client;
    }
    if (!refreshedAuthn.expiry) {
        refreshedAuthn.expiry = previousAuthn.expiry;
    }
    if (!refreshedAuthn.uid) {
        refreshedAuthn.uid = previousAuthn.uid;
    }
    if (!refreshedAuthn.tokenType) {
        refreshedAuthn.tokenType = previousAuthn.tokenType ?? 'Bearer';
    }

    // console.log(
    //   'DEBUG ###### deviseAuthnFromErr CURRENT REFRESHED? updated between res and previous token AUTHN DID CHANGE =',
    //   refreshedAuthn
    // );

    return refreshedAuthn;
};

// //
// // Returns refreshed device authn headers in case of change or undef or empty, otherwise keep the same
// //
// const deviseAuthnResRefresh = (previousAuthn, res) => {
//   // CASE OF missing or broken res headers because of network or query setup error...
//   // keep previousAuthnToken WARNING: initial Authn response missing user ID
//   // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
//   // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case res is null
//   if (
//     res == null ||
//     res == undefined
//     // || res?.accessToken == '' ||
//     // res?.accessToken == null ||
//     // res?.accessToken == undefined ||
//     // res?.client == '' ||
//     // res?.client == null ||
//     // res?.client == undefined ||
//     // res?.expiry == '' ||
//     // res?.expiry == null ||
//     // res?.expiry == undefined ||
//     // res?.uid == '' ||
//     // res?.uid == null ||
//     // res?.uid == undefined
//   ) {
//     console.log(
//       'DEBUG ### deviceTokenAuthRefresh RESPONSE IS NULL OR UNDEFINED, HEADERs from THEN= HTTP HEADERS'
//     );
//     return previousAuthn;
//   }
//   // END CASE OF missing or broken res headers because of network or query setup error WARNING: NO ID

//   // CASE OF catch with err with the shape err: {response: {headers:, data:,...}}...
//   // devise sends here a valid token, ecept that res = res.response
//   // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
//   // NOTE here previousAuthn Object is assumed to be valid as this is an app error recovery in case res is null
//   if (res.response?.headers) {
//     console.log(
//       'DEBUG ### deviceTokenAuthRefresh RESPONSE exists OR with HEADERs from Catch err headers= HTTP HEADERS'
//     );
//     if (!res.response?.headers['uid'] || !res.response?.headers['expiry']) {
//       return previousAuthn;
//     } else {
//       res = res.response;
//     }
//   }
//   // END CASE OF  OF catch with err with the shape err: {response: {headers:, data:,...}}...

//   console.log(
//     'DEBUG ### deviceTokenAuthRefresh HEADERs from THEN= HTTP HEADERS',
//     {
//       acessToken: res?.headers['access-token'],
//       tokenType: res?.headers['token-type'],
//       expiry: res?.headers['expiry'],
//       client: res?.headers['client'],
//       uid: res?.headers['uid'],
//     }
//   );

//   const responseAccessToken = res.headers['access-token'];
//   const responseClient = res.headers['client']; // TODO check for security with this later
//   const responseTokenType = res.headers['token-type'];
//   const responseExpiry = res.headers['expiry'];
//   const responseUid = res.headers['uid']; // TODO check with security with this later

//   // CASE OF INITIAL AUTHn TOKEN; WARNING: initial Authn response missing user ID
//   // TODO replace the if and test with isAuthnObjectInvalid(previousAuthn)
//   // NOTE previousAuthn Object is always assumed to be valid except during first query/login/signup as null
//   if (
//     previousAuthn == null ||
//     previousAuthn == undefined ||
//     previousAuthn?.accessToken == '' ||
//     previousAuthn?.accessToken == null ||
//     previousAuthn?.accessToken == undefined ||
//     previousAuthn?.client == '' ||
//     previousAuthn?.client == null ||
//     previousAuthn?.client == undefined ||
//     previousAuthn?.expiry == '' ||
//     previousAuthn?.expiry == null ||
//     previousAuthn?.expiry == undefined ||
//     previousAuthn?.uid == '' ||
//     previousAuthn?.uid == null ||
//     previousAuthn?.uid == undefined
//   ) {
//     return {
//       accessToken: responseAccessToken,
//       tokenType: responseTokenType,
//       client: responseClient,
//       expiry: responseExpiry,
//       uid: responseUid,
//       // id: "", NOTE: no id here, needs to be re-combined from userProfile.id
//     };
//   }
//   // END CASE OF INITIAL AUTHn TOKEN; WARNING: NO ID

//   // BEGIN CASE of out of order res object with responseExpiry < previousAuthn.expiry
//   // in this case skip refresh and return same previousAuthn
//   if (responseExpiry < previousAuthn.expiry) {
//     let refreshedAccessToken = previousAuthn.accessToken;
//     let refreshedClient = previousAuthn.client;
//     let refreshedExpiry = previousAuthn.expiry;
//     let refreshedTokenType = previousAuthn.tokenType;
//     let refreshedUid = previousAuthn.uid;
//     // authnCredentials
//     const refreshedAuthn = {
//       accessToken: refreshedAccessToken,
//       tokenType: 'Bearer', // refreshedTokenType, // res.headers["token-type"], // Should always be "Bearer"
//       client: refreshedClient, // previousAuthn.client, previousAuthn.client,
//       expiry: refreshedExpiry,
//       uid: refreshedUid, // previousAuthn.uid,
//       // id: previousAuthn?.id,
//     };
//     console.log(
//       'DEBUG ###### deviceAuthnResRefresh CURRENT REFRESHED? SKIPPED BECAUSE res.expiry<previous.expiry AUTHN DIDNT CHANGE =',
//       refreshedAuthn
//     );

//     return refreshedAuthn;
//   }
//   // END CASE of out of order res object with responseExpiry < previousAuthn.expiry

//   // BEGIN CASE of response exipiry more recent than previousAuthn.expiry
//   // fill in empty response fields with valid data from previousAuthn, keep the rest
//   let refreshedAccessToken = null;
//   let refreshedClient = null;
//   let refreshedExpiry = null;

//   if (responseAccessToken != '' && responseAccessToken != undefined) {
//     refreshedAccessToken = responseAccessToken;
//   } else {
//     refreshedAccessToken = previousAuthn.accessToken;
//   }

//   if (responseClient != '' && responseClient != undefined) {
//     refreshedClient = responseClient;
//   } else {
//     refreshedClient = previousAuthn.client;
//   }

//   if (responseExpiry != '' && responseExpiry != undefined) {
//     refreshedExpiry = responseExpiry;
//   } else {
//     refreshedExpiry = previousAuthn.expiry;
//   }

//   // authnCredentials
//   const refreshedAuthn = {
//     accessToken: refreshedAccessToken,
//     tokenType: 'Bearer', //responseTokenType, // res.headers["token-type"], // Should always be "Bearer"
//     client: refreshedClient, // previousAuthn.client, previousAuthn.client,
//     expiry: refreshedExpiry,
//     uid: responseUid, // previousAuthn.uid,
//     // id: previousAuthn?.id,
//   };
//   console.log(
//     'DEBUG ###### deviceAuthnResRefresh CURRENT REFRESHED? AUTHN =',
//     refreshedAuthn
//   );

//   return refreshedAuthn;
// };

export {
    authnToHttpHeaders,
    deviseAuthnToHttpHeaders,
    userProfileFromHttpRes,
    deviseAuthnResRefresh,
    deviseAuthnFromRes,
    deviseAuthnFromErr,
    buildMyRobohashUrl,
    reqAuthnToHeaders,
    isAuthnObjectInvalid,
    isUserProfileObjectInvalid,
    isUserProfileObjectIncomplete,
    statusFromHttpResOrErr,
    statusFromHttpErr,
    API_HOST,
    API_PORT,
    API_BASE_URL,
    API_SIGNUP_ROUTE,
    API_SIGNUP_METHOD,
    API_DELETE_USER_ROUTE,
    API_DELETE_USER_METHOD,
    API_UPDATE_USER_ROUTE,
    API_UPDATE_USER_METHOD,
    API_PASSWORD_UPDATE_ROUTE,
    API_PASSWORD_UPDATE_METHOD,
    API_SIGNIN_ROUTE,
    API_SIGNIN_METHOD,
    API_SIGNOUT_ROUTE,
    API_SIGNOUT_METHOD,
    API_ACTIVESTORAGE_DIRECTUPLOAD_ROUTE,
    API_ACTIVESTORAGE_DIRECTUPLOAD_METHOD,
    API_TASKS_ROUTE,
    API_PROFILE_TASKS_ROUTE,
    API_TASK_STATS_ROUTE,
    API_CONVERSATIONS_ROUTE,
    API_MESSAGES_ROUTE,
    API_MESSAGES_METHOD,
    API_APPSTATS_ROUTE,
    API_APPSTATS_METHOD,
};
/****************************************************

 const config = {
  baseURL: API_BASE_URL,
  // timeout: 5000,
  // headers: { "X-Custom-Header-project": "project8" },
  headers: {
    // "access-token": authn.accessToken,
    // client: authn.client,
    // expiry: authn.expiry,
    // uid: authn.uid,
    // "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    // "User-Agent": "PostmanRuntime/7.26.8",
    Accept: "*
    /*",
    // "Postman-Token": "e738542b-0d9b-4edd-88a3-32a0ee0ae12d",
    // Host: "127.0.0.1:3001",
    // "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Type": "application/json; charset=utf-8",
    // "access-token": "do4e6kh2Rf14xsJLVH9Qjw",
    // "token-type": "Bearer",
    // client: "Odt4HBsX6p81oxho55uuyQ",
    // expiry: 1623197681,
    // uid: "user50@m50.co",
    // ETag: 'W/"4f01a291e55e6acbd25331dc315cd52d"',
    "Cache-Control": "max-age=0, private, must-revalidate",
    // "X-Request-Id": "6d81da9d-dae6-445f-979f-8d7f55578480",
    // "X-Runtime": 0.337923,
    // Vary: "Origin",
    // "Transfer-Encoding": "chunked",
  },
  timeout: 3000,
};

 axios.defaults.baseURL = API_BASE_URL;
 // axios.defaults.headers.common["Authorization"] = "Bearer undefined";
 // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
 axios.defaults.headers.common["Origin"] = "http://localhost:3001";
 http: axios.defaults.headers.common["Accept"] = "*
 /*";
 axios.defaults.headers.common["Connection"] = "keep-alive";
 axios.defaults.headers.common["Content-Type"] =
 "application/json; charset=utf-8";
 axios.defaults.headers.common["Cache-Control"] =
 "max-age=0, private, must-revalidate";
 // axios.defaults.headers.common["Access-Control-Request-Headers"] = "X-Custom-Header-project; X-Requested-With; etc...";
 // axios.defaults.headers.common["X-Requested-With"] = "this app";
 // axios.defaults.headers.common["X-Custom-Header-project"] = "this proj";
 // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
 // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
 // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
 // axios.defaults.headers.post["Content-Type"] =   "application/x-www-form-urlencoded";

 *******************************************************/

/**
 * curl -H "Origin: http://example.com" \
 -H "Access-Control-Request-Method: POST" \
 -H "Access-Control-Request-Headers: X-Requested-With" \
 -X OPTIONS --verbose \
 https://www.googleapis.com/discovery/v1/apis?fields=

 *
 */

/*********
 const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  // headers: { "X-Custom-Header-project": "project8" },
});
 ************/

////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/***********************************************************
 const API_HOST = "http://127.0.0.1";
 const API_PORT = "3001";
 const API_SIGNUP_ROUTE = "/authn";
 const API_SIGNUP_METHOD = "POST";
 const API_SIGNIN_ROUTE = "/authn/sign_in";
 const API_SIGNIN_METHOD = "POST";
 const API_SIGNOUT_ROUTE = "/authn/sign_out";
 const API_SIGNOUT_METHOD = "DELETE";

 const axiosInstance = axios.create({
  baseURL: `${API_HOST}:${API_PORT}`,
  timeout: 5000,
  // headers: { "X-Custom-Header-project": "project8" },
});

 const getDataForUserId = async (
 apiRoute,
 params,
 { accessToken,
    // tokenType, 
    client, expiry, uid, id }
 ) => {
  // NOTE: must retrieve and return the uid, authentication-token and the client for use for the next request

  return axiosInstance
    .get(`${apiRoute}`, {
      headers: {
        "access-token": accessToken,
        client: client,
        expiry: expiry,
        uid: uid,
      },
    })
    .then(function (res) {
      console.log(
        res.data,
        res.status,
        res.statusText,
        res.headers,
        res.request
      );
      console.log({
        acessToken: res.headers["access-token"],
        // tokenType: res.headers["token-type"],
        expiry: res.headers["expiry"],
        client: res.headers["client"],
        uid: res.headers["uid"],
      });
      return {
        data: res.data,
        authnCredentials: {
          accessToken: res.headers["access-token"],
          // tokenType: tokenType,
          client: res.headers["client"],
          expiry: res.headers["expiry"],
          uid: res.headers["uid"],
          id: id,
        },
      };
    })
    .catch(function (err) {
      console.log(err);
      return { error: err };
    });
};

 export { getDataForUserId };

 */

// Started PUT "/authn" for 127.0.0.1 at 2021-05-26 18:38:42 -0600
// Processing by DeviseTokenAuth::RegistrationsController#update as */*
//   Parameters: {"first_name"=>"Cierra", "last_name"=>"Simonis", "preferred_name"=>"Cierranea", "address"=>"60568 Turcotte Squareet", "registration"=>{"first_name"=>"Cierra", "last_name"=>"Simonis", "preferred_name"=>"Cierranea", "address"=>"60568 Turcotte Squareet"}}
//   User Load (0.5ms)  SELECT "users".* FROM "users" WHERE "users"."uid" = $1 LIMIT $2  [["uid", "u2@m2.co"], ["LIMIT", 1]]
// Unpermitted parameter: :registration
// Started POST "/rails/active_storage/direct_uploads" for 127.0.0.1 at 2021-05-26 18:38:42 -0600
// Processing by DirectUploadsController#create as JSON
//   Parameters: {"blob"=>{"filename"=>"tumblr_pkj9u8VUnx1tg9ln0_640 (1).jpg", "content_type"=>"image/jpeg", "byte_size"=>47689, "checksum"=>"SzMK7PwjcSx02O/jMwp6IA=="}, "direct_upload"=>{"blob"=>{"filename"=>"tumblr_pkj9u8VUnx1tg9ln0_640 (1).jpg", "content_type"=>"image/jpeg", "byte_size"=>47689, "checksum"=>"SzMK7PwjcSx02O/jMwp6IA=="}}}
// HTTP Origin header (https://localhost:3000) didn't match request.base_url (http://127.0.0.1:3001)
// Completed 422 Unprocessable Entity in 1ms (ActiveRecord: 0.0ms | Allocations: 1134)

// ActionController::InvalidAuthenticityToken (ActionController::InvalidAuthenticityToken)
