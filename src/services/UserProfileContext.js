import React, {
  useState,
  useEffect,
  useContext,
  Context,
  createContext,
} from "react";

let UserProfileContext = createContext();
export default UserProfileContext;

/**
 * 

  const UserProfileContext = createContext({
    userProfile: {
      firstName: "",
      lastName: "",
      preferredName: "",
      avatar: "",
      address: "",
      govId: "",
      allowPasswordChange: "",
      email: "",
      id: "",
      defaultLat:"",
      defaultLng:"",
      lastLoggedIn: "",
      lastActive:"",
      provider: "",
      uid: "",
    },
    setUserProfile: setUserProfile,
  });
 * 
 * 
 * 
 *  <UserProfileContext.Provider value={userProfile}>
            <UserAuthnContext.Provider value={userAuthn}>

   </UserAuthnContext.Provider>
          </UserProfileContext.Provider>
 * 
 */

// import {getCurrentLocation} from './components/api/api';

// export default function UserProfileContext() {
//   let [userLoginDetails, setUserLoginDetails] = useState({
//     uid: "",
//     password: "",
//   });
//   let [signedInUser, setSignedInUser] = useState({
//     accessToken: null,
//     client: null,
//     uid: null,
//   });

//   let signedInUSerContext = createContext(signedInUser);
// }
