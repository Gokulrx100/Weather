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
}


const inputBox= document.getElementById("cityInput");

function getWeatherDetails(name, lat, lon, country, state) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  return fetch(url)
    .then(response => response.json())
    .then(data => {
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
        Precipitation: data.rain?.["1h"] || 0,
      };
      document.getElementById('temp-value').textContent = weatherDetails.temperature !== undefined ? `${Math.round(weatherDetails.temperature)}°C` : '--';
      document.getElementById('feels-like-value').textContent = weatherDetails.feelsLike !== undefined ? `${Math.round(weatherDetails.feelsLike)}°C` : '--';
      document.getElementById('humidity-value').textContent = weatherDetails.humidity !== undefined ? `${weatherDetails.humidity}%` : '--';
      document.getElementById('pressure-value').textContent = weatherDetails.pressure !== undefined ? `${weatherDetails.pressure} hPa` : '--';
      document.getElementById('wind-value').textContent = weatherDetails.windSpeed !== undefined ? `${(weatherDetails.windSpeed*3.6).toFixed(2)} km/hr`: '--';
      document.getElementById('visibility-value').textContent = weatherDetails.visibility !== undefined ? `${weatherDetails.visibility / 1000} km` : '--';
      document.getElementById('precipitation-value').textContent = weatherDetails.Precipitation !== undefined ? `${weatherDetails.Precipitation} mm` : '--';

      return weatherDetails;
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      [
        'temp-value', 'feels-like-value', 'humidity-value', 'pressure-value',
        'wind-value', 'visibility-value', 'precipitation-value'
      ].forEach(id => document.getElementById(id).textContent = '--');
      return null;
    });
}


function getAirQuality(lat, lon) {
  const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const aqi = data.list?.[0]?.main?.aqi || null;
      console.log("Air Quality Index:", aqi);
      document.getElementById('air-quality-value').textContent = aqi !== null ? aqi : '--';
      return aqi;
    })
    .catch(error => {
      console.error("Error fetching air quality data:", error);
      return null;
    });
}

function getForecastDetails(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=5`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];
      const desiredHours = ["06:00:00", "09:00:00", "12:00:00", "15:00:00", "18:00:00","21:00:00"];

      const filteredForecasts = data.list.filter(item => {
        return item.dt_txt.startsWith(today) && desiredHours.includes(item.dt_txt.split(' ')[1]);
      }).map(item => ({
        time: item.dt_txt,
        temperature: item.main.temp,
        icon: item.weather[0].icon
      }));
      console.log("Filtered Forecasts:", filteredForecasts);
      const forecastItems = document.querySelectorAll('.hourly-forecast li');
      forecastItems.forEach(li => {
        li.querySelector('.value').textContent = '--';
        li.querySelector('img').src = '';
        li.querySelector('img').alt = '';
      });
      filteredForecasts.forEach((item, idx) => {
        if (forecastItems[idx]) {
          forecastItems[idx].querySelector('.time').textContent = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          forecastItems[idx].querySelector('.value').textContent = `${Math.round(item.temperature)}°C`;
          // Update icon
          forecastItems[idx].querySelector('img').src = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
          forecastItems[idx].querySelector('img').alt = item.icon;
        }
      });

      return filteredForecasts;
    })
    .catch(error => {
      console.error("Error fetching forecast data:", error);
      // Optionally reset values on error
      document.querySelectorAll('.hourly-forecast li').forEach(li => {
        li.querySelector('.value').textContent = '--';
        li.querySelector('img').src = '';
        li.querySelector('img').alt = '';
      });
      return [];
    });
}


function getCurrentUVIndex(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const uvIndex = data.current?.uv_index ?? null;
      document.getElementById('uv-index-value').textContent = uvIndex !== null ? uvIndex : '--';
      console.log("UV Index:", uvIndex);
      return uvIndex;
    })
    .catch(error => {
      console.error("Error fetching UV Index:", error);
      return null;
    });
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




function getCityCoordinates() {
  let cityName = inputBox.value.trim();
  // inputBox.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(GEOCODING_API_URL).then(res=>res.json()).then(data => {
    console.log(data);
    let {name,lat,lon,country,state}= data[0];
    getWeatherDetails(name, lat, lon, country, state);
    getAirQuality(lat, lon);
    getForecastDetails(lat, lon);
    getCurrentUVIndex(lat, lon);
    getSevenDayForecast(lat, lon);

}).catch(() => { alert(`Failed to fetch coordinates for ${cityName}. Please try again.`); });
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

window.addEventListener('DOMContentLoaded', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Use OpenWeatherMap reverse geocoding to get city name
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0] && data[0].name) {
              const { name, country, state } = data[0];
              inputBox.value = name;
              getCityCoordinates();
            }
          })
          .catch(() => {
            inputBox.value = "ernakulam"; getCityCoordinates();
          });
      },
      error => {
        inputBox.value = "ernakulam"; getCityCoordinates();
      }
    );
  } else {
    inputBox.value = "ernkaulam"; getCityCoordinates();
  }
});