//

import React, {useMemo, useState,} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';

import {toLatLngArray,} from '../../services/geolocationServices';

import TaskMarkers from './TaskMarkers';
import TaskMapControlPanel from '../TaskMapControlPanel';

export default function TaskMapContainer({
                                             userProfile,
                                             tasks,
                                             selectedTask,
                                             zoom,
                                             userCoords,
                                             setUserCoords,
                                             setMapCoords,
                                             taskListType,
                                             ...restOFprops
                                         }) {
    const [map, setMap] = useState(null);
    const mapDefaultCenterCoords = [
        parseFloat(userProfile.lat),
        parseFloat(userProfile.lng),
    ];

    const displayMap = useMemo(
        () => (
            <MapContainer
                center={toLatLngArray(userCoords)}
                zoom={zoom}
                whenCreated={setMap}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <TaskMarkers tasks={tasks}/>
            </MapContainer>
        ),
        [userCoords.lat, userCoords.lng, zoom, tasks]
    );

    return (
        <>
            {displayMap}
            <footer className='footer'>
                {map ? (
                    <TaskMapControlPanel
                        aMap={map}
                        aMapDefaultCenter={mapDefaultCenterCoords}
                        aMapCenter={toLatLngArray(userCoords) ?? [mapDefaultCenterCoords]}
                        aMapZoom={zoom}
                        dosetUserCoords={(coords) => setUserCoords(coords)}
                        dosetMapCoords={(coords) => setMapCoords(coords)}
                    />
                ) : null}
            </footer>
        </>
    );
}
