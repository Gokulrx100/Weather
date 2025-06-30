const apiKey = process.env.APIKEY;
let tempUnit = 'metric';      
let distanceUnit = 'km';      
let windUnit = 'km/h';        

function cToF(c) { return (c * 9/5) + 32; }
function fToC(f) { return (f - 32) * 5/9; }
function kmToMi(km) { return km * 0.621371; }
function miToKm(mi) { return mi / 0.621371; }
function kmToM(km) { return km * 1000; }
function mToKm(m) { return m / 1000; }
function msToKmh(ms) { return ms * 3.6; }
function kmhToMs(kmh) { return kmh / 3.6; }
function msToKnots(ms) { return ms * 1.94384; }
function knotsToMs(knots) { return knots / 1.94384; }
function kmhToKnots(kmh) { return kmh * 0.539957; }
function knotsToKmh(knots) { return knots / 0.539957; }

document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

function navigate(view) {
  document.querySelectorAll('.view').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(view).classList.remove('hidden');

  if (view === 'Map') {
    setTimeout(initMap, 100); // Delay to allow DOM render
  }
}


const inputBox= document.getElementById("cityInput");


async function getWeatherDetails(name, lat, lon, country, state) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const weatherDetails = {
      cityName: data.name,
      country: data.sys?.country,
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      pressure: data.main?.pressure,
      windSpeed: data.wind?.speed,
      visibility: data.visibility,
      weatherDescription: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      Precipitation: data.rain?.["3h"] || 0,
    };
    console.log("Weather Details:", weatherDetails);
    document.getElementById('temp-value').textContent = weatherDetails.temperature !== undefined ? `${Math.round(weatherDetails.temperature)}°C` : '--';
    document.getElementById('temp-value').dataset.celsius = weatherDetails.temperature !== undefined ? weatherDetails.temperature : '';
    document.getElementById('feels-like-value').textContent = weatherDetails.feelsLike !== undefined ? `${Math.round(weatherDetails.feelsLike)}°C` : '--';
    document.getElementById('feels-like-value').dataset.celsius = weatherDetails.feelsLike !== undefined ? weatherDetails.feelsLike : '';
    document.getElementById('humidity-value').textContent = weatherDetails.humidity !== undefined ? `${weatherDetails.humidity}%` : '--';
    document.getElementById('pressure-value').textContent = weatherDetails.pressure !== undefined ? `${weatherDetails.pressure} hPa` : '--';
    document.getElementById('wind-value').textContent = weatherDetails.windSpeed !== undefined ? `${(weatherDetails.windSpeed*3.6).toFixed(2)} km/hr`: '--';
    document.getElementById('wind-value').dataset.ms = weatherDetails.windSpeed !== undefined ? weatherDetails.windSpeed : '';
    document.getElementById('visibility-value').textContent = weatherDetails.visibility !== undefined ? `${weatherDetails.visibility / 1000} km` : '--';
    document.getElementById('visibility-value').dataset.km = weatherDetails.visibility !== undefined ? (weatherDetails.visibility / 1000) : '';
    document.getElementById('precipitation-value').textContent = weatherDetails.Precipitation !== undefined ? `${weatherDetails.Precipitation} mm` : '--';
    updateUnitDisplays();
    return weatherDetails;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    [
      'temp-value', 'feels-like-value', 'humidity-value', 'pressure-value',
      'wind-value', 'visibility-value', 'precipitation-value'
    ].forEach(id => document.getElementById(id).textContent = '--');
    return null;
  }
}


async function getAirQuality(lat, lon) {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const aqi = data.list?.[0]?.main?.aqi || null;
    console.log("Air Quality Index:", aqi);
    document.getElementById('air-quality-value').textContent = aqi !== null ? aqi : '--';
    return aqi;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
}


