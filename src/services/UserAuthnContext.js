import React, {createContext,} from "react";

let UserAuthnContext = createContext();
export default UserAuthnContext;

//  const UserAuthnContext = createContext({
//     userAuthn: {
//       accessToken: null,
//       // tokenType: null,
//       client: null,
//       expiry: null,
//       uid: null,
//       id: null,
//     },
//     setUserAuthn: setUserAuthn,
//   });
