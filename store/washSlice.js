/**
 * Wash Slice
 * Manages wash history and preferences
 */

import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { STORAGE_KEYS, DEFAULT_PREFERENCES, WASH_TYPES } from '@/constants';

const initialState = {
  lastWashDate: null,
  lastWashType: null,
  washHistory: [],
  preferences: DEFAULT_PREFERENCES,
};

const washSlice = createSlice({
  name: 'wash',
  initialState,
  reducers: {
    recordWash: (state, action) => {
      const { date, washType } = action.payload || {};
      const washDate = date || new Date().toISOString();
      const washTypeId = washType || 'basic';

      // Get protection factor for this wash type
      const washConfig = WASH_TYPES[washTypeId.toUpperCase()] || WASH_TYPES.BASIC;
      const protectionFactor = washConfig.protectionFactor;

      state.lastWashDate = washDate;
      state.lastWashType = washTypeId;
      state.washHistory.push({
        date: washDate,
        timestamp: Date.now(),
        washType: washTypeId,
        protectionFactor,
      });

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        setLocalStorage(STORAGE_KEYS.LAST_WASH_DATE, washDate);
        setLocalStorage('washwise_last_wash_type', washTypeId);
        setLocalStorage(STORAGE_KEYS.WASH_HISTORY, state.washHistory);
      }
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        setLocalStorage(STORAGE_KEYS.PREFERENCES, state.preferences);
      }
    },
    loadWashDataFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const lastWash = getLocalStorage(STORAGE_KEYS.LAST_WASH_DATE);
        const lastType = getLocalStorage('washwise_last_wash_type');
        const history = getLocalStorage(STORAGE_KEYS.WASH_HISTORY, []);
        const prefs = getLocalStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);

        if (lastWash) state.lastWashDate = lastWash;
        if (lastType) state.lastWashType = lastType;
        if (history) state.washHistory = history;
        if (prefs) state.preferences = prefs;
      }
    },
    clearWashHistory: (state) => {
      state.washHistory = [];
      state.lastWashDate = null;
      state.lastWashType = null;

      if (typeof window !== 'undefined') {
        setLocalStorage(STORAGE_KEYS.WASH_HISTORY, []);
        setLocalStorage(STORAGE_KEYS.LAST_WASH_DATE, null);
        setLocalStorage('washwise_last_wash_type', null);
      }
    },
  },
});

export const {
  recordWash,
  updatePreferences,
  loadWashDataFromStorage,
  clearWashHistory,
} = washSlice.actions;

export default washSlice.reducer;
