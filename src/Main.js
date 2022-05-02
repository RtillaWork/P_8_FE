import React, {useEffect, useState} from 'react';

import {Notification, UserAuthnContext, UserProfileContext,} from './AppPrelude';
import './Main.css';
import LoginSignup from './components/LoginSignup';
import SignupActivation from './components/SignupActivation';
import AppHeader from './components/AppHeader';

import App from './App';
import {geolocationOptions} from './services/geolocationSettings';
import {isAuthnObjectInvalid, isUserProfileObjectIncomplete,} from './services/apiServices';

const COORDS_DECIMALS = 16;

export default function Main() {
    // NOTE userCoords are the device coordinates
    const [userCoords, setUserCoords] = useState(null);
    const [deviceCoords, setDeviceCoords] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (okPos) => {
                setUserCoords({
                    lat: okPos.coords.latitude.toFixed(COORDS_DECIMALS),
                    lng: okPos.coords.longitude.toFixed(COORDS_DECIMALS),
                });
                setDeviceCoords({
                    lat: okPos.coords.latitude.toFixed(COORDS_DECIMALS),
                    lng: okPos.coords.longitude.toFixed(COORDS_DECIMALS),
                });

                console.log(
                    '### <MAIN> GET USERCURRENTCOORDS okPosition setUserCoords:, ',
                    okPos.coords.latitude,
                    '//',
                    okPos.coords.longitude
                );
            },
            (errPos) => console.log('### <MAIN> GET USERCOORDS ERROR: ', errPos),
            geolocationOptions
        );
    }, []);

    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        preferredName: '',
        avatar: '',
        address: '',
        govId: '',
        // allowPasswordChange: "",
        email: '',
        id: '',
        lastLoggedIn: '',
        lastActive: '',
        lat: '',
        lng: '',
        provider: '',
        uid: '',
    });

    const [userAuthn, setUserAuthn] = useState({
        accessToken: null,
        tokenType: null,
        client: null,
        expiry: null,
        uid: null,
        // id: null,
    });

    if (isAuthnObjectInvalid(userAuthn)) {
        /*
        setUserAuthn= { setUserAuthn };
        setUserProfile = { setUserProfile }; */
        return (
            <div className='box'>
                <UserProfileContext.Provider
                    value={{userProfile: userProfile, setUserProfile: setUserProfile}}>
                    <UserAuthnContext.Provider
                        value={{userAuthn: userAuthn, setUserAuthn: setUserAuthn}}>
                        <AppHeader/>

                        <LoginSignup
                            coords={userCoords}
                            userCoords={userCoords}
                            deviceCoords={deviceCoords}
                        />
                    </UserAuthnContext.Provider>
                </UserProfileContext.Provider>
            </div>
        );
    } else if (isUserProfileObjectIncomplete(userProfile)) {
        // console.log(
        //   '### <MAIN> isUserProfileObjectIncomplete(userAuthn)',
        //   userAuthn
        // );

        return (
            <div className='box'>
                <UserProfileContext.Provider
                    value={{userProfile: userProfile, setUserProfile: setUserProfile}}>
                    <UserAuthnContext.Provider
                        value={{userAuthn: userAuthn, setUserAuthn: setUserAuthn}}>
                        <AppHeader userAuthn={userAuthn} userProfile={userProfile}/>
                        <SignupActivation
                            userCoords={userCoords}
                            deviceCoords={deviceCoords}
                        />
                        ;
                    </UserAuthnContext.Provider>
                </UserProfileContext.Provider>
            </div>
        );
    } else {
        if (userCoords == null) {
            return (
                <div className='box'>
                    <Notification
                        type='Information'
                        message='Getting location position...'
                        delay='30000'
                    />
                </div>
            );
        } else {
            // console.log(
            //   '### FROM <MAIN> UserAuthn VALUE BEFORE <APP> renders: ',
            //   userAuthn,
            //   userProfile
            // );
            return (
                <div className='box'>
                    <UserProfileContext.Provider
                        value={{
                            userProfile: userProfile,
                            setUserProfile: setUserProfile,
                        }}>
                        <UserAuthnContext.Provider
                            value={{userAuthn: userAuthn, setUserAuthn: setUserAuthn}}>
                            <AppHeader userAuthn={userAuthn} userProfile={userProfile}/>

                            <App
                                userCoords={userCoords}
                                deviceCoords={deviceCoords}
                                setUserCoords={setUserCoords}
                                setDeviceCoords={setDeviceCoords}
                            />
                        </UserAuthnContext.Provider>
                    </UserProfileContext.Provider>
                </div>
            );
        }
    }
}