async function getForecastDetails(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const timezoneOffset = data.city.timezone; //get timezone offset in seconds
    const now = new Date();

    const nextForecasts = data.list
      .map(item => {
        const utcTime = new Date(item.dt_txt);
        const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000); // convert UTC to local time 
        return {
          time: localTime,
          temperature: item.main.temp,
          icon: item.weather[0].icon
        };
      })
      .filter(item => item.time > now) // filter out past forecasts
      .slice(0, 4);

    console.log("Next 4 Hour Forecasts (Local):", nextForecasts);

    const forecastItems = document.querySelectorAll('.hourly-forecast li');
    forecastItems.forEach(li => {
      li.querySelector('.value').textContent = '--';
      li.querySelector('img').src = '';
      li.querySelector('img').alt = '';
      li.querySelector('.time').textContent = '--';
    });

    nextForecasts.forEach((item, idx) => {
      if (forecastItems[idx]) {
        forecastItems[idx].querySelector('.time').textContent =
          item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        forecastItems[idx].querySelector('.value').textContent = `${Math.round(item.temperature)}°C`;
        forecastItems[idx].querySelector('.value').dataset.celsius = item.temperature;
        forecastItems[idx].querySelector('img').src =`https://openweathermap.org/img/wn/${item.icon}@2x.png`;
        forecastItems[idx].querySelector('img').alt = item.icon;
      }
    });

    return nextForecasts;
  } catch (error) {
    console.error("Error fetching forecast data:", error);

    // Reset forecast UI
    document.querySelectorAll('.hourly-forecast li').forEach(li => {
      li.querySelector('.value').textContent = '--';
      li.querySelector('img').src = '';
      li.querySelector('img').alt = '';
      li.querySelector('.time').textContent = '--';
    });

    return [];
  }
}


async function getCurrentUVIndex(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const uvIndex = data.current?.uv_index ?? null;
    document.getElementById('uv-index-value').textContent = uvIndex !== null ? uvIndex : '--';
    console.log("UV Index:", uvIndex);
    return uvIndex;
  } catch (error) {
    console.error("Error fetching UV Index:", error);
    document.getElementById('uv-index-value').textContent = '--';
    return null;
  }
}


async function getSevenDayForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecast = data.list.map(day => ({
      date: new Date(day.dt * 1000),
      temp: Math.round(day.temp.day),
      icon: day.weather[0].icon,
      description: day.weather[0].description
    }));
    const weeklyItems = document.querySelectorAll('.weekly-forecast li');
    weeklyItems.forEach((li, idx) => {
      if (forecast[idx]) {
        const dayName = forecast[idx].date.toLocaleDateString('en-US', { weekday: 'short' });
        li.querySelector('.day-name').textContent = dayName;
        li.querySelector('img').src = `https://openweathermap.org/img/wn/${forecast[idx].icon}@2x.png`;
        li.querySelector('img').alt = forecast[idx].description;
        li.querySelector('.value').textContent = `${forecast[idx].temp}°C`;
         li.querySelector('.value').dataset.celsius = forecast[idx].temp;
      } else {
        li.querySelector('.day-name').textContent = '--';
        li.querySelector('img').src = '';
        li.querySelector('img').alt = '';
        li.querySelector('.value').textContent = '--';
        li.querySelector('.value').dataset.celsius = '';
      }
    });

    return forecast;
  } catch (error) {
    console.error("Error fetching 7-day forecast:", error);
    document.querySelectorAll('.weekly-forecast li').forEach(li => {
      li.querySelector('.day-name').textContent = '--';
      li.querySelector('img').src = '';
      li.querySelector('img').alt = '';
      li.querySelector('.value').textContent = '--';
    });
    return [];
  }
}


function addRecentSearch(city, iconUrl, tempCelsius) {
  const list = document.getElementById('recentSearchesList');
  const exists = Array.from(list.querySelectorAll('.city-name')).some(
    span => span.textContent.trim().toLowerCase() === city.trim().toLowerCase()
  );
  if (exists) return;

  list.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

  const li = document.createElement('li');
  li.innerHTML = `
    <span class="city-name">${city}</span><br>
    <img src="${iconUrl}" alt="icon" /><br>
    <span class="value" data-celsius="${parseFloat(tempCelsius)}"></span>
  `;
  li.classList.add('selected');
  list.insertBefore(li, list.firstChild);

  // Set the correct unit display immediately
  updateRecentSearchTemp(li.querySelector('.value'), parseFloat(tempCelsius));

  const items = list.querySelectorAll('li');
  if (items.length > 6) {
    const lastLi = items[items.length - 1];
    lastLi.classList.add('removing');
    setTimeout(() => {
      if (lastLi.parentNode) {
        lastLi.parentNode.removeChild(lastLi);
      }
    }, 500); 
  }

  li.addEventListener('click', async() =>{
    document.querySelectorAll("#recentSearchesList li").forEach(item => {item.classList.remove("selected")});
    li.classList.add("selected");
    inputBox.value = city;
    await getCityCoordinates();
  });
}


