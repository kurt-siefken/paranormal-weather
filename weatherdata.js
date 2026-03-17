
//////////////// GET LOCATION ////////////////////

document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const zip = params.get("zip");


  if (zip) {

    console.log("ZIP detected in URL:", zip);

    document.getElementById("zipcode").value = zip;

	if (zip && /^\d{5}$/.test(zip)) {
  	findCityData();
	}




  } else {

    console.log("No ZIP in URL — using browser location");


var loclon, loclat;
navigator.geolocation.getCurrentPosition(onSuccess, onError);

function onSuccess(position) {
        const {
            latitude,
            longitude
        } = position.coords;

	loclat = `${latitude}`;
	loclon = `${longitude}`;


	console.log(loclat + " , " + loclon);

	// getCityFromCoords(loclat, loclon);
	getWeather(loclat, loclon);
	document.getElementById("weather-location").innerHTML = "Current conditions in your area"

    }

    // handle error case
    function onError() {
        message.classList.add('error');
        message.textContent = `Failed to get your location!`;
    }




  }

});

//////////////// GET LOCATION ////////////////////


////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("FindCityData");
  button.addEventListener("click", findCityData);
});




//////////////////////////////////////////////////////

async function findCityData(event) {

  if (event) event.preventDefault(); // Stops page reload on button click

  const zip = document.getElementById("zipcode").value;

  const response = await fetch(`https://api.zippopotam.us/us/${zip}`);

  const data = await response.json();

  const lat = data.places[0].latitude;
  const lon = data.places[0].longitude;
  const city = data.places[0]["place name"];
  const state = data.places[0]["state"];
  const stateAbbrev = data.places[0]["state abbreviation"];

  console.log("Location:", city + ", " + stateAbbrev + ". Lat:" + lat + ", Lon:" + lon );

	document.getElementById("weather-location").innerHTML = "Current conditions in " + city + ", " + stateAbbrev

getWeather(lat, lon);


  const url = new URL(window.location);
  url.searchParams.set("zip", zip);
  history.replaceState({}, "", url);
}







////////////////////////////////////////////////////////////////////////////

