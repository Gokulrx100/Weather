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

  // Your API Key
  const apiKey = '764bfa463166ebe1068d27c1d711541b';

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


