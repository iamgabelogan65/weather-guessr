const MAX_LAT = 90; // 90 is the max value of longitude
const LAT_RANGE = 180 // ranges from -90 to 90
const MAX_LONG = 180; // 180 is max value of latitude
const LONG_RANGE = 360 // ranges from -180 to 180

export function getPosition() {
    // calcualte lat and long fixed to 6 decimal places
    let lat = (Math.random() * LAT_RANGE - MAX_LAT).toFixed(6);
    let long = (Math.random() * LONG_RANGE - MAX_LONG).toFixed(6);


    return {
        latitude : parseFloat(lat),
        longitude : parseFloat(long),
    };
}