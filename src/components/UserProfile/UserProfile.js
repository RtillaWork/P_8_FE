// Profile
import React, {useContext, useState} from 'react';
import {Redirect, useHistory,} from 'react-router-dom';
import {GrLocation, GrMapLocation} from 'react-icons/gr';

// import { DirectUpload } from "activestorage";
import {uploadGovId} from '../../services/ActiveStorageServices';
import {
    buildMyRobohashUrl,
    deviseAuthnFromErr,
    deviseAuthnFromRes,
    statusFromHttpResOrErr,
    userProfileFromHttpRes
} from '../../services/apiServices';

import Avatar from '../Avatar';
import avatarImageFailback from './avatar_failback.png';
import {Notification, STATUS_ERROR, STATUS_READY, UserAuthnContext, UserProfileContext,} from '../../AppPrelude';

import './UserProfile.css';

import {deleteUserProfile, signOut, updateUserPassword, updateUserProfile,} from '../../services/AuthnServices';

export default function UserProfile({
                                        radius,
                                        // coords,
                                        mapCoords,
                                        // tasks,
                                        setRadius,
                                        userCoords,
                                        debug = false,
                                        ...restOfProps
                                    }) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const history = useHistory();
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    const email = userProfile.email; // is linked to use authentication, cannot be changed
    const [firstName, setFirstName] = useState(
        userProfile.firstName ?? 'FIRST NAME IS REQUIRED'
    );
    const [lastName, setLastName] = useState(
        userProfile.lastName ?? 'LAST NAME IS REQUIRED'
    );
    const [preferredName, setPreferredName] = useState(
        userProfile.preferredName ?? userProfile.firstName
    );
    const [isPreferredNameHidden, setIsPreferredNameHidden] = useState(false);
    // if (
    //   preferredName == null ||
    //   preferredName == undefined ||
    //   preferredName == ""
    // ) {
    //   setPreferredName(firstName);
    // }

    const [avatar, setAvatar] = useState(userProfile.avatar ?? '');
    const [address, setAddress] = useState(userProfile.address ?? '');

    // NOTE GovId is required upon signup, so it can be updated but cannot be empty in UserProfile
    const [govId, setGovId] = useState(userProfile.govId ?? '');
    // if (govId == null || govId == undefined || govId == '') {
    //   return <Redirect to='/' />;
    // }
    const [govIdDocument, setGovIdDocument] = useState(undefined);
    // if (govId == null || govId == undefined) {
    //   setGovId("");
    // }

    const [defaultLat, setdefaultLat] = useState(
        userProfile.lat ?? mapCoords?.lat // ?? APP_DEFAULT_LAT
    );
    const [defaultLng, setdefaultLng] = useState(
        userProfile.lng ?? mapCoords?.lng // ?? APP_DEFAULT_LNG
    );
    // TODO: add location icon to fill in current location

    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleToggleIsPasswordUpdating = (e) => {
        e.preventDefault();
        if (!isPasswordUpdating) {
            setIsPasswordUpdating(true);
        } else {
            setIsPasswordUpdating(false);
        }
    };

    const handleFormChange = (e) => {
        e.preventDefault();
        setstatus({type: STATUS_READY, content: null});

        switch (e.target.name) {
            case 'first_name': {
                setFirstName(e.target.value);
                // if (preferredName == '') {
                setPreferredName(e.target.value);
                // }
                break;
            }
            case 'last_name': {
                setLastName(e.target.value);
                break;
            }
            case 'preferred_name': {
                setAvatar(buildMyRobohashUrl(e.target.value));
                setPreferredName(e.target.value);
                break;
            }
            case 'address': {
                setAddress(e.target.value);
                break;
            }
            case 'default_lat': {
                setdefaultLat(e.target.value);
                break;
            }
            case 'default_lng': {
                setdefaultLng(e.target.value);
                break;
            }
            case 'password': {
                setPassword(e.target.value);
                break;
            }
            case 'password_confirmation': {
                setPasswordConfirmation(e.target.value);
                break;
            }
            default:
                break;
        }
    };


    const handleGovIdChange = (e) => {
        e.preventDefault();


        // Update the blob now with the back-end and get the back end created blob data...
        // ... then update govId with an image url value
        console.log(
            'isUpdating true: gov_id_document files[0] value: ',
            govIdDocument
        );
        // const uploadedBlob =
        uploadGovId(govIdDocument, setGovId);
        console.log('AFTER upload govId : govId url value: ', govId);
        // uploadGovId(govIdDocument);
        //// NOTE must have finished updating govId with new blob image url before moving to update userProfile
    };

    const handleGovIdDocumentChange = (e) => {
        e.preventDefault();
        console.log(
            'handleGovIdDocumentChange gov_id_document e.target.files[0]: ',
            e.target.files[0]
        );
        setGovIdDocument(e.target.files[0]);
    };

    const handleUseMapCoords = (e) => {
        e.preventDefault();
        // TODO FOR LATER USE
        setdefaultLat(mapCoords.lat);
        setdefaultLng(mapCoords.lng);
    };
    const handleUseAppCoords = (e) => {
        e.preventDefault();
        // TODO FOR LATER USE
        setdefaultLat(userCoords.lat);
        setdefaultLng(userCoords.lng);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isPasswordUpdating) {
            updateUserPassword(userAuthn, password, passwordConfirmation)
                .then((res) => {
                    console.log(
                        '### FROM <USERPROFILE> Update User Profile THEN Response: ',
                        res
                    );

                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    // setUserProfile(userProfileFromHttpRes(res));
                    setstatus(statusFromHttpResOrErr(res));
                    history.push('/'); // commented out as suspect it causes 401 unauthorized after redirect to main
                })
                .catch((err) => {


                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data.errors,
                    });
                });
        } else {
            console.log(
                '#isUpdating: this is to check if govId value is in sync: ',
                govId
            );
            // setAvatar(buildMyRobohashUrl(firstName));

            updateUserProfile(
                userAuthn,
                firstName,
                lastName,
                preferredName,
                avatar,
                address,
                defaultLat,
                defaultLng,
                govId
            )
                .then((res) => {
                    console.log(
                        '### FROM <USERPROFILE> Update User Profile THEN Response: ',
                        res
                    );

                    setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                    setUserProfile(userProfileFromHttpRes(res));

                    console.log(
                        '### FROM <USERPROFILE> setUserAuthn VALUE at the end of THEN: ',
                        userAuthn
                    );

                    history.push('/');
                })
                .catch((err) => {

                    setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                    setstatus({
                        type: STATUS_ERROR,
                        content: err.response.data.errors,
                    });
                });

        }
    };

    const handleDeleteUserProfile = (e) => {
        e.preventDefault();

        // Confirm with user for account deletion

        // <Redirect to="/app"></Redirect>;

        // if (isUpdating) {
        deleteUserProfile(userAuthn)
            .then((response) => {
                console.log('### FROM <PROFILE> User Delete: ', response);
                if (response?.headers['status'] == 200) {
                    signOut(userAuthn);

                    return <Redirect to='/logout'/>;
                } else {
                    console.log('ERROR DELETING USER PROFILE');
                }
            })
            .catch((err) => {
                console.log(
                    'DEBUG PROFILE deleteUserProfile in USERPROFILE ERROR: ',
                    err.response.headers,
                    err.response.data,
                    JSON.stringify(err.response)
                );
                setUserAuthn(deviseAuthnFromErr(userAuthn, err.response));
                setstatus({
                    type: STATUS_ERROR,
                    content: err.response.data.errors,
                });
            });

    };
    // if (govId == null || govId == undefined || govId == '') {
    //   return <Redirect to='/' />;
    // } else {
    return (
        <section className='container'>
            {status.status == STATUS_ERROR ? (
                <Notification type='Errors' message={status.message}/>
            ) : null}
            <div className='columns is-multiline'>
                <div className='column left has-text-centered'>
                    <h1 className='title is-4'>My Profile</h1>
                    <div className='description'>
                        <div>
                            <strong className='subtitle is-2'>Profile Update.</strong>
                        </div>
                    </div>
                    <div className='field'>
                        {' '}
                        <strong>Email:</strong>
                        <div className='title is-4'>{email}</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='field'>
                            <div className='columns is-hcentered'>
                                <div className='column'>
                                    <div className='control'>
                                        <Avatar
                                            avatarUrl={avatar ?? avatarImageFailback}
                                            description={avatar}
                                            size='medium'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    First Name:
                                    {status.content?.first_name ? (
                                        <span className='tag is-warning'>
                      {status.content?.first_name?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='first_name'
                                        type='text'
                                        placeholder='firstName'
                                        value={firstName}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    Last Name:
                                    {status.content?.last_name ? (
                                        <span className='tag is-warning'>
                      {status.content?.last_name?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='last_name'
                                        type='text'
                                        placeholder='lastName'
                                        value={lastName}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    Preferred Name (will also change your avatar):
                                    {status.content?.preferred_name ? (
                                        <span className='tag is-warning'>
                      {status.content?.preferred_name?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='preferred_name'
                                        type='text'
                                        placeholder='If left blank, will be your First Name. Changing your preferred name will change your avatar'
                                        value={preferredName}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control'>
                                <label className='subtitle is-4'>
                                    Address:
                                    {status.content?.address ? (
                                        <span className='tag is-warning'>
                      {status.content?.address?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='address'
                                        type='text'
                                        placeholder='address'
                                        value={address}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>


                        <div className='field'>
                            <div className='control'>
                                <div className='columns'>
                                    <div className='column'>
                                        <label className='subtitle is-6'>
                                            Default Latitude:
                                            {status.content?.default_lat ? (
                                                <span className='tag is-warning'>
                          {status.content?.default_lat?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-small'
                                                name='default_lat'
                                                type='text'
                                                placeholder='0.1'
                                                value={defaultLat}
                                                onChange={handleFormChange}
                                            />
                                        </label>

                                        <label className='subtitle is-6'>
                                            Default Longitude:
                                            {status.content?.default_lng ? (
                                                <span className='tag is-warning'>
                          {status.content?.default_lng?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-small'
                                                name='default_lng'
                                                type='text'
                                                placeholder='0.1'
                                                value={defaultLng}
                                                onChange={handleFormChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='columns'>
                                    <div className='column'>
                                        <button
                                            className=''
                                            name='user_app_coords'
                                            type='button'
                                            onClick={handleUseAppCoords}>
                                            App coordinates <GrLocation/>
                                        </button>
                                        <button
                                            className=''
                                            name='user_map_coords'
                                            type='button'
                                            onClick={handleUseMapCoords}>
                                            Map coordinates <GrMapLocation/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='field'>

                            {govId == '' ? (
                                <strong>
                                    A Governement Id is required to keep using the service (pdf,
                                    jpg or png formats)
                                    {status.content?.gov_id ? (
                                        <span className='tag is-warning'>
                      {status.content?.gov_id?.join(', ')}
                    </span>
                                    ) : null}
                                </strong>
                            ) : (
                                <a href={govId} target='_blank'>
                                    Open or download your Governement ID document
                                </a>
                            )}
                        </div>


                        <div className='column center has-text-centered'>
                            <div className='description'>
                                <div>
                                    <button
                                        className='button is-warning is-fullwidth'
                                        onClick={handleToggleIsPasswordUpdating}>
                                        <strong>Change my password</strong>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            // displays a second, passwordConfirmation for password update case
                            isPasswordUpdating ? (
                                <>
                                    <div className='field'>
                                        <div className='control'>
                                            <label>
                                                Password:
                                                {status.content?.password ? (
                                                    <span className='tag is-warning'>
                            {status.content?.password?.join(', ')}
                          </span>
                                                ) : null}
                                                <input
                                                    className='input is-medium'
                                                    name='password'
                                                    type='password'
                                                    placeholder='Password'
                                                    value={password}
                                                    onChange={handleFormChange}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className='field'>
                                        <div className='control'>
                                            <label>
                                                Password confirmation:
                                                {status.content?.password_confirmation ? (
                                                    <span className='tag is-warning'>
                            {status.content?.password_confirmation?.join(', ')}
                          </span>
                                                ) : null}
                                                <input
                                                    className='input is-medium'
                                                    name='password_confirmation'
                                                    type='password'
                                                    placeholder='Same Password Again'
                                                    value={passwordConfirmation}
                                                    onChange={handleFormChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </>
                            ) : null
                        }
                        {isPasswordUpdating ? (
                            <button
                                className='button is-block is-primary is-fullwidth is-medium'
                                type='submit'>
                                <em>Update Password</em>
                            </button>
                        ) : (
                            <button
                                className='button is-block is-primary is-fullwidth is-medium'
                                type='submit'>
                                <em>Update My Profile</em>
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className='column right has-text-centered'>
                <div className='description'>
                    <div>
                        <em>
                            <button
                                className='button is-danger'
                                onClick={handleDeleteUserProfile}>
                                <strong>Delete my Account</strong>
                            </button>
                        </em>{' '}
                    </div>
                </div>
            </div>
        </section>
    );

}
