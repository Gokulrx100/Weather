<div align="center">

# 🌦️ Weather Dashboard

> A full-stack, modern weather application with comprehensive forecasting, interactive maps, and intelligent data visualization.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue)](https://expressjs.com/)
[![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange)](https://openweathermap.org/api)

</div>

---

## 📋 Table of Contents

- [🎯 Section 1: User Perspective](#-section-1-user-perspective)
  - [Features Overview](#features-overview)
  - [User Interface Guide](#user-interface-guide)
  - [Getting Started](#getting-started)
- [⚙️ Section 2: Developer Perspective](#️-section-2-developer-perspective)
  - [API Schema & Endpoints](#api-schema--endpoints)
  - [Development Setup](#development-setup)
  - [Code Structure](#code-structure)
  - [Deployment Guide](#deployment-guide)

---

## 🎯 Section 1: User Perspective

### ✨ Features Overview

<details>
<summary><strong>🌡️ Comprehensive Weather Data</strong></summary>

- **Real-time Current Weather**: Temperature, humidity, pressure, wind speed, visibility
- **Advanced Metrics**: Air quality index (AQI), UV index, precipitation levels
- **Hourly Forecasts**: Next 4 hours with detailed weather conditions
- **7-Day Extended Forecast**: Weekly outlook with daily temperature ranges
- **Weather Icons**: Dynamic visual representations of weather conditions

</details>

<details>
<summary><strong>🗺️ Interactive Weather Map</strong></summary>

- **Global Weather Visualization**: Click anywhere on the world map for instant weather data
- **Weather Overlay Layers**: 
  - 🌡️ Temperature gradients
  - ☁️ Cloud coverage
  - 💨 Wind patterns
  - 🌧️ Precipitation intensity
- **Real-time Data**: Map data updates with current weather conditions

</details>

<details>
<summary><strong>⚙️ Customization & Personalization</strong></summary>

- **Multi-Unit Support**:
  - Temperature: Celsius (°C) / Fahrenheit (°F)
  - Distance: Kilometers / Miles / Meters
  - Wind Speed: m/s / km/h / knots
- **Theme Options**: Light mode and dark mode with custom backgrounds
- **Recent Searches**: Quick access to previously searched locations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

</details>

### 🎮 User Interface Guide

#### Navigation Structure
```
┌─────────────────────────────────────┐
│  🌦️ Weather  │  🗺️ Map  │  ⚙️ Settings  │
├─────────────────────────────────────┤
│                                     │
│  [Search Bar: "Enter city name"]    │
│                                     │
│  ┌─────────────┬─────────────────┐   │
│  │   TODAY'S   │    7-DAY        │   │
│  │  FORECAST   │   FORECAST      │   │
│  │             │                 │   │
│  │ [Hourly]    │ [Mon][Tue][Wed] │   │
│  │             │ [Thu][Fri][Sat] │   │
│  │             │ [Sun]           │   │
│  ├─────────────┤                 │   │
│  │    AIR      │                 │   │
│  │ CONDITIONS  │                 │   │
│  │             │                 │   │
│  │ • Temp      │   [Recent       │   │
│  │ • Humidity  │    Searches]    │   │
│  │ • Wind      │                 │   │
│  │ • UV Index  │                 │   │
│  └─────────────┴─────────────────┘   │
└─────────────────────────────────────┘
```

#### Quick Start Actions

1. **🔍 Search for Weather**
   ```
   Type city name → Press Enter → View comprehensive weather data
   ```

2. **🎨 Customize Experience**
   ```
   Settings → Theme (Light/Dark) → Units (°C/°F, km/mi, etc.)
   ```

3. **🗺️ Explore Map**
   ```
   Map Tab → Click anywhere → Get instant location weather
   ```

4. **📱 Access Recent Searches**
   ```
   Click any recent city → Instantly reload weather data
   ```

### 🚀 Getting Started

#### Quick Setup (3 Steps)

1. **📥 Download & Extract**
   ```bash
   # Clone repository
   git clone https://github.com/Gokulrx100/Weather.git
   cd Weather
   ```

2. **🔧 Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **🌐 Launch Application**
   ```bash
   npm start
   # Open browser to http://localhost:3000
   ```

#### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## ⚙️ Section 2: Developer Perspective
### 📡 API Schema & Endpoints

#### Core Weather Endpoints

<details>
<summary><strong>GET /api/weather/current</strong> - Current Weather Data</summary>

**Parameters:**
```typescript
{
  lat: number;  // Latitude (-90 to 90)
  lon: number;  // Longitude (-180 to 180)
}
```

**Response Schema:**
```typescript
{
  coord: { lon: number, lat: number },
  weather: [{
    id: number,
    main: string,
    description: string,
    icon: string
  }],
  main: {
    temp: number,      // Temperature in Celsius
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,  // hPa
    humidity: number   // %
  },
  wind: {
    speed: number,     // m/s
    deg: number        // degrees
  },
  visibility: number,  // meters
  name: string         // City name
}
```

**Example Request:**
```bash
curl "http://localhost:3000/api/weather/current?lat=40.7128&lon=-74.0060"
```

</details>

<details>
<summary><strong>GET /api/weather/forecast</strong> - 5-Day Hourly Forecast</summary>

**Parameters:**
```typescript
{
  lat: number;
  lon: number;
}
```

**Response Schema:**
```typescript
{
  list: [{
    dt: number,        // Unix timestamp
    dt_txt: string,    // "2024-01-01 12:00:00"
    main: {
      temp: number,
      humidity: number,
      pressure: number
    },
    weather: [{
      icon: string,
      description: string
    }]
  }],
  city: {
    name: string,
    timezone: number   // Offset in seconds
  }
}
```

</details>

<details>
<summary><strong>GET /api/weather/forecast7</strong> - 7-Day Daily Forecast</summary>

**Requirements:** OpenWeatherMap paid/student plan

**Response Schema:**
```typescript
{
  list: [{
    dt: number,
    temp: {
      day: number,
      min: number,
      max: number,
      night: number,
      eve: number,
      morn: number
    },
    weather: [{
      main: string,
      description: string,
      icon: string
    }],
    humidity: number,
    pressure: number,
    wind_speed: number
  }]
}
```

</details>

#### Utility Endpoints

| Endpoint | Purpose | Parameters |
|----------|---------|------------|
| `/api/weather/air-quality` | AQI data | `lat`, `lon` |
| `/api/weather/geocode` | City → Coordinates | `city` |
| `/api/weather/reverse-geocode` | Coordinates → City | `lat`, `lon` |
| `/api/weather/map-key` | API key for map tiles | None |

### 🛠️ Development Setup

#### Environment Configuration

1. **Create `.env` file in `/backend`:**
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

2. **Install Dependencies:**
   ```bash
   # Backend dependencies
   cd backend
   npm install express cors dotenv axios
   
   # Development dependencies (optional)
   npm install --save-dev nodemon
   ```

3. **Development Scripts:**
   ```json
   {
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js",
       "test": "echo \"No tests specified\""
     }
   }
   ```

#### Project Structure

```
Weather/
├── 📁 backend/
│   ├── 📄 index.js              # Express server setup
│   ├── 📁 routes/
│   │   └── 📄 weather.js        # Weather API routes
│   ├── 📄 package.json          # Backend dependencies
│   └── 📄 .env                  # Environment variables
├── 📁 frontend/
│   ├── 📄 index.html            # Main HTML structure
│   ├── 📄 style.css             # Responsive styling + themes
│   ├── 📄 script.js             # Frontend logic & API calls
│   └── 📁 assets/               # Images & icons
│       ├── 🖼️ bg.jpg
│       ├── 🖼️ drakBg2.jpg
│       ├── 🖼️ umbrella.png
│       ├── 🖼️ map.png
│       └── 🖼️ settings.png
└── 📄 README.md                 # This documentation
```

### 💻 Code Structure

#### Frontend Architecture

**Modular JavaScript Design:**
```javascript
// Core modules
const UnitConverter = { /* Unit conversion utilities */ };
const AppState = { /* Application state management */ };
const WeatherAPI = { /* API communication layer */ };
const UIUpdater = { /* DOM manipulation & updates */ };
const RecentSearches = { /* Local storage management */ };
const AppController = { /* Main application controller */ };
```

**Key Design Patterns:**
- **Module Pattern**: Organized code into logical modules
- **Observer Pattern**: State changes trigger UI updates
- **API Layer**: Centralized external API communication
- **Event-Driven**: User interactions handled through event listeners

#### Backend Architecture

**Express.js Route Structure:**
```javascript
// Weather routes (/api/weather)
router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/forecast7', getSevenDayForecast);
router.get('/air-quality', getAirQuality);
router.get('/geocode', geocodeCity);
router.get('/reverse-geocode', reverseGeocode);
router.get('/map-key', getMapKey);
```

**Security Features:**
- ✅ CORS enabled for cross-origin requests
- ✅ API key stored in environment variables
- ✅ Input validation for all endpoints
- ✅ Error handling with appropriate HTTP status codes

### 🔧 Configuration Options

#### Frontend Customization

**Theme Configuration:**
```css
/* Light theme variables */
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --accent-color: #007bff;
}

/* Dark theme variables */
.dark-mode {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #4dabf7;
}
```

**Unit System Configuration:**
```javascript
const AppState = {
  tempUnit: 'metric',      // 'metric' | 'imperial'
  distanceUnit: 'km',      // 'km' | 'mi' | 'm'
  windUnit: 'km/h'         // 'm/s' | 'km/h' | 'knots'
};
```

#### Backend Configuration

**API Rate Limiting (Optional):**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 🚀 Deployment Guide

#### Local Development
```bash
# Start development server
cd backend
npm run dev  # Uses nodemon for auto-restart
```

#### Production Deployment

**Vercel Deployment:**
```json
{
  "version": 2,
  "builds": [
    { "src": "backend/index.js", "use": "@vercel/node" },
    { "src": "frontend/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/index.js" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

**Environment Variables for Production:**
```env
OPENWEATHER_API_KEY=your_production_api_key
NODE_ENV=production
PORT=3000
```

#### Performance Optimizations

- **Frontend**: Minified CSS/JS, compressed images
- **Backend**: Gzip compression, response caching
- **API**: Efficient data processing, error handling
- **Security**: HTTPS enforced, API key protection

### 🧪 Testing & Debugging

#### API Testing
```bash
# Test current weather endpoint
curl "http://localhost:3000/api/weather/current?lat=40.7128&lon=-74.0060"

# Test forecast endpoint
curl "http://localhost:3000/api/weather/forecast?lat=40.7128&lon=-74.0060"
```

#### Browser Developer Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls and response times
- **Application**: Inspect local storage for recent searches

### 📊 Analytics & Monitoring

**Potential Monitoring Points:**
- API response times
- Error rates by endpoint
- User interaction patterns
- Geographic distribution of searches

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 🙏 Acknowledgments

- **APIs**: [OpenWeatherMap](https://openweathermap.org/api)
- **Icons**: [Material Icons](https://fonts.google.com/icons)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

---

## 📞 Support

For questions or support:
- 📧 **Email**: [gokulkrishnakumar04@example.com](mailto:gokulkrishnakumar04@example.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Gokulrx100/Weather/issues)

---

<div align="center">

[⬆️ Back to Top](#️-weather-dashboard)

</div>