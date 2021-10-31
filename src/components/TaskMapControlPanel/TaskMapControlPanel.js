// TaskMapControlPanel

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { MapContainer, MapConsumer, TileLayer } from 'react-leaflet';

import {
  MAP_REFRESH_DURATION,
  COORDS_REFRESH_SENSITIVITY,
  toLatLngArray,
  toLatLngObject,
} from '../../services/geolocationServices.js';
import {
  AppStateContext,
  UserProfileContext,
  TasksContext,
} from '../../AppPrelude';

import { getDistanceFromLatLngInm } from '../../services/appServices';

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
    // console.log(
    //   ' # FROM onClickaUpdateUserCoords :',
    //   typeof dosetUserCoords,
    //   'position: ',
    //   position
    // );
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
      // console.log(
      //   "CALLBACK HERE SetTimeout IN NOW!",
      //   {
      //     lat: position.lat,
      //     lng: position.lng,
      //   },
      //   JSON.stringify(userCoords),
      //   typeof updateCoordsCallback,
      //   updateCoordsCallback?.toString()
      // );
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
        </div>{' '}
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
      {
        // <button onClick={onClickDefaultCoords}>
        //   Go to the next closest request
        // </button>
        // <button onClick={onClickDefaultCoords}>Go to the oldest request</button>
        // <button onClick={onClickDefaultCoords}>Go to the newest request</button>
        // <button onClick={onClickDefaultCoords}>Pick a random request</button>
      }
    </>
  );

  return (
    <>
      {
        // <button
        //   className='button is-primary is-light is-small'
        //   onClick={handleOnPanelClick}>
        //   Switch panel
        // </button>
        // {panels[panelChoice]}
        //
        // <button
        //   className='button is-outligned is-light is-small is-fullwidth'
        //   onClick={handleOnPanelClick}>
        //   {panels[panelChoice]}
        // </button>
      }
      <div className='' onClick={handleOnPanelClick}>
        {panels[1]}
      </div>
    </>
  );
}

//  return (
//    <>
//      zoom: {aMap.getZoom()}, lat: {position.lat.toFixed(16)}, lng:
//      {position.lng.toFixed(16)}
//      <button onClick={onClickaUpdateUserCoords}>
//        Set user coordinates here
//      </button>
//      <button onClick={onClickDefaultCoords}>
//        Go to your default coordinates
//      </button>
//    </>
//  );
