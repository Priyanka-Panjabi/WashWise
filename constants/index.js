/**
 * Application Constants
 */

export const APP_NAME = 'WashWise';

export const STORAGE_KEYS = {
  LOCATION: 'washwise_location',
  LAST_WASH_DATE: 'washwise_last_wash_date',
  WASH_HISTORY: 'washwise_wash_history',
  PREFERENCES: 'washwise_preferences',
};

export const DEFAULT_PREFERENCES = {
  pricePerWash: 15,
  monthlyMembership: 30,
  washesPerMonth: 4,
};

export const RECOMMENDATION_TYPES = {
  WASH_NOW: 'Wash Now',
  UNDERCARRIAGE: 'Undercarriage Recommended',
  WAIT: 'Wait',
};

export const RISK_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
};

export const RECOMMENDATION_COLORS = {
  'Wash Now': {
    bg: 'bg-wash-now',
    text: 'text-white',
    border: 'border-wash-now',
  },
  'Undercarriage Recommended': {
    bg: 'bg-wash-undercarriage',
    text: 'text-white',
    border: 'border-wash-undercarriage',
  },
  'Wait': {
    bg: 'bg-wash-wait',
    text: 'text-white',
    border: 'border-wash-wait',
  },
};

export const RISK_COLORS = {
  Low: 'text-risk-low',
  Moderate: 'text-risk-moderate',
  High: 'text-risk-high',
};

export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
};

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};

// Wash Type Constants
export const WASH_TYPES = {
  BASIC: {
    id: 'basic',
    name: 'Basic Exterior',
    protectionFactor: 3,
    description: 'Removes surface salt',
    icon: '🚿',
    details: 'Soap and rinse only. Good for appearance, minimal salt protection.'
  },
  UNDERCARRIAGE: {
    id: 'undercarriage',
    name: 'Undercarriage Wash',
    protectionFactor: 7,
    description: 'Removes chassis salt',
    icon: '🔧',
    details: 'Targets wheel wells and underbody where salt accumulates most.'
  },
  FULL_SERVICE: {
    id: 'full_service',
    name: 'Full Service',
    protectionFactor: 10,
    description: 'Wax + underbody protection',
    icon: '✨',
    details: 'Complete protection with wax coating and thorough underbody flush.'
  }
};

// Protection decay rate (protection points lost per day)
export const PROTECTION_DECAY_RATE = 0.8;

// Add wash type storage key
export const STORAGE_KEYS_EXTENDED = {
  ...STORAGE_KEYS,
  LAST_WASH_TYPE: 'washwise_last_wash_type',
};
