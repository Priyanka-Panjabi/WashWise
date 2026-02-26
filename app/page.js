/**
 * Main Dashboard Page
 * Integrates all components into a cohesive interface
 */

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '@/store/weatherSlice';
import LocationSelector from '@/components/LocationSelector';
import WashTrackerCard from '@/components/WashTrackerCard';
import WeatherCard from '@/components/WeatherCard';
import RecommendationBadge from '@/components/RecommendationBadge';
import SaltRiskMeter from '@/components/SaltRiskMeter';
import CostAnalyzer from '@/components/CostAnalyzer';

export default function Dashboard() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const { current, error: weatherError } = useSelector((state) => state.weather);

  useEffect(() => {
    if ((location.lat && location.lon) || location.city) {
      dispatch(fetchWeather({
        lat: location.lat,
        lon: location.lon,
        city: location.city,
      }));
    }
  }, [location.lat, location.lon, location.city, dispatch]);

  const hasLocation = location.lat || location.city;
  const hasWeather = current !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚗 WashWise
          </h1>
          <p className="text-gray-600">
            Your Weather-Smart Car Wash Assistant
          </p>
        </header>

        <div className="grid gap-6">
          <LocationSelector />

          {/* Wash Tracker Card */}
          <WashTrackerCard />

          {hasLocation && (
            <>
              <WeatherCard />

              {weatherError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">Weather Error</p>
                  <p className="text-red-700 text-sm mt-1">{weatherError}</p>
                </div>
              )}

              {hasWeather && (
                <>
                  <RecommendationBadge />

                  <div className="grid md:grid-cols-2 gap-6">
                    <SaltRiskMeter />
                    <CostAnalyzer />
                  </div>
                </>
              )}
            </>
          )}

          {!hasLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to WashWise!
              </h2>
              <p className="text-gray-600">
                Set your location above to get personalized car wash recommendations
                based on weather conditions and salt corrosion risk.
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Weather data provided by OpenWeather API
          </p>
          <p className="mt-2">
            Built for cold-weather cities like Calgary, Canada
          </p>
        </footer>
      </div>
    </div>
  );
}
