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
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
//   return fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       const weatherDetails = {
//         cityName: data.name,
//         country: data.sys?.country,
//         temperature: data.main?.temp,
//         feelsLike: data.main?.feels_like,
//         humidity: data.main?.humidity,
//         pressure: data.main?.pressure,
//         windSpeed: data.wind?.speed,
//         visibility: data.visibility,
//         weatherDescription: data.weather?.[0]?.description,
//         Precepitation: data.rain?.["1h"] || 0,
//       };

//       console.log(weatherDetails);
//       return weatherDetails;
//     })
//     .catch(error => {
//       console.error("Error fetching weather data:", error);
//       return null;
//     });
// }
      let FORECAST_API_URL= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
      ,WEATHER_API_URL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      days=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);
      }).catch(() => { alert(`Failed to fetch weather data for ${name}. Please try again.`); });
}



function getCityCoordinates() {
  let cityName = inputBox.value.trim();
  inputBox.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(GEOCODING_API_URL).then(res=>res.json()).then(data => {
    console.log(data);
    let {name,lat,lon,country,state}= data[0];
    getWeatherDetails(name, lat, lon, country, state);

}).catch(() => { alert(`Failed to fetch coordinates for ${cityName}. Please try again.`); });
}

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
