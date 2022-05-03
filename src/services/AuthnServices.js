// Authentication services
import axios from 'axios';
import {
    API_BASE_URL,
    API_DELETE_USER_ROUTE,
    API_PASSWORD_UPDATE_ROUTE,
    API_SIGNIN_ROUTE,
    API_SIGNOUT_ROUTE,
    API_SIGNUP_ROUTE,
    API_UPDATE_USER_ROUTE,
    MAX_API_TIMEOUT,
    reqAuthnToHeaders,
} from './apiServices';

// const API_HOST = "http://127.0.0.1";
// const API_PORT = "3001";
// const API_BASE_URL = `${API_HOST}:${API_PORT}`;

// const API_SIGNUP_ROUTE = "/authn";
// const API_SIGNUP_METHOD = "POST";
// const API_DELETE_USER_ROUTE = "/authn";
// const API_DELETE_USER_METHOD = "DELETE";
// const API_UPDATE_USER_ROUTE = "/authn";
// const API_UPDATE_USER_METHOD = "PUT";

// const API_PASSWORD_UPDATE_ROUTE = "/authn/password";
// const API_PASSWORD_UPDATE_METHOD = "PUT";

// const API_SIGNIN_ROUTE = "/authn/sign_in";
// const API_SIGNIN_METHOD = "POST";
// const API_SIGNOUT_ROUTE = "/authn/sign_out";
// const API_SIGNOUT_METHOD = "DELETE";

const config = {
    baseURL: API_BASE_URL,
    // timeout: 5000,
    // headers: { "X-Custom-Header-project": "project8" },
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'max-age=0, private, must-revalidate',

    },
    timeout: 3000,
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: MAX_API_TIMEOUT,
    // headers: { "X-Custom-Header-project": "project8" },
});

// https://devise-token-auth.gitbook.io/devise-token-auth/usage
// email,
// firstName,
// lastName,
// preferredName,
// avatar,
// address,
// defaultLat,
// defaultLng,
// govId,
// password,
// passwordConfirmation,
// setUserAuthn,
// setUserProfile,
const signUp = async (
    email,
    firstName,
    lastName,
    password,
    passwordConfirmation

    // preferredName = "",
    // avatar = "",
    // address = "",
    // defaultLat = "",
    // defaultLng = "",
    // govId = ""
) => {
    //   // NOTE: Avatar is generated automatically
    //   // TODO: add addressCoords gps location as default/address related GPS
    //   // TODO: when preferredName is empty, make it = firstName by default

    const reqConfig = {
        url: API_SIGNUP_ROUTE,
        method: 'post',

        data: {
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            first_name: firstName,
            last_name: lastName,
            // preferred_name: preferredName,
            // avatar: avatar,
            // address: address,
            // default_lat: defaultLat,
            // default_lng: defaultLng,
            // gov_id: govId,
        },
        timeout: MAX_API_TIMEOUT,
    };

    return axios(reqConfig);
};

// https://devise-token-auth.gitbook.io/devise-token-auth/usage
const signIn = async (email, password) => {
    // TODO: load addressCoords if it exists
    // TODO: clean initialize other fields if empty
    const requestConfig = {
        url: API_SIGNIN_ROUTE,
        method: 'post',

        data: {
            email: email,
            password: password,
        },

        timeout: MAX_API_TIMEOUT,
    };

    return axios(requestConfig);
};

//////////////////
//
// signOut
//
const signOut = async (authn) => {
    // {uid, accessToken, client}
    return axiosInstance
        .delete(API_SIGNOUT_ROUTE, {
            headers: reqAuthnToHeaders(authn),

            // headers: {
            //   uid: authn.uid,
            //   "access-token": authn.accessToken,
            //   client: authn.client,
            // },
        })
        .then(function (res) {

            return {response: res};
        })
        .catch(function (err) {
            console.log(err);
            return {error: err};
        });
};

/////////////// UPDATE USER PROFILE NEW
//   authn;

const updateUserProfile = async (
    authn,
    firstName,
    lastName,
    preferredName,
    avatar,
    address,
    lat,
    lng,
    govId
) => {
    // Avatar is generated automatically
    // TODO Avatar can be regenerated, changed randomly or a URL can be provided instead
    const reqConfig = {
        url: API_UPDATE_USER_ROUTE,
        method: 'put',
        headers: reqAuthnToHeaders(authn),
        data: {
            // email: email,
            // password: password,
            // password_confirmation: passwordConfirmation,
            first_name: firstName,
            last_name: lastName,
            preferred_name: preferredName == '' ? firstName : preferredName,
            avatar: avatar,
            address: address,
            default_lat: lat,
            default_lng: lng,
            gov_id: govId,
            last_active: Date.now(),
        },

        timeout: MAX_API_TIMEOUT,
    };

    return axios(reqConfig);

};

////////////////////////////////////
// deleteUserProfile
/////////////////////////////////
const deleteUserProfile = async (authn) => {
    // {uid, accessToken, client}
    axiosInstance
        .delete(API_DELETE_USER_ROUTE, {
            headers: {
                'uid': authn.uid,
                'access-token': authn.accessToken,
                'client': authn.client,
            },
        })
        .then(function (res) {

            return {
                response: res,
            };
        })
        .catch(function (err) {
            console.log(err);
            return {error: err};
        });
};

/////////////////////////////////
/// updateUserPassword
///////////////////////////////
const updateUserPassword = async (authn, password, passwordConfirmation) => {
    const reqConfig = {
        url: API_PASSWORD_UPDATE_ROUTE,
        method: 'put',
        headers: reqAuthnToHeaders(authn),
        data: {
            password: password,
            password_confirmation: passwordConfirmation,
        },

        timeout: MAX_API_TIMEOUT,
    };

    return axios(reqConfig);

};

export {
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    deleteUserProfile,
    updateUserPassword,
    // deviseAuthnResRefresh,
};

//////////// TODOS TODO ///////////

// TODO: implement alternative f-e local, generic icon in case robohash cannot be accessed
// cloudflare failed to return robohash img
// 12:09:41.853 GEThttps://robohash.org/eaqueasperioresducimus.png?size=300x300&set=set1
// [HTTP/2 520 No Reason Phrase 69879ms]