async function getWeather(lat, lon) {

const weatherURL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${lat}` +
  `&longitude=${lon}` +
  `&current=is_day,temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m` +
  `&daily=sunrise,sunset` +
  `&hourly=visibility` +
  `&temperature_unit=fahrenheit` +
  `&wind_speed_unit=mph` +
  `&timezone=auto`;

  const response = await fetch(weatherURL);
  const data = await response.json();

  console.log(data);

  const temp = data.current.temperature_2m;
  const wind = data.current.wind_speed_10m;
  const winddirection = getWindDirection(data.current.wind_direction_10m)
  const hour = new Date().getHours();
  const humidity = data.current.relative_humidity_2m;
  const weathercode = data.current.weather_code;
  const weather = convertweathercode(weathercode);
  const visibility = data.hourly.visibility;
  const isDay = data.current.is_day;     // usually 1 = day, 0 = night
  const sunriseRaw = data.daily.sunrise[0];
  const sunsetRaw = data.daily.sunset[0];
  const moonphase = getMoonPhase();



  const sunsetDate = new Date(sunsetRaw);
  const sunset = sunsetDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
  const sunriseDate = new Date(sunriseRaw);
  const sunrise = sunriseDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });


const totalweather = {
  temp: temp,
  humidity: humidity,
  visiblity: visibility,
  windSpeed: wind,
  windDir: winddirection,
  weatherCode: weathercode,
  isDay: isDay,
  sunrise: sunrise,
  sunset: sunset,
  moonphase: moonphase
};





  var weathericon = convertweathericon(weathercode);
  if ((weathericon == 'sun' || weathericon == 'light-sun') && isDay == 0) {weathericon = "clear-night"}
  if ((weathericon == 'partly-sun') && isDay == 0) {weathericon = "cloudy-night"}
  weathericon = weathericon + ".png"


	document.getElementById("weather-icon").src = 'icons/' + weathericon;
	document.getElementById("weather-temperature").innerHTML = temp + '°F';
	document.getElementById("weather-humidity").innerHTML = humidity + '%';
	document.getElementById("weather-wind").innerHTML = wind + ' ' + winddirection;
	document.getElementById("weather-skies").innerHTML = weather;
	document.getElementById("weather-sunrise").innerHTML = sunrise;
	document.getElementById("weather-sunset").innerHTML = sunset;
	document.getElementById("weather-moon").innerHTML = moonphase;

	turnOffThreatMeters();

	// - Vampire
	var vampirethreat = getVampireThreat(totalweather);
	document.getElementById("threat-vampire").innerHTML = vampirethreat;
	document.getElementById("vampire-" + vampirethreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");
	
	// - Werewolf
	var werewolfthreat = getWerewolfThreat(totalweather);
	document.getElementById("threat-werewolf").innerHTML = werewolfthreat;
	document.getElementById("werewolf-" + werewolfthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");
	
	// - Swamp Monster
	var swampmonsterthreat = getSwampMonsterThreat(totalweather);
	document.getElementById("threat-swampmonster").innerHTML = swampmonsterthreat;
	document.getElementById("swampmonster-" + swampmonsterthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Alien
	var alienthreat = getAlienThreat(totalweather);
	document.getElementById("threat-alien").innerHTML = alienthreat;
	document.getElementById("alien-" + alienthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");


	// - Mummy
	var mummythreat = getMummyThreat(totalweather);
	document.getElementById("threat-mummy").innerHTML = mummythreat;
	document.getElementById("mummy-" + mummythreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Ghost
	var ghostthreat = getGhostThreat(totalweather);
	document.getElementById("threat-ghost").innerHTML = ghostthreat;
	document.getElementById("ghost-" + ghostthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Dragon
	var dragonthreat = getDragonThreat(totalweather);
	document.getElementById("threat-dragon").innerHTML = dragonthreat;
	document.getElementById("dragon-" + dragonthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Zombie
	var zombiethreat = getZombieThreat(totalweather);
	document.getElementById("threat-zombie").innerHTML = zombiethreat;
	document.getElementById("zombie-" + zombiethreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Clowns
	var clownthreat = getClownThreat(totalweather);
	document.getElementById("threat-clown").innerHTML = clownthreat;
	document.getElementById("clown-" + clownthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Stampede
	var stampedethreat = getStampedeThreat(totalweather);
	document.getElementById("threat-stampede").innerHTML = stampedethreat;
	document.getElementById("stampede-" + stampedethreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Robot
	var robotthreat = getRobotThreat(totalweather);
	document.getElementById("threat-robot").innerHTML = robotthreat;
	document.getElementById("robot-" + robotthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Yeti
	var yetithreat = getYetiThreat(totalweather);
	document.getElementById("threat-yeti").innerHTML = yetithreat;
	document.getElementById("yeti-" + yetithreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Salesmen
	var salesmenthreat = getSalesmenThreat(totalweather);
	document.getElementById("threat-salesmen").innerHTML = salesmenthreat;
	document.getElementById("salesmen-" + salesmenthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");

	// - Angst
	var angstthreat = getAngstThreat(totalweather);
	document.getElementById("threat-angst").innerHTML = angstthreat;
	document.getElementById("angst-" + angstthreat.toLowerCase().replaceAll(' ', '')).classList.remove("threat-off");



}






/////////////////////////////////////////////////////////
////////////////// TURN ALL METERS OFF //////////////////
function turnOffThreatMeters() {
  document
    .querySelectorAll(".threat-meter-box")
    .forEach(m => m.classList.add("threat-off"));
}







//////////////////////////////////////////////////////////
//////////////// CONVERT WEATHER CODE ////////////////////
function convertweathercode(dataweather) {


const weatherMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

const weatherdescription =
  weatherMap[dataweather] || "Unknown atmospheric anomaly";

return(weatherdescription);
}




//////////////////////////////////////////////////////////
/////////////////////// GET ICON /////////////////////////
function convertweathericon(dataweather) {


const weatherMap = {
  0: "sun",
  1: "sun-light",
  2: "cloudy",
  3: "overcast",
  45: "haze",
  48: "haze",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "hard-rain",
  66: "drizzle",
  67: "hard-rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "drizzle",
  81: "rain",
  82: "hard-rain",
  85: "snow",
  86: "snow",
  95: "thunderstorm",
  96: "thunderstorm",
  99: "thunderstorm"
};

const weatherdescription =
  weatherMap[dataweather] || "overcast";

return(weatherdescription);
}





////////////////////////////////////////////////////////////////////
////////////////// FORMAT WIND DIRECTION ///////////////////////////


function getWindDirection(deg) {
  const directions = [
    "↑","↗","→","↘","↓","↙","↑","↖"
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}


//////////////////////////////////////////////////////////
//////////////////// GET MOON PHASE //////////////////////

function getMoonPhase(date = new Date()) {

  const lunarCycle = 29.53058867;
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const moonAge = daysSince % lunarCycle;
  if (moonAge < 1.84566) return "New Moon";
  if (moonAge < 5.53699) return "Waxing Crescent";
  if (moonAge < 9.22831) return "First Quarter";
  if (moonAge < 12.91963) return "Waxing Gibbous";
  if (moonAge < 16.61096) return "Full Moon";
  if (moonAge < 20.30228) return "Waning Gibbous";
  if (moonAge < 23.99361) return "Last Quarter";
  if (moonAge < 27.68493) return "Waning Crescent";

  return "New Moon";
}





/////////////////////////////////////////////////////////////////////
////////////////////// GET MONSTER THREATS //////////////////////////
/////////////////////////////////////////////////////////////////////

function getVampireThreat(weather) {

  const isClear = weather.weatherCode === 0 || weather.weatherCode === 1;
  const isDay = weather.isDay === 1;

  if (isDay) {
    return isClear ? "MODERATE" : "LOW";
  }

  // Nighttime
  return isClear ? "SEVERE" : "VERY HIGH";
}

///////////////////////////////////////////////////////////////

function getWerewolfThreat(weather) {
  if (weather.isDay === 1) {
    return "LOW";
  }

  const moonThreatMap = {
    "New Moon": 1,
    "Waxing Crescent": 1,
    "First Quarter": 1,
    "Waxing Gibbous": 2,
    "Full Moon": 4,
    "Waning Gibbous": 2,
    "Last Quarter": 1,
    "Waning Crescent": 1
  };

  let threatLevel = moonThreatMap[weather.moonphase] || 1;

  const bonusCodes = [0, 1, 45, 48, 95, 96, 99];

  if (bonusCodes.includes(weather.weatherCode)) {
    threatLevel += 1;
  }

  if (threatLevel >= 5) return "SEVERE";
  if (threatLevel >= 4) return "VERY HIGH";
  if (threatLevel >= 3) return "HIGH";
  if (threatLevel >= 2) return "MODERATE";
  return "LOW";
}


///////////////////////////////////////////////////////////////


function getSwampMonsterThreat(weather) {

  let threat;

  // --- Base threat from humidity ---
  if (weather.humidity < 50) threat = 1;
  else if (weather.humidity < 70) threat = 2;
  else if (weather.humidity < 85) threat = 3;
  else if (weather.humidity < 95) threat = 4;
  else threat = 5;

  // --- Temperature modifier (°F assumed) ---
  if (weather.temp < 40) threat -= 2;      // cold swamp = sleepy monster
  else if (weather.temp < 60) threat -= 1; // cool = sluggish
  else if (weather.temp >= 80) threat += 1; // warm = active
  else if (weather.temp >= 90) threat += 2; // steamy = rampage

  // Clamp to valid range
  threat = Math.max(1, Math.min(5, threat));

  // Convert to labels
  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}


///////////////////////////////////////////////////////////////


function getAlienThreat(weather) {

  let threat = 1;

  // --- Sky clarity ---
  const clearCodes = [0, 1, 2]; // clear → partly cloudy
  if (clearCodes.includes(weather.weatherCode)) threat += 1;

  // --- Temperature (°F) ---
  if (weather.temp >= 60 && weather.temp <= 85) threat += 1;
  else if (weather.temp >= 45 && weather.temp <= 95) threat += 0;

  // --- Wind ---
  if (weather.windSpeed < 10) threat += 1;

  // --- Visibility ---
  if (weather.visibility > 20000) threat += 1;

  // --- Night bonus ---
  if (weather.isDay === 0) threat += 1;

  // Clamp to range
  threat = Math.min(5, threat);

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}

///////////////////////////////////////////////////////////////


function getMummyThreat(weather) {

  let threat = 1;

  // --- Humidity (inverse relationship) ---
  if (weather.humidity < 30) threat += 3;
  else if (weather.humidity < 45) threat += 2;
  else if (weather.humidity < 60) threat += 1;
  // Above 60% → basically safe for archaeology

  // --- Temperature (°F) ---
  if (weather.temp >= 80) threat += 2;
  else if (weather.temp >= 65) threat += 1;
  else if (weather.temp < 50) threat -= 1;

  // Clamp to valid range
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];

}


///////////////////////////////////////////////////////////////


function getGhostThreat(weather) {

  let threat = 1;

  // --- Night bonus ---
  if (weather.isDay === 0) threat += 2;

  // --- Temperature (°F) ---
  if (weather.temp <= 60) threat += 2;
  else if (weather.temp <= 70) threat += 1;
  else if (weather.temp > 85) threat -= 1;

  // --- Humidity (prefers dry) ---
  if (weather.humidity < 40) threat += 1;
  else if (weather.humidity > 75) threat -= 1;

  // --- Fog / mist bonus ---
  const fogCodes = [45, 48];
  if (fogCodes.includes(weather.weatherCode)) threat += 1;

  // --- Low visibility ---
  if (weather.visibility < 6000) threat += 1;

  // --- Strong wind penalty ---
  if (weather.windSpeed > 20) threat -= 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}


///////////////////////////////////////////////////////////////

function getDragonThreat(weather) {

  let threat = 1;

  // --- Temperature (°F) ---
  if (weather.temp >= 85) threat += 3;
  else if (weather.temp >= 70) threat += 2;
  else if (weather.temp >= 55) threat += 1;
  else if (weather.temp < 45) threat -= 1;

  // --- Wind speed (mph) ---
  if (weather.windSpeed <= 5) threat += 2;      // glassy air
  else if (weather.windSpeed <= 12) threat += 1;
  else if (weather.windSpeed >= 25) threat -= 2; // unsafe flight

  // --- Clear sky bonus ---
  const clearCodes = [0, 1, 2];
  if (clearCodes.includes(weather.weatherCode)) threat += 1;

  // --- Visibility bonus ---
  if (weather.visibility > 20000) threat += 1;

  // Clamp to valid range
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}

///////////////////////////////////////////////////////////////

function getZombieThreat(weather) {

  let threat = 2; // baseline: MODERATE (they're always around)

  // --- Night bonus ---
  if (weather.isDay === 0) threat += 1;

  // --- Low visibility bonus ---
  if (weather.visibility < 5000) threat += 1;

  // --- Heavy cloud / fog bonus ---
  const spookyCodes = [3, 45, 48];
  if (spookyCodes.includes(weather.weatherCode)) threat += 1;

  // --- Rain penalty ---
  const rainCodes = [61, 63, 65, 80, 81, 82];
  if (rainCodes.includes(weather.weatherCode)) threat -= 1;

  // --- Extreme cold slows them ---
  if (weather.temp < 20) threat -= 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}


///////////////////////////////////////////////////////////////

function getClownThreat(weather) {

  let threat = 1;

  // --- Night bonus ---
  if (weather.isDay === 0) threat += 2;

  // --- Fog / mist ---
  const fogCodes = [45, 48];
  if (fogCodes.includes(weather.weatherCode)) threat += 2;

  // --- Light rain / drizzle ---
  const drizzleCodes = [51, 53, 55, 61];
  if (drizzleCodes.includes(weather.weatherCode)) threat += 1;

  // --- Heavy rain penalty ---
  const heavyRainCodes = [63, 65, 82];
  if (heavyRainCodes.includes(weather.weatherCode)) threat -= 1;

  // --- Low visibility bonus ---
  if (weather.visibility < 5000) threat += 1;

  // --- Comfortable temperature bonus (°F) ---
  if (weather.temp >= 45 && weather.temp <= 75) threat += 1;

  // Clamp to range
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}

///////////////////////////////////////////////////////////////

function getStampedeThreat(weather) {

  let threat = 1;

  // --- Heat stress (°F) ---
  if (weather.temp >= 90) threat += 2;
  else if (weather.temp >= 80) threat += 1;

  // --- Humidity amplifies heat misery ---
  if (weather.humidity >= 70) threat += 1;

  // --- Strong winds ---
  if (weather.windSpeed >= 25) threat += 2;
  else if (weather.windSpeed >= 15) threat += 1;

  // --- Thunderstorm panic ---
  const stormCodes = [95, 96, 99];
  if (stormCodes.includes(weather.weatherCode)) threat += 2;

  // --- Heavy snow movement ---
  const snowCodes = [75, 86];
  if (snowCodes.includes(weather.weatherCode)) threat += 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}


///////////////////////////////////////////////////////////////

function getRobotThreat(weather) {


  let threat = 1;

  // --- Temperature (°F) ---
  if (weather.temp >= 35 && weather.temp <= 60) threat += 2;
  else if (weather.temp >= 25 && weather.temp <= 75) threat += 1;
  else if (weather.temp > 90) threat -= 2;

  // --- Humidity ---
  if (weather.humidity < 30) threat += 2;
  else if (weather.humidity < 50) threat += 1;
  else if (weather.humidity > 80) threat -= 2;

  // --- Precipitation penalty ---
  const wetCodes = [
    51,53,55,56,57,61,63,65,66,67,80,81,82
  ];
  if (wetCodes.includes(weather.weatherCode)) threat -= 2;

  // --- Strong wind penalty ---
  if (weather.windSpeed > 25) threat -= 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}



///////////////////////////////////////////////////////////////

function getYetiThreat(weather) {

  let threat = 1;

  // --- Temperature (°F) ---
  if (weather.temp <= 20) threat += 4;
  else if (weather.temp <= 32) threat += 3;
  else if (weather.temp <= 45) threat += 2;
  else if (weather.temp > 60) threat -= 1;

  // --- Snow / winter weather codes ---
  const snowCodes = [71, 73, 75, 77, 85, 86]; // snow + snow showers
  if (snowCodes.includes(weather.weatherCode)) threat += 2;

  // --- Low visibility bonus ---
  if (weather.visibility < 5000) threat += 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];
}


///////////////////////////////////////////////////////////////

function getSalesmenThreat(weather) {

let threat = 1;

  // --- Daytime required ---
  if (weather.isDay === 1) threat += 2;
  else threat -= 1;

  // --- Temperature (°F) ---
  if (weather.temp >= 55 && weather.temp <= 80) threat += 2;
  else if (weather.temp >= 45 && weather.temp <= 90) threat += 1;
  else threat -= 1;

  // --- Clear sky bonus ---
  const clearCodes = [0, 1, 2];
  if (clearCodes.includes(weather.weatherCode)) threat += 1;

  // --- Precipitation penalty ---
  const wetCodes = [
    51,53,55,56,57,61,63,65,66,67,80,81,82
  ];
  if (wetCodes.includes(weather.weatherCode)) threat -= 2;

  // --- Wind penalty ---
  if (weather.windSpeed > 20) threat -= 1;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["LOW", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];


}





///////////////////////////////////////////////////////////////

function getAngstThreat(weather) {

  let threat = 1;

  // --- Night bonus ---
  if (weather.isDay === 0) threat += 2;

  // --- Overcast / gloomy skies ---
  const gloomyCodes = [2, 3]; // partly cloudy, overcast
  if (gloomyCodes.includes(weather.weatherCode)) threat += 2;

  // --- Light rain / drizzle ---
  const drizzleCodes = [51, 53, 55, 61];
  if (drizzleCodes.includes(weather.weatherCode)) threat += 1;

  // --- Humidity (heavy air effect) ---
  if (weather.humidity >= 70) threat += 2;
  else if (weather.humidity >= 55) threat += 1;

  // --- Mild temperatures (°F) ---
  if (weather.temp >= 55 && weather.temp <= 75) threat += 1;

  // --- Calm air ---
  if (weather.windSpeed < 5) threat += 1;

  // --- Bright clear day reduces angst ---
  if (weather.isDay === 1 && weather.weatherCode === 0) threat -= 2;

  // Clamp
  threat = Math.max(1, Math.min(5, threat));

  const levels = ["MODERATE", "MODERATE", "HIGH", "VERY HIGH", "SEVERE"];

  return levels[threat - 1];

}





