/**
 * useLocation Hook
 * Handles geolocation API and location management
 */

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation, setLocationError, setLocationLoading } from '@/store/locationSlice';
import { GEOLOCATION_OPTIONS } from '@/constants';

export function useLocation() {
  const dispatch = useDispatch();
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setLocationError('Geolocation is not supported by your browser'));
      setPermissionDenied(true);
      return;
    }

    dispatch(setLocationLoading(true));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({
          lat: latitude,
          lon: longitude,
          city: null,
        }));
        dispatch(setLocationLoading(false));
        setPermissionDenied(false);
      },
      (error) => {
        let errorMessage = 'Failed to get location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            setPermissionDenied(true);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Unknown location error';
        }

        dispatch(setLocationError(errorMessage));
        dispatch(setLocationLoading(false));
      },
      GEOLOCATION_OPTIONS
    );
  }, [dispatch]);

  const setManualLocation = useCallback((city) => {
    if (!city || city.trim() === '') {
      dispatch(setLocationError('Please enter a valid city name'));
      return;
    }

    dispatch(setLocation({
      lat: null,
      lon: null,
      city: city.trim(),
    }));
    setPermissionDenied(false);
  }, [dispatch]);

  return {
    requestGeolocation,
    setManualLocation,
    permissionDenied,
  };
}
