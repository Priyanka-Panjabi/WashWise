/**
 * Redux Store
 * Combines all slices and configures the store
 */

import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import weatherReducer from './weatherSlice';
import washReducer from './washSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    weather: weatherReducer,
    wash: washReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['weather/fetchWeather/fulfilled'],
      },
    }),
});

export default store;
