// // TODO: compute map radius based on current center map position, the zoom level and view small size
// // TODO: report the map radius and current center map position to reload just the tasks within the radius
// // TODO: order tasks by distance from current center map position

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { MapContainer, MapConsumer, TileLayer } from 'react-leaflet';
// // import { Icon } from "leaflet";
// // import "../../services/MapServices";
// // import { getCurrentZoom } from "../../services/AppServices";

// import TaskMarkers from '../TaskMarkers';
// // import { getCurrentCoords } from "../../services/MapServices";
// // import {BrowserRouter, Switch, Route, Link, useParams} from 'react-router-dom';

// export default function TaskMap({
//   radius,
//   coords,
//   tasks,
//   setCoords,
//   ...restOfProps
// }) {
//   const [position, setPosition] = useState(null);

//   const onMove = useCallback(() => {
//     map ? setPosition(map.getCenter()) : setPosition([coords.lat, coords.lng]);
//   }, [map]);

//   useEffect(() => {
//     map.on('move', onMove);
//     return () => {
//       map.off('move', onMove);
//     };
//   }, [map, onMove]);
//   return (
//     // prop whencreated has parameter map to add event lsitener to the map

//     <MapContainer
//       center={[coords.lat, coords.lng]}
//       zoom={getCurrentZoom(radius)}>
//       <TileLayer
//         url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <MapConsumer>
//         {(map) => {
//           console.log('## MAP CENTER POSITION:', position);
//           setPosition(map.getCenter());
//           // return () => setCoords(map.getCenter());
//           // return null;

//           return <TaskMarkers tasks={tasks} />;
//         }}
//       </MapConsumer>
//     </MapContainer>
//   );
// }

// /**
//  *
//  *
//  * export default function TaskMap({
//   radius,
//   coords,
//   tasks,
//   setCoords,
//   ...restOfProps
// }) {
//   // { radius, coords, tasks, ...restOfProps }
//   // const [currentCoords, setCurrentCoords] = useState({
//   //   latitude: null,
//   //   longitude: null,
//   // });

//   // const [currentCoords, setCurrentCoords] = useState(getCurrentCoords());

//   // useEffect(() => {
//   //   setCurrentCoords(mapServices.currentCoords);
//   // });

//   return (
//     // prop whencreated has parameter map to add event lsitener to the map

//     <MapContainer
//       center={[coords.lat, coords.lng]}
//       zoom={getCurrentZoom(radius)}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <MapConsumer>
//         {(map) => {
//           // console.log("MAP CENTER:", map.getCenter());
//           return () => setCoords(map.getCenter());
//           // return null;
//         }}
//       </MapConsumer>

//       <TaskMarkers tasks={tasks} />
//     </MapContainer>
//   );
//   // }
// }

//  */

// // const center = [51.505, -0.09];
// // const zoom = getCurrentZoom(zoom);

// // function DisplayPosition({ map }, zoom, center) {
// //   const [position, setPosition] = useState(map.getCenter());

// //   // const onClick = useCallback(() => {
// //   //   map.setView(center, zoom);
// //   // }, [map]);

// //   const onMove = useCallback(() => {
// //     setPosition(map.getCenter());
// //   }, [map]);

// //   useEffect(() => {
// //     map.on("move", onMove);
// //     return () => {
// //       map.off("move", onMove);
// //     };
// //   }, [map, onMove]);

// //   return (
// //     <p>
// //       latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{" "}
// //       {
// //         // <button onClick={onClick}>reset</button>
// //       }
// //     </p>
// //   );
// // }

// /**
//  * export default function TaskMap({
//   radius,
//   coords,
//   tasks,
//   setCoords,
//   ...restOfProps
// }) {
//   const [map, setMap] = useState(null);
//   const [position, setPosition] = useState(null);

//   // const onClick = useCallback(() => {
//   //   map.setView(center, zoom);
//   // }, [map]);

//   const onMove = useCallback(() => {
//     setPosition(map.getCenter());
//   }, [map]);

//   useEffect(() => {
//     if (map) {
//       setPosition(map.getCenter());
//     }
//   });

//   useEffect(() => {
//     if (map) {
//       map.on("move", onMove);

//       setCoords({
//         lat: position?.lat.toFixed(5),
//         lng: position?.lng.toFixed(5),
//       });
//       return () => {
//         map.off("move", onMove);
//       };
//     }
//   }, [map, onMove]);

//   // latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}

//   const displayMap = useMemo(
//     () => (
//       <MapContainer
//         center={[coords.lat, coords.lng]}
//         zoom={getCurrentZoom(radius)}
//         whenCreated={setMap}
//       >
//         <TileLayer
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <TaskMarkers tasks={tasks} />
//       </MapContainer>
//     ),
//     []
//   );

//   return <div>{displayMap}</div>;
// }

//  */

// /**
//    * {map ? (
//         <DisplayPosition
//           map={map}
//           zoom={getCurrentZoom(radius)}
//           center={[coords.lat, coords.lng]}
//         />
//       ) : null}
//    */
