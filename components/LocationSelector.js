/**
 * LocationSelector Component
 * Handles geolocation and manual city input
 */

'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from '@/hooks/useLocation';
import { loadLocationFromStorage } from '@/store/locationSlice';

export default function LocationSelector() {
  const dispatch = useDispatch();
  const { city, loading, error } = useSelector((state) => state.location);
  const [cityInput, setCityInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { requestGeolocation, setManualLocation, permissionDenied } = useLocation();

  useEffect(() => {
    dispatch(loadLocationFromStorage());
  }, [dispatch]);

  const handleGeolocationClick = () => {
    requestGeolocation();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setManualLocation(cityInput);
      setShowInput(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Location</h2>

      {city && !showInput && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <span className="text-lg font-medium">{city}</span>
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Change
          </button>
        </div>
      )}

      {(!city || showInput) && (
        <div className="space-y-4">
          {!permissionDenied && (
            <button
              onClick={handleGeolocationClick}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Getting location...' : '📍 Use My Location'}
            </button>
          )}

          <div className="text-center text-gray-500 text-sm">or</div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name (e.g., Calgary)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Set
            </button>
          </form>

          {showInput && (
            <button
              onClick={() => setShowInput(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
