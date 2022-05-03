//
import {
    COORDS_REFRESH_SENSITIVITY,
    DISPLACEMENT_SENSITIVITY,
    geolocationOptions,
    MAP_REFRESH_DURATION,
} from "./geolocationSettings";

const toLatLngArray = (coords) => {
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);

    return [lat, lng];
};

const toLatLngObject = (coords) => {
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    return {lat: lat, lng: lng};
};

export {
    geolocationOptions,
    MAP_REFRESH_DURATION,
    DISPLACEMENT_SENSITIVITY,
    COORDS_REFRESH_SENSITIVITY,
    toLatLngArray,
    toLatLngObject,
};

// recenter current location
// get current location
// compute radius
// compute zoom level
//

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
        navigator.geolocation.getCurrentPosition(okPos, errPos, geolocationOptions);
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