function updateRecentSearchTemp(span, celsius) {
  if (isNaN(celsius)) {
    span.textContent = '--';
    return;
  }
  span.textContent = tempUnit === 'imperial'
    ? `${Math.round(cToF(celsius))}°F`
    : `${Math.round(celsius)}°C`;
}


async function getCityCoordinates() {
  let cityName = inputBox.value.trim();
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  try {
    const response = await fetch(GEOCODING_API_URL);
    const data = await response.json();
    if (!data || !data[0]) {
      alert(`Failed to fetch coordinates for ${cityName}. Please try again.`);
      return;
    }
    let { name, lat, lon, country, state } = data[0];
    const weather=await getWeatherDetails(name, lat, lon, country, state);
    await getAirQuality(lat, lon);
    await getForecastDetails(lat, lon);
    await getCurrentUVIndex(lat, lon);
    await getSevenDayForecast(lat, lon);
    updateUnitDisplays();

    if(weather){
      const iconUrl= `https://openweathermap.org/img/wn/${weather.icon ? weather.icon : "01d"}@2x.png`;
      const tempC = weather.temperature !== undefined ? weather.temperature : '';
      addRecentSearch(name, iconUrl, tempC);
    }
  } catch (error) {
    alert(`Failed to fetch coordinates for ${cityName}. Please try again.`);
  }
}


function updateUnitDisplays() {
    // Temperature
    let tempC = parseFloat(document.getElementById('temp-value').dataset.celsius);
    let feelsC = parseFloat(document.getElementById('feels-like-value').dataset.celsius);
    if (!isNaN(tempC)) {
        if (tempUnit === 'imperial') {
            document.getElementById('temp-value').textContent = `${Math.round(cToF(tempC))}°F`;
        } else {
            document.getElementById('temp-value').textContent = `${Math.round(tempC)}°C`;
        }
    }
    if (!isNaN(feelsC)) {
        if (tempUnit === 'imperial') {
            document.getElementById('feels-like-value').textContent = `${Math.round(cToF(feelsC))}°F`;
        } else {
            document.getElementById('feels-like-value').textContent = `${Math.round(feelsC)}°C`;
        }
    }

    // Distance
    let visKm = parseFloat(document.getElementById('visibility-value').dataset.km);
    if (!isNaN(visKm)) {
        if (distanceUnit === 'km') {
            document.getElementById('visibility-value').textContent = `${visKm} km`;
        } else if (distanceUnit === 'mi') {
            document.getElementById('visibility-value').textContent = `${(kmToMi(visKm)).toFixed(2)} mi`;
        } else if (distanceUnit === 'm') {
            document.getElementById('visibility-value').textContent = `${kmToM(visKm)} m`;
        }
    }

    // WindSpeed
    let windMs = parseFloat(document.getElementById('wind-value').dataset.ms);
    if (!isNaN(windMs)) {
        if (windUnit === 'm/s') {
            document.getElementById('wind-value').textContent = `${windMs.toFixed(2)} m/s`;
        } else if (windUnit === 'km/h') {
            document.getElementById('wind-value').textContent = `${msToKmh(windMs).toFixed(2)} km/h`;
        } else if (windUnit === 'knots') {
            document.getElementById('wind-value').textContent = `${msToKnots(windMs).toFixed(2)} knots`;
        }
    }
    //Hourly forecast temperatures
    document.querySelectorAll('.hourly-forecast .value').forEach(span => {
        let c = parseFloat(span.dataset.celsius);
        if (!isNaN(c)) {
            span.textContent = tempUnit === 'imperial'
                ? `${Math.round(cToF(c))}°F`
                : `${Math.round(c)}°C`;
        }
    });

    //7-day forecast temperatures
    document.querySelectorAll('.weekly-forecast .value').forEach(span => {
        let c = parseFloat(span.dataset.celsius);
        if (!isNaN(c)) {
            span.textContent = tempUnit === 'imperial'
                ? `${Math.round(cToF(c))}°F`
                : `${Math.round(c)}°C`;
        }
    });

    document.querySelectorAll('#recentSearchesList .value').forEach(span => {
  let c = parseFloat(span.dataset.celsius);
  updateRecentSearchTemp(span, c);
});
}


