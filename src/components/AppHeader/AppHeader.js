// Header
import {NavLink, useHistory,} from 'react-router-dom';
import {useContext} from 'react';
import {FaHome} from 'react-icons/fa';
import {signOut} from '../../services/AuthnServices';
import Avatar from '../Avatar';
import {UserAuthnContext, UserProfileContext,} from '../../AppPrelude';
import {isAuthnObjectInvalid, isUserProfileObjectIncomplete,} from '../../services/apiServices';

export default function AppHeader({userCoords, ...restOfProps}) {
    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const history = useHistory();

    const handleLogout = (e) => {
        // TODO: DELETE cokies, localStorage, clean after
        history.push('/');
        signOut(userAuthn).finally(() => {
            setUserAuthn(null);
            setUserProfile(null);
        });
    };

    const toggleBurgerMenu = () => {
        document.querySelector('.navbar-menu').classList.toggle('is-active');
        document.querySelector('.navbar-dropdown').classList.toggle('is-hidden');
        document
            .querySelector('.navbar-dropdown-end')
            .classList.toggle('is-hidden');
    };

    const toggleDropDownMenu = () => {
        document.querySelector('.navbar-dropdown').classList.toggle('is-hidden');
    };

    const toggleDropDownEndMenu = () => {
        document
            .querySelector('.navbar-dropdown-end')
            .classList.toggle('is-hidden');
    };

    if (isAuthnObjectInvalid(userAuthn)) {
        return (
            <nav className='navbar' role='navigation' aria-label='main navigation'>
                <div className='navbar-brand'>
                    <NavLink to='/' className='navbar-item'>
                        <FaHome/>
                        <span>Welcome to Mapp8!</span>
                    </NavLink>

                    <div
                        role='button'
                        className='navbar-burger burger'
                        aria-label='menu'
                        aria-expanded='false'
                        data-target='navbarBurger'>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                    </div>
                </div>

                <div id='navbarBurger' className='navbar-menu'>
                    <div className='navbar-start'></div>

                    <div className='navbar-end'>
                        <div className='navbar-item'></div>
                    </div>
                </div>
            </nav>
        );
    } else if (isUserProfileObjectIncomplete(userProfile)) {
        return (
            <nav className='navbar' role='navigation' aria-label='main navigation'>
                <div className='navbar-brand'>
                    <p to='/' className='navbar-item'>
                        <FaHome/>
                        <span></span>
                    </p>

                    <div
                        role='button'
                        className='navbar-burger burger'
                        aria-label='menu'
                        aria-expanded='false'
                        data-target='navbarBurger'
                        onClick={toggleBurgerMenu}>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                    </div>
                </div>

                <div id='navbarBurger' className='navbar-menu'>
                    <div className='navbar-start'>
                        <div className='navbar-item '>
                            <strong className='button is-warning'>
                                Please Finish Your Registration to Continue
                            </strong>
                        </div>
                    </div>

                    <div className='navbar-end'>
                        <div className='navbar-item '>
                            <div className='buttons'>
                                <NavLink
                                    to='/signout'
                                    className='button is-info navbar-item'
                                    onClick={handleLogout}>
                                    <strong>Logout and Finish Later</strong>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className='navbar-dropdown-end navbar-dropdown'></div>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className='navbar' role='navigation' aria-label='main navigation'>
                <div className='navbar-brand'>
                    <NavLink to='/' className='navbar-item'>
                        <FaHome/>
                    </NavLink>
                    <div className='navbar-item '>
                        <NavLink
                            to='/profile/settings'
                            className='button is-light'
                            onClick={toggleBurgerMenu}>
                            <strong>Hello, {userProfile?.preferredName}</strong>
                            <Avatar
                                avatarUrl={userProfile?.avatar}
                                size='small'
                                description='Logo'
                            />
                        </NavLink>
                    </div>

                    <div
                        role='button'
                        className='navbar-burger burger'
                        aria-label='menu'
                        aria-expanded='false'
                        data-target='navbarBurger'
                        onClick={toggleBurgerMenu}>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                    </div>
                </div>

                <div id='navbarBurger' className='navbar-menu'>
                    <div className='navbar-start'>
                        <div className='navbar-item has-dropdown is-hoverable'>
                            <div className='navbar-link' onClick={toggleDropDownMenu}>
                                Requests
                            </div>

                            <div className='navbar-dropdown'>
                                <NavLink
                                    to='/request'
                                    className='navbar-item'
                                    onClick={toggleBurgerMenu}>
                                    <strong>New Request</strong>
                                </NavLink>
                                <NavLink
                                    to='/requests/all'
                                    className='navbar-item'
                                    onClick={toggleBurgerMenu}>
                                    <strong>All Requests</strong>
                                </NavLink>

                                <hr className='navbar-divider'/>
                            </div>
                        </div>
                    </div>

                    <div className='navbar-end'>
                        <div className='navbar-item has-dropdown is-hoverable '>
                            <div
                                className='navbar-link is-light'
                                onClick={toggleDropDownEndMenu}>
                                <strong>My Profile</strong>
                            </div>

                            <div className='navbar-dropdown-end navbar-dropdown'>
                                <div className='navbar-item'>
                                    <NavLink
                                        to='/profile/settings'
                                        className='navbar-item is-light'
                                        onClick={toggleBurgerMenu}>
                                        <strong>{userProfile?.preferredName}</strong> ( Your email:
                                        <em>{userProfile?.email}</em>)
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink
                                        to='/profile/requests'
                                        className='navbar-item is-light'
                                        onClick={toggleBurgerMenu}>
                                        My Requests
                                    </NavLink>
                                </div>
                                <div className='navbar-item'>
                                    <NavLink
                                        to='/profile/conversations'
                                        className='navbar-item  is-light'
                                        onClick={toggleBurgerMenu}>
                                        My Conversations
                                    </NavLink>
                                </div>
                                <hr className='navbar-divider'/>
                                <div className='navbar-item'>
                                    <NavLink
                                        to='/profile/settings'
                                        className='navbar-item  is-light'
                                        onClick={toggleBurgerMenu}>
                                        <strong>My Settings</strong>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className='navbar-item'>
                            <NavLink
                                to='/request'
                                className='navbar-item button is-primary'
                                onClick={toggleBurgerMenu}>
                                <strong>New Request</strong>
                            </NavLink>
                        </div>
                        <div className='navbar-item'>
                            <NavLink
                                to='/signout'
                                className='navbar-item button is-warning'
                                onClick={handleLogout}>
                                <strong>Logout</strong>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
