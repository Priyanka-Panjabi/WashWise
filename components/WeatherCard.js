/**
 * WeatherCard Component
 * Displays current weather information
 */

'use client';

import { useSelector } from 'react-redux';
import { parseCurrentWeather, getWeatherIconUrl, formatTemperature } from '@/lib/weatherClient';
import { formatDate } from '@/lib/utils';

export default function WeatherCard() {
  const { current, lastUpdated, loading } = useSelector((state) => state.weather);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No weather data available</p>
      </div>
    );
  }

  const weather = parseCurrentWeather(current);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
      <div className="flex items-center justify-between gap-6">
        {/* Location & Temperature */}
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">
            {formatTemperature(weather.temperature)}
          </div>
          {weather.icon && (
            <img
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
              className="w-12 h-12"
            />
          )}
          <div>
            <h2 className="text-sm font-medium opacity-90">
              {weather.location.name}
              {weather.location.country && `, ${weather.location.country}`}
            </h2>
            <p className="text-sm capitalize opacity-90">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Temperature Details */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-xs opacity-75">Feels Like</p>
            <p className="text-base font-semibold">
              {formatTemperature(weather.feelsLike)}
            </p>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <p className="text-xs opacity-75">Humidity</p>
            <p className="text-base font-semibold">{weather.humidity}%</p>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <p className="text-xs opacity-75">Wind</p>
            <p className="text-base font-semibold">{weather.windSpeed} m/s</p>
          </div>
          {lastUpdated && (
            <>
              <div className="h-6 w-px bg-white/20"></div>
              <p className="text-xs opacity-75">
                {formatDate(lastUpdated)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
