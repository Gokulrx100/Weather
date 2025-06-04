# Weather Dashboard 🌦️

A modern, responsive weather dashboard web app built with HTML, CSS, and JavaScript.  
It provides real-time weather, air quality, UV index, hourly and 7-day forecasts, interactive map overlays, recent searches, and customizable units and theme.

---

## Features

- **Current Weather:**  
  Displays city name, temperature, feels like, humidity, pressure, wind speed, visibility, precipitation, weather icon, and description.

- **Air Quality & UV Index:**  
  Real-time AQI and UV index for the selected location.

- **Hourly & 7-Day Forecast:**  
  Next 4 hours and 7 days forecast with icons and temperature, all unit-convertible.

- **Interactive Map:**  
  Click anywhere on the map to get weather info for that location. Toggle overlays for temperature, clouds, wind, and precipitation.

- **Recent Searches:**  
  Quick access to previously searched cities, always shown in your selected units.

- **Unit Settings:**  
  Change temperature (°C/°F), distance (km/mi/m), and wind speed (m/s, km/h, knots) units. All displayed data updates instantly.

- **Theme Toggle:**  
  Switch between light and dark mode. Dark mode includes a custom background and color scheme.

- **Responsive Design:**  
  Works well on desktop and mobile.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, etc.)
- Internet connection (for API calls and map tiles)

### Setup

1. **Clone or Download the Repository**
2. **API Key:**  
   - This app uses [OpenWeatherMap](https://openweathermap.org/api) APIs.
   - Replace the `apiKey` variable in `script.js` with your own OpenWeatherMap API key.

3. **Run Locally:**  
   - Open `index.html` in your browser.

---

## File Structure

```
Weather/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── bg.jpg
│   └── drakBg2.jpg
│   └── umbrella.png
│   └── map.png
│   └── settings.png
```

---

## Usage

- **Search for a city:** Enter a city name and press Enter.
- **Switch units:** Go to Settings → Units and select your preferred units.
- **Toggle theme:** Go to Settings → Theme and use the toggle switch.
- **Map:** Click on the Map tab and click anywhere to get weather info for that spot.
- **Recent Searches:** Click a recent city to reload its weather.

---

## Credits

- [OpenWeatherMap API](https://openweathermap.org/api)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet.js](https://leafletjs.com/) for interactive maps
- Weather icons from OpenWeatherMap

---

## License

This project is for educational and personal use.

---