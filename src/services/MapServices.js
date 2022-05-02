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

/****
 class MapServices {
  constructor() {
    // this.optionsCoords = {
    //   enableHighAccuracy: true,
    //   timeout: 5000,
    //   maximumAge: 0,
    // };
    this.optionsCoords = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 15000,
    };
    this.currentCoords = { latitude: null, longitude: null };

    //   {
    //   latitude: -23.55052,
    //   longitude: -46.633309,
    // }); // Sao Paolo!
  }

  // {latitude: 35.689487, longitude: 139.691706}); // Tokyo!
  // const [currentCoords, setCurrentCoords] = useState({latitude: -23.55052, longitude: -46.633309}); // Sao Paolo!
  // const [currentCoords, setCurrentCoords] = useState({latitude: null, longitude: null});

  // webAPI
  okPos(pos) {
    this.currentCoords.latitude = pos.coords.latitude;
    this.currentCoords.longitude = pos.coords.longitude;
    console.log(
      "********FROM MapServices CURRENT LOCATION: location lat/long: "
    );
    console.log(
      this.currentCoords.latitude,
      "   ",
      this.currentCoords.longitude
    );
  }

  errPos(err) {
    console.error(
      `ERROR > <APP/>getCurrentLocation: ${err.code} ${err.message}`
    );
  }
  getCurrentLocation() {
    try {
      navigator.geolocation.getCurrentPosition(
        this.okPos,
        this.errPos,
        this.optionsCoords
      );
    } catch (e) {
      console.error(
        "FROM MAPTSERVICES CATCHLOCATION API ERROR CATCH: location lat/long: " +
          this.currentCoords +
          e.toString()
      );
    }
    console.info(
      `FROM MAPSERVICE GETCURRENTLOCATION GET CURRENT POSITION: location lat/long: " + ${this.currentCoords.latitude}/${this.currentCoords.longitude}`
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

  getCurrentCoords() {
    // NOTE FOR DEBUG Sao Paolo!
    this.currentCoords = {
      latitude: -23.55052,
      longitude: -46.633309,
    };
    // NOTE FOR DEBUG
    // this.getCurrentLocation();
    return this.currentCoords;
  }
}

 export default new MapServices();
 ***/

// useEffect(() => {
// const watcherId = navigator.geolocation.watchPosition(
//   (pos) => setCurrentCoords({latitude: pos.coords.latitude, longitude: pos.coords.longitude}),
//     (err) => console.error(`ERROR > <APP/>getCurrentLocation: ${err.code} ${err.message}`),
//     {
//   enableHighAccuracy: false,
//   timeout: 30000,
//   maximumAge: 15000});
// return function cleanup() {
//   navigator.geolocation.clearWatch(watcherId);
//       console.info(`FROM useEffect WATCHPOSITION CURRENT LOCATION: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
// }
// });

////

// let {latitude, longitude} = location;
// console.info(`FROM <Map/> currentCoords: location lat/long: " + ${currentCoords.latitude}/${currentCoords.longitude}` );
// latitude+", "+longitude );

// if (currentCoords.latitude == null && currentCoords.longitude=== null) {
//   return (<div> AWAITING GEOLOC FIX</div>);
// }

// else {
