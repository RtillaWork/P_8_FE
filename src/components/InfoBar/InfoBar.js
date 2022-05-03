// InfoBar
// Should use a Bulma level, stay level on mobile is-mobile modifier
// https://leafletjs.com/reference-1.7.1.html#map-event

import {useContext, useEffect, useState} from 'react';
// import AppStateContext from "../../services/AppStateContext";
import {
    ConversationsContext,
    MapContext,
    MAX_RADIUS,
    MIN_RADIUS,
    TasksContext,
    UserAuthnContext,
    UserProfileContext,
} from '../../AppPrelude';
// {
// taskCount,
// conversationCount,
// tasksUpdateTracker,
// loggedUsersCount,
// ...restOfProps
// }

export default function InfoBar(props) {
    const {
        openTasks = props.openTasks,
        profileTasks = props.profileTasks,
        // conversations = props.conversations,
        triggerTasks = props.triggerTasks,
        triggerProfileTasks = props.triggerProfileTasks,
        // triggerConversations = props.triggerConversations,
        taskStats,
    } = useContext(TasksContext);
    const {
        deviceCoords = props.deviceCoords,
        userCoords = props.userCoords,
        mapCoords = props.mapCoords,
        coords = props.coords,
        userRadius = props.userRadius,
        // triggerOutOfRadius = props.triggerOutOfRadius,
        // triggerConversations = props.triggerConversations,
        setUserCoords = props.setUserCoords,
        setMapCoords = props.setMapCoords,
        setDeviceCoords = props.setDeviceCoords,
        setCoords = props.setCoords,
        setUserRadius = props.setUserRadius,
    } = useContext(MapContext);

    const {userAuthn, setUserAuthn} = useContext(UserAuthnContext);
    const {userProfile, setUserProfile} = useContext(UserProfileContext);
    const {conversations} = useContext(ConversationsContext);

    const INFOBAR_PANELS_COUNT = 4;
    const PANEL_SLIDER = 2;
    let panel = [];
    const [infoBarPanel, setInfoBarPanel] = useState(0);
    const [persistPanel, setPersistPanel] = useState(null);
    const handleOnPanelClick = (e) => {
        e.preventDefault();
        if (persistPanel != null) {
            setInfoBarPanel(persistPanel);
            setPersistPanel(null);
        } else {
            setInfoBarPanel((prev) => {
                return (prev + 1) % INFOBAR_PANELS_COUNT;
            });
        }
    };

    const [slider, setSlider] = useState(3);
    // const [slider, setSlider] = useState(Math.floor(userRadius / MAX_RADIUS));
    // const [sliderRadius, setSliderRadius] = useState(MIN_RADIUS);
    const [sliderRadius, setSliderRadius] = useState(userRadius);

    const handleSlider = (e) => {
        e.preventDefault();
        // e.cancelBubble = true;
        // e.stopPropagation();
        // e.stopImmediatePropagation();
        const value = parseInt(e.target.value); // linear and percent
        setPersistPanel(PANEL_SLIDER); // PANEL_SLIDER = 2 panel[2] is slider panel associated with this callback
        setSlider(value);

        if (slider > 0 && slider < 2) {
            // sliderRadius = MIN_RADIUS;
            setSliderRadius(MIN_RADIUS);
        } else if (slider >= 2 && slider < 80.0) {
            // sliderRadius = (slider * 50000.0) / 60.0 + MIN_RADIUS;
            setSliderRadius(Math.floor((slider * 50000.0) / 80.0 + MIN_RADIUS));
        } else if (slider >= 80.0 && slider < 90.0) {
            // sliderRadius = ((slider - 60.0) * 500000.0) / 30.0 + MIN_RADIUS;
            setSliderRadius(
                Math.floor(((slider - 80.0) * 100000.0) / 10.0 + MIN_RADIUS)
            );
        } else if (slider >= 90.0 && slider < 99) {
            // sliderRadius = ((slider - 90.0) * 5000000.0) / 10.0 + MIN_RADIUS;
            setSliderRadius(
                Math.floor(((slider - 90.0) * 1000000.0) / 10.0 + MIN_RADIUS)
            );
        } else {
            // sliderRadius = MAX_RADIUS;
            setSliderRadius(MAX_RADIUS);
        }
        // TODO or maybe just use Math.log()?
    };

    useEffect(() => {


        const timerForsliderRadius = setTimeout(() => {
            setUserRadius(sliderRadius);
        }, 1000);

        return () => {
            clearTimeout(timerForsliderRadius);
        };
    }, [sliderRadius]);

    panel[0] = (
        <div className='columns is-centered'>
            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Unfullfilled Total Requests</p>
                    <p className='title'>{taskStats?.stats?.unfullfilled_task_count}</p>
                </div>
            </div>
        </div>
    );

    panel[1] = (
        <div className='columns is-centered'>
            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Total Requests</p>
                    <p className='title'>{taskStats?.stats?.total_task_count}</p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Your Requests total</p>
                    <p className='title'>{profileTasks.size}</p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Your Conversations</p>
                    <p className='title'>{conversations?.size}</p>
                </div>
            </div>
        </div>
    );

    panel[2] = (
        <div className='columns is-centered'>
            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Open Local Requests</p>
                    <p className='title'>{openTasks.size} </p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Radius</p>
                    <p className=''>
                        User: {userRadius} m, Slider: {sliderRadius} m
                    </p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Change Radius</p>
                    <p className='title'>
                        <input
                            className='slider is-fullwidth is-large is-danger is-circle'
                            step='0.5'
                            min='0'
                            max='100'
                            value={slider}
                            onChange={handleSlider}
                            type='range'
                        />
                    </p>
                </div>
            </div>
        </div>
    );

    panel[3] = (
        <div className='columns is-centered'>
            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Device is at</p>
                    <p className=''>
                        {deviceCoords?.lat} lat, {deviceCoords?.lng} lng
                    </p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Profile defaults are</p>
                    <p className=''>
                        {userProfile?.lat} lat, {userProfile?.lng} lng
                    </p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>App is</p>
                    <p className=''>
                        {userCoords?.lat} lat, {userCoords?.lng} lng
                    </p>
                </div>
            </div>
            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>Map center is at</p>
                    <p className=''>
                        {mapCoords?.lat} lat, {mapCoords?.lng} lng
                    </p>
                </div>
            </div>

            <div className='level-item has-text-centered column'>
                <div>
                    <p className='heading'>user radius</p>
                    <p className=''>{userRadius}</p>
                </div>
            </div>
        </div>
    );


    return (
        <div className='box' onClick={handleOnPanelClick}>
            {panel[infoBarPanel]}
        </div>
    );

}
