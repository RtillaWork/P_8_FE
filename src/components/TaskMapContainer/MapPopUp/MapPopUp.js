// import React, {useState, useEffect} from 'react';
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import { Icon } from "leaflet";
// import tasks from '../../services/tasks';
// import ChatBox from '../ChatBox';

// export default function Map(props) {

//   // const optionsCoords = {
//   //   enableHighAccuracy: true,
//   //   timeout: 5000,
//   //   maximumAge: 0};
//   // {latitude: 35.689487, longitude: 139.691706}); // Tokyo!
//   const [currentCoords, setCurrentCoords] = useState({latitude: -23.55052, longitude: -46.633309}); // Sao Paolo!
//   // const [currentCoords, setCurrentCoords] = useState({latitude: null, longitude: null});

//   //webAPI
//   // let okPos = (pos) => {
//   //   setCurrentCoords({latitude: pos.coords.latitude, longitude: pos.coords.longitude});
//     // console.info(`FROM okPos CURRENT LOCATION: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
//     // }
//   // let errPos = (err) => console.error(`ERROR > <APP/>getCurrentLocation: ${err.code} ${err.message}`);

//   // useEffect(() => {
//   //   // try {
//   //       navigator.geolocation.getCurrentPosition(okPos, errPos,  {
//   //         enableHighAccuracy: true,
//   //         timeout: 5000,
//   //         maximumAge: 0});
//   //   // }
//   //   // catch(e) {
//   //   //   console.error("FROM CATCHLOCATION API ERROR CATCH: location lat/long: " + currentCoords + e.toString());
//   //   // }
//   //   console.info(`FROM useEffect GET CURRENT POSITION: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
//   // });

//   // useEffect(() => {
//   // const watcherId = navigator.geolocation.watchPosition(
//   //   (pos) => setCurrentCoords({latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
//   //     (err) => console.error(`ERROR > <APP/>getCurrentLocation: ${err.code} ${err.message}`),
//   //     {
//   //   enableHighAccuracy: false,
//   //   timeout: 30000,
//   //   maximumAge: 15000});
//   // return function cleanup() {
//   //   navigator.geolocation.clearWatch(watcherId);
//   //       console.info(`FROM useEffect WATCHPOSITION CURRENT LOCATION: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
//   // }
//   // });

//   // let {latitude, longitude} = location;
//   // console.info(`FROM <Map/> currentCoords: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
//   // latitude+", "+longitude );

//   let taskMarkers = tasks.map((task) =>
//   (
//     <Marker position={[task.coords.latitude, task.coords.longitude]} key={task.id.toString()}>
//     <Popup>
//     <ChatBox />
//       <h4>{task.title}</h4>
//        <span className="icon is-large">
//       { task.kind === 'material_need' ?
//       <i className="fas fa-parachute-box" aria-hidden="true"></i> :
//       task.kind === 'one_time_task' ? <i className="fas fa-hands-helping" aria-hidden="true"></i> :
//       <i className="fas fa-leaf" aria-hidden="true"></i>
//       }
//       </span> <br />
//       <a type="button" className="card-footer-item button is-primary">Offer Help</a>

//     </Popup>
//   </Marker>
//   )
//   );

//   // if (currentCoords.latitude == null && currentCoords.longitude=== null) {
//   //   return (<div> AWAITING GEOLOC FIX</div>);
//   // }

//   // else {
// return (

//     <MapContainer center={[currentCoords.latitude, currentCoords.longitude]} zoom={12}>
//         <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {taskMarkers}
//     </MapContainer>
// );
//   // }
// }
