/**
 * Location Slice
 * Manages location state
 */

import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { STORAGE_KEYS } from '@/constants';

const initialState = {
  lat: null,
  lon: null,
  city: null,
  timestamp: null,
  error: null,
  loading: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon, city } = action.payload;
      state.lat = lat;
      state.lon = lon;
      state.city = city;
      state.timestamp = new Date().toISOString();
      state.error = null;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        setLocalStorage(STORAGE_KEYS.LOCATION, {
          lat,
          lon,
          city,
          timestamp: state.timestamp,
        });
      }
    },
    setLocationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLocationLoading: (state, action) => {
      state.loading = action.payload;
    },
    loadLocationFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const stored = getLocalStorage(STORAGE_KEYS.LOCATION);
        if (stored) {
          state.lat = stored.lat;
          state.lon = stored.lon;
          state.city = stored.city;
          state.timestamp = stored.timestamp;
        }
      }
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lon = null;
      state.city = null;
      state.timestamp = null;
      state.error = null;
    },
  },
});

export const {
  setLocation,
  setLocationError,
  setLocationLoading,
  loadLocationFromStorage,
  clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