inputBox.addEventListener("focus", function() {
  inputBox.value = ""; // Clear the input box when focused
});


cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
       if(inputBox.value === "") {
        alert("Please enter a City Name.");
       }
       else{
          getCityCoordinates();
          }
  }});


window.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!navigator.geolocation) {
      inputBox.value = "ernakulam";
      getCityCoordinates();
      return;
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
    const data = await response.json();

    if (data && data[0] && data[0].name) {
      const { name } = data[0];
      inputBox.value = name;
    } else {
      inputBox.value = "ernakulam";
    }

    getCityCoordinates();
  } catch (error) {
    inputBox.value = "ernakulam";
    getCityCoordinates();
  }
});

document.getElementById('tempUnit').addEventListener('change', function() {
    tempUnit = this.value;
    updateUnitDisplays();
});
document.getElementById('distanceUnit').addEventListener('change', function() {
    distanceUnit = this.value;
    updateUnitDisplays();
});
document.getElementById('windUnit').addEventListener('change', function() {
    windUnit = this.value;
    updateUnitDisplays();
});


// MAP
function initMap() {
  const map = L.map('map', {
        minZoom: 2,
        maxBounds: [
            [-90, -180],
            [90, 180]
        ],
        maxBoundsViscosity: 1.0 
    }).setView([20.5937, 78.9629], 5);

  // Base map
  const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Weather overlays
  const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: 'Temp © OpenWeatherMap',
    opacity: 0.5
  });

  const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: 'Clouds © OpenWeatherMap',
    opacity: 0.5
  });

  const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: 'Wind © OpenWeatherMap',
    opacity: 0.5
  });

  const precipLayer = L.tileLayer(`https://tile.openweathermap.org/map/precip_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: 'Precipitation © OpenWeatherMap',
    opacity: 0.5
  });

  //default
  tempLayer.addTo(map);

  //layer control
  const overlays = {
    "Temperature": tempLayer,
    "Clouds": cloudsLayer,
    "Wind": windLayer,
    "Precipitation": precipLayer
  };

  L.control.layers(null, overlays, { position: 'topright', collapsed: false }).addTo(map);

   map.on('click', async function (e) {
    const { lat, lng } = e.latlng;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const weatherInfo = `
        <strong>${data.name || "Selected Location"}</strong><br>
        Weather: ${data.weather[0].description}<br>
        Temp: ${data.main.temp}°C<br>
        Feels Like: ${data.main.feels_like}°C<br>
        Humidity: ${data.main.humidity}%<br>
        Wind Speed: ${(data.wind.speed*3.6).toFixed(2)} km/hr`;

      L.popup()
        .setLatLng([lat, lng])
        .setContent(weatherInfo)
        .openOn(map);

    } catch (err) {
      console.error("Error fetching weather data:", err);
      L.popup()
        .setLatLng([lat, lng])
        .setContent("Unable to fetch weather data.")
        .openOn(map);
    }
  });
}


document.getElementById('darkModeToggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// adjust the nav bar when viewing map
const nav = document.querySelector('nav');
const mapSection = document.getElementById('Map');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && document.body.classList.contains('dark-mode')) {
      nav.classList.add('map-visible');
    } else {
      nav.classList.remove('map-visible');
    }
  });
}, { threshold: 0.3 }); 

observer.observe(mapSection);