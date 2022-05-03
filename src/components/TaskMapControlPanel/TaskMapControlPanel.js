// TaskMapControlPanel

import React, {useCallback, useEffect, useState,} from 'react';

const MAPCOORDS_AUTOUPDATE_TIMEOUT = 1500; // 1.5s
const PANELS_COUNT = 2;

export default function TaskMapControlPanel({
                                                aMap,
                                                aMapDefaultCenter,
                                                aMapCenter,
                                                aMapZoom,
                                                dosetUserCoords,
                                                dosetMapCoords,
                                            }) {
    const [position, setPosition] = useState(aMap.getCenter());

    const onClickaUpdateUserCoords = useCallback(() => {

        dosetUserCoords(position);
        // aMap.setView(aMapCenter, aMapZoom);
    }, [aMap, position]);

    const onClickDefaultCoords = useCallback(() => {
        aMap.setView(aMapDefaultCenter, aMapZoom);
    }, [aMap]);

    const onMove = useCallback(() => {
        setPosition(aMap.getCenter());
    }, [aMap]);

    useEffect(() => {
        aMap.on('move', onMove);

        return () => {
            aMap.off('move', onMove);
        };
    }, [aMap, onMove]);

    useEffect(() => {
        const userCoordsRefreshTimer = setTimeout(() => {

            dosetMapCoords(position);
        }, MAPCOORDS_AUTOUPDATE_TIMEOUT);

        return () => clearTimeout(userCoordsRefreshTimer);
    }, [position]);

    const [panelChoice, setPanelChoice] = useState(0);
    const handleOnPanelClick = (e) => {
        e.preventDefault();
        setPanelChoice((prev) => {
            return (prev + 1) % PANELS_COUNT;
        });
    };
    const panels = [null, null];
    panels[0] = (
        <>
            <div className='content'>
                <div>lat: {position.lat.toFixed(16)},</div>
                <div>
                    {' '}
                    lng:
                    {position.lng.toFixed(16)},
                </div>
                {' '}
                <div> zoom: {aMap.getZoom()}</div>
            </div>
        </>
    );

    panels[1] = (
        <>
            <button
                className='button is-light is-link is-small is-fullwidth'
                onClick={onClickaUpdateUserCoords}>
                Set app here
            </button>
            <button
                className='button is-light is-success is-small is-fullwidth'
                onClick={onClickDefaultCoords}>
                Go back Home
            </button>

        </>
    );

    return (
        <>

            <div className='' onClick={handleOnPanelClick}>
                {panels[1]}
            </div>
        </>
    );
}
