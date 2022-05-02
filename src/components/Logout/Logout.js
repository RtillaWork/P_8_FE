import React, {useEffect} from 'react';
import {Redirect, useHistory,} from 'react-router-dom';

export default function Logout({
                                   userAuthn,
                                   userProfile,
                                   setUserAuthn,
                                   setUserProfile,
                                   // setCoords,
                                   // setTasks,
                                   // setRadius,
                               }) {
    // setTasks(null);
    // setCoords(null);
    const history = useHistory();

    useEffect(() => {
        history.replace('/');
        window.location.reload();
        if (userAuthn?.accessToken != null) {
            setUserAuthn(null);
        }
        if (userProfile?.id != null) {
            setUserProfile(null);
        }
        // return ()=>{

        // }
    }, []);

    return (
        <>
            <h1>You have been logged out</h1>
            <Redirect to='/'/>
        </>
    );
}

/**
 *   {setTimeout(function () {
        return <Redirect to="/" />;
      }, 3000)}
 */
