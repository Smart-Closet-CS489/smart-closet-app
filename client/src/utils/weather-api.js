/**
 * gets current weather data for w lafayette, indiana
 * uses open‑meteo api
 *
 * returns object with:
 *   - temperature: current temperature (in fahrenheit :()
 *   - rain: boolean, true if chance of precipitation above threshold and temperature > 0°C.
 *   - snow: boolean, true if chance of precipitation above threshold and temperature <= 0°C.
 * *
 * @returns {Promise<{temperature: number, rain: boolean, snow: boolean}>}
 * @throws {Error}
 * 
 */
export async function getWeather() {
    const latitude = 40.4259;
    const longitude = -86.9081;
  
    const THRESHOLD = 50;
  
    const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current_weather=true` +
    `&hourly=precipitation_probability` +
    `&temperature_unit=fahrenheit`;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`weather API request failed :(( with ${response.status}`);
    }
    const data = await response.json();
  
    // current weather deets
    const currentWeather = data.current_weather;
    const temperature = currentWeather.temperature;
    const currentTime = currentWeather.time;
  
    const hourlyTimes = data.hourly.time;
    const precipProbArray = data.hourly.precipitation_probability;
    let index = hourlyTimes.indexOf(currentTime);
  
    // closest available time
    if (index === -1 && hourlyTimes.length > 0) {
      const currentTimestamp = new Date(currentTime).getTime();
      let closestDiff = Infinity;
      for (let i = 0; i < hourlyTimes.length; i++) {
        const timeStamp = new Date(hourlyTimes[i]).getTime();
        const diff = Math.abs(timeStamp - currentTimestamp);
        if (diff < closestDiff) {
          closestDiff = diff;
          index = i;
        }
      }
    }
  
    // probability of precipitation (rain or snow)
    const precipProbability = precipProbArray[index];
  
    let rain = false;
    let snow = false;
    if (temperature > 0) {
      rain = precipProbability >= THRESHOLD;
    } else {
      snow = precipProbability >= THRESHOLD;
    }

    return {
      temperature,
      rain,
      snow
    };
  }

//test
  async function main() {
    try {
      const weather = await getWeather()
      console.log(weather)
    } catch (err) {
      console.error(err)
    }
  }
  
  main()