/**
 * Weather Client Module
 * Functions for parsing and processing OpenWeather API responses
 */

/**
 * Parse current weather data from OpenWeather API
 * @param {Object} data - Raw API response
 * @returns {Object} Parsed weather data
 */
export function parseCurrentWeather(data) {
  if (!data) return null;

  return {
    temperature: data.main?.temp || 0,
    feelsLike: data.main?.feels_like || 0,
    humidity: data.main?.humidity || 0,
    pressure: data.main?.pressure || 0,
    weather: data.weather || [],
    description: data.weather?.[0]?.description || 'Unknown',
    icon: data.weather?.[0]?.icon || '01d',
    windSpeed: data.wind?.speed || 0,
    clouds: data.clouds?.all || 0,
    visibility: data.visibility || 0,
    timestamp: data.dt ? new Date(data.dt * 1000) : new Date(),
    location: {
      name: data.name || 'Unknown',
      country: data.sys?.country || '',
      lat: data.coord?.lat || 0,
      lon: data.coord?.lon || 0,
    },
  };
}

/**
 * Parse forecast data from OpenWeather API
 * @param {Object} data - Raw API forecast response
 * @returns {Object} Parsed forecast data
 */
export function parseForecastData(data) {
  if (!data || !data.list) return null;

  return {
    list: data.list,
    city: {
      name: data.city?.name || 'Unknown',
      country: data.city?.country || '',
      lat: data.city?.coord?.lat || 0,
      lon: data.city?.coord?.lon || 0,
    },
  };
}

/**
 * Extract snow forecast from forecast data
 * @param {Object} forecast - Parsed forecast data
 * @param {number} hours - Hours to look ahead (default 48)
 * @returns {boolean} True if snow expected
 */
export function hasSnowInForecast(forecast, hours = 48) {
  if (!forecast || !forecast.list) return false;

  const now = Date.now();
  const futureTime = now + (hours * 60 * 60 * 1000);

  return forecast.list.some(item => {
    const itemTime = new Date(item.dt * 1000).getTime();
    if (itemTime > futureTime) return false;

    return item.weather?.some(w =>
      w.main === 'Snow' || w.description?.toLowerCase().includes('snow')
    );
  });
}

/**
 * Count freeze days in forecast
 * @param {Object} forecast - Parsed forecast data
 * @returns {number} Number of days with freezing temps
 */
export function countFreezeDays(forecast) {
  if (!forecast || !forecast.list) return 0;

  const processedDays = new Set();
  let count = 0;

  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!processedDays.has(date) && item.main?.temp < 0) {
      count++;
      processedDays.add(date);
    }
  });

  return count;
}

/**
 * Get weather icon URL
 * @param {string} iconCode - OpenWeather icon code
 * @returns {string} Icon URL
 */
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Format temperature with unit
 * @param {number} temp - Temperature in Celsius
 * @param {boolean} includeUnit - Include °C unit
 * @returns {string} Formatted temperature
 */
export function formatTemperature(temp, includeUnit = true) {
  const rounded = Math.round(temp);
  return includeUnit ? `${rounded}°C` : `${rounded}`;
}
