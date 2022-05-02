// Login page

import React, {useContext, useState} from 'react';
// import PropTypes from "prop-types";
import {useHistory} from 'react-router';
import './LoginSignup.css';

import {signIn, signUp} from '../../services/AuthnServices';

import {Notification, STATUS_ERROR, STATUS_READY, UserAuthnContext, UserProfileContext,} from '../../AppPrelude';

import {deviseAuthnFromRes, userProfileFromHttpRes,} from '../../services/apiServices';

export default function LoginSignUp({
                                        // setUserAuthn,
                                        // setUserProfile,
                                        coords,
                                        usercoords,
                                        deviceCoords,
                                        ...rest
                                    }) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const history = useHistory();

    const [status, setstatus] = useState({type: STATUS_READY, content: null});

    // initial state: isSignup: false
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleToggleSignUp = (e) => {
        e.preventDefault();
        if (!isSignUp) {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    };

    const handleFormChange = (e) => {
        e.preventDefault();
        setstatus(() => ({type: STATUS_READY, content: null}));

        switch (e.target.name) {
            case 'first_name': {
                setFirstName(e.target.value);
                break;
            }
            case 'last_name': {
                setLastName(e.target.value);
                break;
            }
            case 'email': {
                setEmail(e.target.value);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isSignUp) {
            setstatus(() => ({type: STATUS_READY, content: null}));

            signIn(email, password)
                .then((res) => {
                    if (res.status == 200) {
                        setUserProfile(userProfileFromHttpRes(res));
                        setUserAuthn(deviseAuthnFromRes(null, res));
                        history.push('/');
                    }
                })
                .catch((err) => {
                    setstatus(() => ({
                        type: STATUS_ERROR,
                        content: ['Invalid login or password'],
                    }));
                });
            // .finally(() => {
            //   history.push('/');
            // });
        } else {
            if (password == passwordConfirmation) {
                setstatus(() => ({type: STATUS_READY, content: null}));

                signUp(email, firstName, lastName, password, passwordConfirmation)
                    .then((res) => {
                        if (res.status == 200) {
                            setUserProfile(userProfileFromHttpRes(res));
                            setUserAuthn(deviseAuthnFromRes(null, res));
                            history.push('/');
                        }
                    })
                    .catch((err) => {
                        // console.log(
                        //   'LOGIN SIGNUP CATCH USERPROFILE DATA: ',
                        //   JSON.stringify(err.response.data.errors.full_messages)
                        //   // ,userProfileFromHttpRes(err)
                        // );
                        // // console.log(
                        // //   'LOGIN SIGNUP CATCH USERAUTHN DATA: ',
                        // //   deviseAuthnFromErr(null, err)
                        // // );

                        // history.push('/');

                        setstatus(() => ({
                            type: STATUS_ERROR,
                            content: err.response?.data?.errors ?? [
                                'Network Error during Signup',
                            ],
                        }));
                    })
                    .finally(() => {
                        history.push('/');
                    });
            }
        }
    };

    return (
        <section className='container'>
            <div className='columns'>
                <div className='column'>
                    {status.type === STATUS_ERROR ? (
                        <Notification
                            type={status.type}
                            message={status.content?.full_messages ?? ['Login error']}
                        />
                    ) : null}
                </div>
            </div>
            <div className='columns is-multiline'>
                <div className='column is-8 is-offset-2 register'>
                    <div className='columns'>
                        <div className='column left'>
                            <h1 className='title is-1'>Welcome to Mapp8</h1>
                            <h2 className='subtitle colored is-4'>
                                Your friendly neighbourhood volunteering app.
                            </h2>
                            <p>
                                This app helps connect people in need of material or immaterial
                                assistance and, on the other hand, local volunteers.
                            </p>
                        </div>
                        <div className='column right has-text-centered'>
                            <h1 className='title is-4'>Login or Sign up today!</h1>
                            <p className='description'>
                                Please enter your login credentials here. If you are a new user{' '}
                                <em>
                                    <a href='#' onClick={handleToggleSignUp}>
                                        Sign Up here
                                    </a>
                                </em>
                            </p>
                            <form onSubmit={handleSubmit}>
                                {
                                    // Displays firstName and LastName textfields for Signup case
                                    isSignUp ? (
                                        <>
                                            <div className='field'>
                                                <div className='control'>
                                                    <label>
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
                                                    <label>
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
                                        </>
                                    ) : null
                                }

                                <div className='field'>
                                    <div className='control'>
                                        <label>
                                            Email:
                                            {status.content?.email ? (
                                                <span className='tag is-warning'>
                          {status.content?.email?.join(', ')}
                        </span>
                                            ) : null}
                                            <input
                                                className='input is-medium'
                                                name='email'
                                                type='email'
                                                placeholder='Login email'
                                                value={email}
                                                onChange={handleFormChange}
                                            />
                                        </label>
                                    </div>
                                </div>
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

                                {
                                    // displays a second, passwordConfirmation for Signup case
                                    isSignUp ? (
                                        <div className='field'>
                                            <div className='control'>
                                                <label>
                                                    Password confirmation:
                                                    {password != 0 ? (
                                                        passwordConfirmation != password ? (
                                                            <span className='tag is-warning'>
                                Passwords do not match
                              </span>
                                                        ) : (
                                                            <span className='tag is-success'>
                                Passwords match
                              </span>
                                                        )
                                                    ) : null}
                                                    {status.content?.password_confirmation ? (
                                                        <span className='tag is-warning'>
                              {status.content?.password_confirmation?.join(
                                  ', '
                              )}
                            </span>
                                                    ) : null}
                                                    <input
                                                        className='input is-medium'
                                                        name='password_confirmation'
                                                        type='password'
                                                        placeholder='Password'
                                                        value={passwordConfirmation}
                                                        onChange={handleFormChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <em>Login</em>
                                    )
                                }
                                <button
                                    className='button is-block is-primary is-fullwidth is-medium'
                                    type='submit'>
                                    {isSignUp ? (
                                        <strong>Signup</strong>
                                    ) : (
                                        <em>Login or Signup</em>
                                    )}
                                </button>
                                <br/>
                                <small>
                                    <em>
                                        Note: This website uses geolocation features on your device.
                                    </em>
                                </small>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='column is-8 is-offset-2'>
                    <br/>
                    <nav className='level'>
                        <div className='level-left'>
                            <div className='level-item'>
                                {
                                    // TODO open source links here
                                }
                                <span className='icon'>
                  <i className='fas fa-envelope'></i>
                </span>
                                &emsp;
                            </div>
                        </div>
                        <div className='level-right'>
                            <small className='level-item'>By N.E for Project 8</small>
                        </div>
                    </nav>
                </div>
            </div>
        </section>
    );
}

// LoginOrSignUp.propTypes = {
//   setUserAuthn: PropTypes.func.isRequired,
//   setUserProfile: PropTypes.func.isRequired,
// };
