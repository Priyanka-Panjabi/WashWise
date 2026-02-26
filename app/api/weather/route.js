/**
 * Weather API Route
 * Server-side proxy for OpenWeather API
 * Keeps API key secure and handles errors gracefully
 */

import { NextResponse } from 'next/server';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock data for testing (Calgary, winter conditions)
const MOCK_CURRENT_WEATHER = {
  coord: { lon: -114.0719, lat: 51.0447 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  base: 'stations',
  main: {
    temp: -8.5,
    feels_like: -14.2,
    temp_min: -10.0,
    temp_max: -6.0,
    pressure: 1025,
    humidity: 65
  },
  visibility: 10000,
  wind: {
    speed: 3.5,
    deg: 270
  },
  clouds: {
    all: 10
  },
  dt: Math.floor(Date.now() / 1000),
  sys: {
    type: 1,
    id: 954,
    country: 'CA',
    sunrise: Math.floor(Date.now() / 1000) - 7200,
    sunset: Math.floor(Date.now() / 1000) + 14400
  },
  timezone: -25200,
  id: 5913490,
  name: 'Calgary',
  cod: 200
};

const MOCK_FORECAST = {
  cod: '200',
  message: 0,
  cnt: 40,
  list: [
    // Today - clear
    {
      dt: Math.floor(Date.now() / 1000) + 10800,
      main: { temp: -7.0, feels_like: -12.0, temp_min: -7.5, temp_max: -7.0, pressure: 1025, humidity: 60 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 5 },
      wind: { speed: 2.5, deg: 250 },
      visibility: 10000,
      pop: 0,
      dt_txt: new Date(Date.now() + 10800000).toISOString().replace('T', ' ').slice(0, -5)
    },
    // Tomorrow - snow expected (triggers "Wait" recommendation)
    {
      dt: Math.floor(Date.now() / 1000) + 86400,
      main: { temp: -5.0, feels_like: -9.0, temp_min: -6.0, temp_max: -5.0, pressure: 1018, humidity: 75 },
      weather: [{ id: 600, main: 'Snow', description: 'light snow', icon: '13d' }],
      clouds: { all: 90 },
      wind: { speed: 3.0, deg: 180 },
      visibility: 5000,
      pop: 0.8,
      snow: { '3h': 2.5 },
      dt_txt: new Date(Date.now() + 86400000).toISOString().replace('T', ' ').slice(0, -5)
    },
    // Day 2 - freeze conditions
    {
      dt: Math.floor(Date.now() / 1000) + 172800,
      main: { temp: -12.0, feels_like: -18.0, temp_min: -13.0, temp_max: -12.0, pressure: 1028, humidity: 55 },
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      clouds: { all: 20 },
      wind: { speed: 4.0, deg: 320 },
      visibility: 10000,
      pop: 0.1,
      dt_txt: new Date(Date.now() + 172800000).toISOString().replace('T', ' ').slice(0, -5)
    },
    // Day 3 - clear and cold
    {
      dt: Math.floor(Date.now() / 1000) + 259200,
      main: { temp: -9.0, feels_like: -14.0, temp_min: -10.0, temp_max: -9.0, pressure: 1030, humidity: 50 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 0 },
      wind: { speed: 2.0, deg: 200 },
      visibility: 10000,
      pop: 0,
      dt_txt: new Date(Date.now() + 259200000).toISOString().replace('T', ' ').slice(0, -5)
    },
    // Day 4 - clear and cold
    {
      dt: Math.floor(Date.now() / 1000) + 345600,
      main: { temp: -6.0, feels_like: -10.0, temp_min: -7.0, temp_max: -6.0, pressure: 1025, humidity: 55 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 5 },
      wind: { speed: 2.5, deg: 270 },
      visibility: 10000,
      pop: 0,
      dt_txt: new Date(Date.now() + 345600000).toISOString().replace('T', ' ').slice(0, -5)
    }
  ],
  city: {
    id: 5913490,
    name: 'Calgary',
    coord: { lat: 51.0447, lon: -114.0719 },
    country: 'CA',
    population: 1019942,
    timezone: -25200,
    sunrise: Math.floor(Date.now() / 1000) - 7200,
    sunset: Math.floor(Date.now() / 1000) + 14400
  }
};

/**
 * GET /api/weather
 * Query params: lat, lon OR city
 */
export async function GET(request) {
  try {
    // Check for API key
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'OpenWeather API key not configured' },
        { status: 500 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    // Validate input
    if (!lat && !lon && !city) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat/lon or city' },
        { status: 400 }
      );
    }

    // Build query parameters
    const params = new URLSearchParams({
      appid: API_KEY,
      units: 'metric',
    });

    if (lat && lon) {
      params.append('lat', lat);
      params.append('lon', lon);
    } else if (city) {
      params.append('q', city);
    }

    // Use mock data if enabled or if API fails
    if (USE_MOCK_DATA) {
      console.log('⚠️  Using mock weather data (USE_MOCK_DATA=true)');
      return NextResponse.json({
        current: MOCK_CURRENT_WEATHER,
        forecast: MOCK_FORECAST,
        timestamp: new Date().toISOString(),
        mock: true
      });
    }

    // Fetch current weather
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?${params.toString()}`;
    const currentWeatherResponse = await fetch(currentWeatherUrl);

    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();

      // Fallback to mock data on API errors (like 401 invalid key)
      if (currentWeatherResponse.status === 401) {
        console.log('⚠️  API key invalid, using mock weather data as fallback');
        return NextResponse.json({
          current: MOCK_CURRENT_WEATHER,
          forecast: MOCK_FORECAST,
          timestamp: new Date().toISOString(),
          mock: true,
          warning: 'Using mock data - API key may need activation'
        });
      }

      return NextResponse.json(
        {
          error: errorData.message || 'Failed to fetch weather data',
          code: errorData.cod,
        },
        { status: currentWeatherResponse.status }
      );
    }

    const currentWeather = await currentWeatherResponse.json();

    // Fetch 5-day forecast using coordinates from current weather
    const forecastParams = new URLSearchParams({
      appid: API_KEY,
      units: 'metric',
      lat: currentWeather.coord.lat.toString(),
      lon: currentWeather.coord.lon.toString(),
    });

    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?${forecastParams.toString()}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      return NextResponse.json(
        {
          error: errorData.message || 'Failed to fetch forecast data',
          code: errorData.cod,
        },
        { status: forecastResponse.status }
      );
    }

    const forecast = await forecastResponse.json();

    // Return combined data
    return NextResponse.json({
      current: currentWeather,
      forecast: forecast,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
