const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Forecast fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const response = await axios.get(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Air quality fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

router.get('/forecast7', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const response = await axios.get(
      `${BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('7-day forecast fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch 7-day forecast data' });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Missing city parameter' });
    }

    const response = await axios.get(
      `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
});

router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing lat or lon' });
    }

    const response = await axios.get(
      `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Reverse geocoding fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reverse geocoding data' });
  }
});

router.get('/map-key', (req, res) => {
  res.json({ apiKey: API_KEY });
});

module.exports = router;