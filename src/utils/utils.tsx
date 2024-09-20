import axios from "axios";

const MAX_LAT = 90; // 90 is the max value of longitude
const LAT_RANGE = 180 // ranges from -90 to 90
const MAX_LONG = 180; // 180 is max value of latitude
const LONG_RANGE = 360 // ranges from -180 to 180

export interface Position {
	lat: number;
	lng: number;
  }


export function getPosition() {
    // calcualte lat and long fixed to 6 decimal places
    let lat = (Math.random() * LAT_RANGE - MAX_LAT).toFixed(6);
    let long = (Math.random() * LONG_RANGE - MAX_LONG).toFixed(6);


    return {
        lat : parseFloat(lat),
        lng : parseFloat(long),
    };
}


// score calculations: computes the percent accuracy in decimal form
export function calculateScore(guess: number, actual: number): number {
    let abs_guess = Math.abs(guess)
    let abs_actual = Math.abs(actual)

    return 1 - (Math.abs((abs_actual - abs_guess)/abs_actual));
}

export async function getPositionFromCountryList(): Promise<Position | null> {
	const url = 'https://restcountries.com/v3.1/all?fields=name,capital,latlng'
	try {
		const res = await axios.get(url)
		if (res.data) {
			const data = res.data
			const randomCountry = Math.floor(Math.random() * data.length)
			console.log(data[randomCountry].name.common)
			return {
				lat: data[randomCountry].latlng[0],
				lng: data[randomCountry].latlng[1],
			}
		}

		return null
	} catch (error) {
		console.error('Error fetching country coordinaties:', error)
		return null
	}
}