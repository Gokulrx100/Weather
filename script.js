const apiKey = '764bfa463166ebe1068d27c1d711541b';

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



// map
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
      Precipitation: data.rain?.["1h"] || 0,
    };
    console.log("Weather Details:", weatherDetails);
    document.getElementById('temp-value').textContent = weatherDetails.temperature !== undefined ? `${Math.round(weatherDetails.temperature)}°C` : '--';
    document.getElementById('feels-like-value').textContent = weatherDetails.feelsLike !== undefined ? `${Math.round(weatherDetails.feelsLike)}°C` : '--';
    document.getElementById('humidity-value').textContent = weatherDetails.humidity !== undefined ? `${weatherDetails.humidity}%` : '--';
    document.getElementById('pressure-value').textContent = weatherDetails.pressure !== undefined ? `${weatherDetails.pressure} hPa` : '--';
    document.getElementById('wind-value').textContent = weatherDetails.windSpeed !== undefined ? `${(weatherDetails.windSpeed*3.6).toFixed(2)} km/hr`: '--';
    document.getElementById('visibility-value').textContent = weatherDetails.visibility !== undefined ? `${weatherDetails.visibility / 1000} km` : '--';
    document.getElementById('precipitation-value').textContent = weatherDetails.Precipitation !== undefined ? `${weatherDetails.Precipitation} mm` : '--';
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
        forecastItems[idx].querySelector('img').src =
          `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
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
      } else {
        li.querySelector('.day-name').textContent = '--';
        li.querySelector('img').src = '';
        li.querySelector('img').alt = '';
        li.querySelector('.value').textContent = '--';
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


function addRecentSearch(city, iconUrl, temp) {
  const list = document.getElementById('recentSearchesList');
  const exists = Array.from(list.querySelectorAll('.city-name')).some(
    span => span.textContent.trim().toLowerCase() === city.trim().toLowerCase()
  );
  if (exists) return;
  
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="city-name">${city}</span><br>
    <img src="${iconUrl}" alt="icon" /><br>
    <span class="value">${temp}</span>
  `;
  list.insertBefore(li, list.firstChild);

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

    if(weather){
      const iconUrl= `https://openweathermap.org/img/wn/${weather.icon ? weather.icon : "01d"}@2x.png`;
      const temp = weather.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : '--';
      addRecentSearch(name, iconUrl, temp);
    }
  } catch (error) {
    alert(`Failed to fetch coordinates for ${cityName}. Please try again.`);
  }
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