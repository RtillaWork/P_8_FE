// recenter current location
// get current location
// compute radius
// compute zoom level
//

// this.optionsCoords = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
// };
let optionsCoords = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 15000,
};
let currentCoords = {latitude: null, longitude: null};

//   {
//   latitude: -23.55052,
//   longitude: -46.633309,
// }); // Sao Paolo!

// {latitude: 35.689487, longitude: 139.691706}); // Tokyo!
// const [currentCoords, setCurrentCoords] = useState({latitude: -23.55052, longitude: -46.633309}); // Sao Paolo!
// const [currentCoords, setCurrentCoords] = useState({latitude: null, longitude: null});

// webAPI
function okPos(pos) {
    this.currentCoords.latitude = pos.coords.latitude;
    this.currentCoords.longitude = pos.coords.longitude;
    console.log("********FROM MapServices CURRENT LOCATION: location lat/long: ");
    console.log(this.currentCoords.latitude, "   ", this.currentCoords.longitude);
}

function errPos(err) {
    console.error(`ERROR > <APP/>getCurrentLocation: ${err.code} ${err.message}`);
}

function getCurrentLocation() {
    try {
        navigator.geolocation.getCurrentPosition(okPos, errPos, optionsCoords);
    } catch (e) {
        console.error(
            "FROM MAPTSERVICES CATCHLOCATION API ERROR CATCH: location lat/long: " +
            currentCoords +
            e.toString()
        );
    }
    console.info(
        `FROM MAPSERVICE GETCURRENTLOCATION GET CURRENT POSITION: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}`
    );
}

// set currentCoords(coords) {
//   this.currentCoords = coords;
// }

// get CurrentCoords() {
//   // NOTE FOR DEBUG
//   this.currentCoords = {
//     latitude: -23.55052,
//     longitude: -46.633309,
//   }; // Sao Paolo!
//   // NOTE FOR DEBUG

//   return this.currentCoords;
// }

export function getCurrentCoords() {
    // NOTE FOR DEBUG Sao Paolo!
    currentCoords = {
        latitude: -23.55052,
        longitude: -46.633309,
    };
    // NOTE FOR DEBUG
    // this.getCurrentLocation();
    return currentCoords;
}
