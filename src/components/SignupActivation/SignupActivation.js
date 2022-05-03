// Profile
import React, {useContext, useState} from 'react';
import {useHistory,} from 'react-router-dom';
// import { DirectUpload } from "activestorage";
import {uploadGovId} from '../../services/ActiveStorageServices';
import {
    buildMyRobohashUrl,
    deviseAuthnFromErr,
    deviseAuthnFromRes,
    userProfileFromHttpRes
} from '../../services/apiServices';

import Avatar from '../Avatar';
import {
    JPEG_REGEX_PATTERN,
    JPG_REGEX_PATTERN,
    PDF_REGEX_PATTERN,
    PNG_REGEX_PATTERN,
    STATUS_ERROR,
    STATUS_READY,
    UserAuthnContext,
    UserProfileContext,
} from '../../AppPrelude';
import avatarImageFailback from './avatar_failback.png';

import './SignupActivation.css';

import {updateUserProfile,} from '../../services/AuthnServices';
import {APP_DEFAULT_LAT, APP_DEFAULT_LNG} from '../../services/appServices';

export default function SignupActivation({userCoords, ...restOfProps}) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const history = useHistory();
    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    // const [email, setEmail] = useState(userProfile.email);
    const email = userProfile.email;
    // initial state: isUpdated: false
    // const [isUpdating, setIsUpdating] = useState(false);
    // const [isUpdating, setIsUpdating] = useState(!readOnly);
    // const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [firstName, setFirstName] = useState(userProfile.firstName);
    const [lastName, setLastName] = useState(userProfile.lastName);

    // const firstName = userProfile.firstName;
    // const lastName = userProfile.lastName;

    const [preferredName, setPreferredName] = useState(
        userProfile.firstName ?? ''
    );
    const [isPreferredNameHidden, setIsPreferredNameHidden] = useState(false);

    const [avatar, setAvatar] = useState(userProfile.avatar ?? undefined);

    const [address, setAddress] = useState(userProfile.address ?? '');

    const [govId, setGovId] = useState(userProfile.govId);
    if (govId == null || govId == undefined) {
        setGovId('');
    }
    const [govIdDocument, setGovIdDocument] = useState(undefined);
    // if (govId == null || govId == undefined) {
    //   setGovId("");
    // }

    const [defaultLat, setdefaultLat] = useState(
        userCoords?.lat ?? APP_DEFAULT_LAT
    );
    const [defaultLng, setdefaultLng] = useState(
        userCoords?.lng ?? APP_DEFAULT_LNG
    );
    // TODO: add location icon to fill in current location

    const handleFormChange = (e) => {
        e.preventDefault();
        setstatus(() => ({type: STATUS_READY, content: null}));


        switch (e.target.name) {
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
            case 'gov_id_document': {
                console.log(
                    'handleGovIdDocumentChange gov_id_document e.target.files[0]: ',
                    e.target.files[0]
                );
                if (
                    e.target.files[0].name.search(PNG_REGEX_PATTERN) < 0 &&
                    e.target.files[0].name.search(JPG_REGEX_PATTERN) < 0 &&
                    e.target.files[0].name.search(JPEG_REGEX_PATTERN) < 0 &&
                    e.target.files[0].name.search(PDF_REGEX_PATTERN) < 0
                ) {
                    //  doesn't match the Regex
                    setstatus(() => ({
                        type: STATUS_ERROR,
                        content: {
                            gov_id: ['Government ID must be in PDF, JPG or PNG formats'],
                        },
                    }));
                } else {
                    // updateUserProfile
                    setGovIdDocument(e.target.files[0]);
                }
                break;
            }

            default:
                break;
        }
    };

    // const handleAvatarChange = (e) => {
    //   e.preventDefault();
    //   console.log(e.target.value);
    //   const avtr = buildMyRobohashUrl(preferredName);
    //   console.log(avtr);
    //   setAvatar(avtr);
    // };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

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


                setUserAuthn(deviseAuthnFromRes(userAuthn, res));
                setUserProfile(userProfileFromHttpRes(res));

                // history.push('/'); // commented out as suspect it causes 401 unauthorized after redirect to main
            })
            .catch((err) => {


                setUserAuthn(deviseAuthnFromErr(userAuthn, err));
                // setstatus(statusFromHttpResOrErr(err));
                setstatus(() => ({
                    type: STATUS_ERROR,
                    content: err.response?.data?.errors ?? {
                        SignupActivation: ['Signup Activation Error'],
                    },
                }));
            });
        // .catch((err) =>
        //   console.log('updateUserProfile in <SIGNUPACTIVATION> error: ', err)
        // );
    };

    return (
        <section className='container'>
            <div className='columns is-multiline'>
                <div className='column left has-text-centered'>
                    <h1 className='title is-1'>Signup (2/2)</h1>
                    <div className='description'>
                        <div>
                            <strong className='subtitle is-2'>Profile data</strong>
                        </div>
                    </div>
                    <div className='columns is-multiline'>
                        <div className='column left has-text-centered'>
                            <div className=''>
                                <div className='title is-4'>
                                    Email:
                                    <div>{email}</div>
                                </div>
                            </div>
                        </div>
                        <div className='column right has-text-centered'>
                            <div className='field'>
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

                    <div className='columns is-multiline'>
                        <div className='column left has-text-centered'>
                            <div className=''>
                                <div className='title is-4'>
                                    First Name:
                                    <div>{firstName}</div>
                                </div>
                            </div>
                        </div>

                        <div className='column right has-text-centered'>
                            <div className=''>
                                <div className='title is-4'>
                                    Last Name:
                                    <div>{lastName}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='field'>
                            <div className='control'>
                                <label className='title is-4'>
                                    Preferred Name:
                                    {status.content?.preferred_name ? (
                                        <span className='tag is-warning'>
                      {status.content?.preferred_name?.join(', ')}
                    </span>
                                    ) : null}
                                    <input
                                        className='input is-medium'
                                        name='preferred_name'
                                        type='text'
                                        placeholder='If left blank, will be your First Name'
                                        value={preferredName}
                                        onChange={handleFormChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='field'>
                            <div className='control'>
                                <label className='title is-4'>
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
                            <div className='columns'>
                                <div className='column left'>
                                    <div className='control'>
                                        <label className='title is-4'>
                                            Your default Latitude:
                                            {status.content?.default_lat ? (
                                                <span className='tag is-warning'>
                          {status.content?.default_lat?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-medium'
                                                name='default_lat'
                                                type='text'
                                                placeholder='0.1'
                                                value={defaultLat}
                                                onChange={handleFormChange}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className='column right'>
                                    <div className='control'>
                                        <label className='title is-4'>
                                            Your default Longitude:
                                            {status.content?.default_lng ? (
                                                <span className='tag is-warning'>
                          {status.content?.default_lng?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-medium'
                                                name='default_lng'
                                                type='text'
                                                placeholder='0.1'
                                                value={defaultLng}
                                                onChange={handleFormChange}
                                            />
                                        </label>
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
                            ) : !govIdDocument ? (
                                <img
                                    src={
                                        userProfile?.govId || userProfile?.govId != ''
                                            ? userProfile.govId
                                            : govId
                                    }
                                    alt='Governement ID document'
                                />
                            ) : govIdDocument.name.search(PDF_REGEX_PATTERN) < 0 ? (
                                <img
                                    src={URL.createObjectURL(govIdDocument)}
                                    alt='Your uploaded Governement ID document'
                                />
                            ) : (
                                <strong> pdf document attached</strong>
                            )}
                        </div>

                        <div className='field'>
                            <div className='control'>
                                {!govIdDocument ? (
                                    <label>
                                        Select your Governement Id Document:
                                        {status.content?.gov_id_document ? (
                                            <span className='tag is-warning'>
                        {status.content?.gov_id_document?.join(', ')}
                      </span>
                                        ) : null}
                                        <input
                                            className='input is-medium'
                                            name='gov_id_document'
                                            accept='application/pdf, image/jpeg, image/png'
                                            type='file'
                                            value={govId}
                                            placeholder='Please select your government id here'
                                            // value={govIdDocument}
                                            onChange={handleFormChange}
                                        />
                                    </label>
                                ) : (
                                    <label>
                                        Attach your Governement Id Document:
                                        <button
                                            className='button is-block is-medium'
                                            onClick={handleGovIdChange}>
                                            <strong>Click to Attach your government id</strong>
                                        </button>
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            className='button is-block is-primary is-fullwidth is-medium'
                            type='submit'>
                            <em>Finish My registration</em>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
