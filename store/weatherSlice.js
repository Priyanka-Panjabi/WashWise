/**
 * Weather Slice
 * Manages weather data state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';

// Async thunk for fetching weather
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ lat, lon, city }, { rejectWithValue }) => {
    try {
      const params = {};
      if (lat && lon) {
        params.lat = lat;
        params.lon = lon;
      } else if (city) {
        params.city = city;
      } else {
        throw new Error('Missing location parameters');
      }

      const response = await axios.get(API_ENDPOINTS.WEATHER, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Failed to fetch weather'
      );
    }
  }
);

const initialState = {
  current: null,
  forecast: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeather: (state) => {
      state.current = null;
      state.forecast = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
        state.lastUpdated = action.payload.timestamp;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
