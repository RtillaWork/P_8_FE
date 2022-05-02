export const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
    // enableHighAccuracy: false,
    // maximumAge: 30000,
    // timeout: 27000,
};

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

export const DISPLACEMENT_SENSITIVITY = {
    MIN_LAT_DELTA: 0.01,
    MIN_LNG_DELTA: 0.01,
};

export const MAP_REFRESH_DURATION = 1000; //seconds
export const COORDS_REFRESH_SENSITIVITY = {
    MIN_LAT_DELTA: 0.005,
    MIN_LNG_DELTA: 0.005,
};
