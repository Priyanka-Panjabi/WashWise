/**
 * WashWise Decision Engine
 * Pure JavaScript module for calculating car wash recommendations
 * Framework-agnostic - no React dependencies
 */

import { WASH_TYPES, PROTECTION_DECAY_RATE } from '@/constants';

/**
 * Calculate current effective protection from last wash
 * @param {number} daysSinceWash - Days since last wash
 * @param {string} washType - Type of wash performed
 * @returns {Object} Protection analysis
 */
export function calculateEffectiveProtection(daysSinceWash, washType = 'basic') {
  const washConfig = WASH_TYPES[washType.toUpperCase()] || WASH_TYPES.BASIC;
  const initialProtection = washConfig.protectionFactor;

  // Protection decay over time
  const decayAmount = daysSinceWash * PROTECTION_DECAY_RATE;
  const currentProtection = Math.max(0, initialProtection - decayAmount);

  // Protection level categorization
  let protectionLevel;
  if (currentProtection >= 7) {
    protectionLevel = 'High';
  } else if (currentProtection >= 3) {
    protectionLevel = 'Medium';
  } else if (currentProtection > 0) {
    protectionLevel = 'Low';
  } else {
    protectionLevel = 'None';
  }

  return {
    initialProtection,
    currentProtection,
    protectionLevel,
    decayAmount,
    daysUntilExpired: Math.ceil(initialProtection / PROTECTION_DECAY_RATE),
    washType: washConfig.name
  };
}

/**
 * Calculate salt corrosion risk score
 * @param {Object} input - Environmental factors
 * @param {number} input.daysSinceSnow - Days since last snowfall
 * @param {number} input.daysSinceWash - Days since last car wash
 * @param {number} input.freezeDays - Number of freeze days in forecast
 * @param {string} input.washType - Type of last wash performed
 * @returns {Object} Risk assessment
 */
export function calculateSaltRiskScore(input) {
  const {
    daysSinceSnow = 0,
    daysSinceWash = 0,
    freezeDays = 0,
    washType = 'basic',
  } = input;

  // Calculate effective protection from last wash
  const { currentProtection } = calculateEffectiveProtection(daysSinceWash, washType);

  // Updated Salt Risk Formula:
  // (daysSinceSnow * 2) + (freezeDays * 1.5) - effectiveProtection
  const riskScore =
    (daysSinceSnow * 2) +
    (freezeDays * 1.5) -
    currentProtection;

  // Determine risk level
  let riskLevel;
  if (riskScore <= 5) {
    riskLevel = 'Low';
  } else if (riskScore <= 12) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'High';
  }

  return {
    riskScore: Math.max(0, riskScore), // Ensure non-negative
    riskLevel,
    effectiveProtection: currentProtection, // Expose for UI
  };
}

/**
 * Calculate wash recommendation based on weather and risk factors
 * @param {Object} input - Decision factors
 * @param {boolean} input.snowNext48h - Snow expected within 48 hours
 * @param {number} input.dryDaysAhead - Number of dry days in forecast
 * @param {number} input.daysSinceSnow - Days since last snowfall
 * @param {number} input.daysSinceWash - Days since last car wash
 * @param {number} input.freezeDays - Number of freeze days in forecast
 * @returns {Object} Wash recommendation
 */
export function calculateWashRecommendation(input) {
  const {
    snowNext48h = false,
    dryDaysAhead = 0,
    daysSinceSnow = 0,
    daysSinceWash = 0,
    freezeDays = 0,
    washType = 'basic',
  } = input;

  // Calculate salt risk with wash type consideration
  const { riskScore, riskLevel, effectiveProtection } = calculateSaltRiskScore({
    daysSinceSnow,
    daysSinceWash,
    freezeDays,
    washType,
  });

  let recommendation;
  let confidence;
  let priority;

  // Decision logic
  if (snowNext48h) {
    recommendation = 'Wait';
    confidence = 'High';
    priority = 'low';
  } else if (riskScore > 15) {
    recommendation = 'Wash Now';
    confidence = 'High';
    priority = 'high';
  } else if (riskScore > 8) {
    recommendation = 'Undercarriage Recommended';
    confidence = 'Medium';
    priority = 'medium';
  } else {
    recommendation = 'Wait';
    confidence = dryDaysAhead >= 3 ? 'High' : 'Medium';
    priority = 'low';
  }

  return {
    recommendation,
    confidence,
    priority,
    riskScore,
    riskLevel,
    effectiveProtection,
    factors: {
      snowNext48h,
      dryDaysAhead,
      daysSinceSnow,
      daysSinceWash,
      freezeDays,
      washType,
    },
  };
}

/**
 * Generate natural language explanation for the recommendation
 * @param {Object} result - Recommendation result from calculateWashRecommendation
 * @param {Object} weatherData - Additional weather context
 * @returns {string} Human-readable explanation
 */
export function generateExplanation(result, weatherData = {}) {
  const { recommendation, riskScore, riskLevel, factors, effectiveProtection } = result;
  const { snowNext48h, dryDaysAhead, daysSinceSnow, freezeDays, daysSinceWash, washType } = factors;

  let explanation = '';

  // Snow-based logic
  if (snowNext48h) {
    explanation = 'Snow is expected within 48 hours. Washing today may reduce cost efficiency as your car will get dirty again soon.';
  }
  // High risk
  else if (recommendation === 'Wash Now') {
    if (daysSinceSnow >= 5) {
      explanation = `Your car has been exposed to road salt for ${daysSinceSnow} days. Salt corrosion risk is ${riskLevel.toLowerCase()}. Washing now is recommended to protect your vehicle's undercarriage and paint.`;
    } else {
      explanation = `Salt corrosion risk is ${riskLevel.toLowerCase()} (score: ${riskScore.toFixed(1)}). With ${freezeDays} freeze days ahead, washing now will help prevent damage.`;
    }
  }
  // Medium risk
  else if (recommendation === 'Undercarriage Recommended') {
    explanation = `Salt risk is moderate. An undercarriage wash will remove salt buildup while saving costs. ${dryDaysAhead >= 2 ? `Good news: ${dryDaysAhead} dry days ahead.` : 'More precipitation may be coming.'}`;
  }
  // Wait
  else {
    if (dryDaysAhead >= 3) {
      explanation = `Low salt risk and ${dryDaysAhead} dry days ahead. Your car is safe to wait for a better washing opportunity.`;
    } else if (riskScore < 3) {
      explanation = 'Salt corrosion risk is low. No urgent need to wash unless for aesthetic reasons.';
    } else {
      explanation = `Salt risk is currently low to moderate. Monitor the forecast and consider washing if more snow is expected.`;
    }
  }

  // Add protection status to explanation
  if (effectiveProtection !== undefined && daysSinceWash > 0 && washType) {
    const protectionInfo = calculateEffectiveProtection(daysSinceWash, washType);

    if (protectionInfo.protectionLevel === 'None') {
      explanation += ` Your ${protectionInfo.washType.toLowerCase()} from ${daysSinceWash} days ago no longer provides salt protection.`;
    } else if (protectionInfo.protectionLevel === 'Low') {
      explanation += ` Protection from your ${protectionInfo.washType.toLowerCase()} is fading (${daysSinceWash} days old).`;
    } else {
      explanation += ` Your ${protectionInfo.washType.toLowerCase()} still provides ${protectionInfo.protectionLevel.toLowerCase()} protection.`;
    }
  }

  return explanation;
}

/**
 * Analyze weather data to extract decision inputs
 * @param {Object} currentWeather - Current weather data
 * @param {Object} forecast - 5-day forecast data
 * @param {Date} lastWashDate - Date of last car wash
 * @param {string} lastWashType - Type of last wash
 * @returns {Object} Analyzed data ready for decision engine
 */
export function analyzeWeatherData(currentWeather, forecast, lastWashDate, lastWashType = 'basic') {
  // Calculate days since last wash
  const daysSinceWash = lastWashDate
    ? Math.floor((Date.now() - new Date(lastWashDate).getTime()) / (1000 * 60 * 60 * 24))
    : 7; // Default to 7 if no record

  // Check for snow in next 48 hours
  const now = Date.now();
  const next48h = now + (48 * 60 * 60 * 1000);
  let snowNext48h = false;

  if (forecast && forecast.list) {
    snowNext48h = forecast.list.some(item => {
      const itemTime = new Date(item.dt * 1000).getTime();
      const hasSnow = item.weather && item.weather.some(w =>
        w.main === 'Snow' || w.description.toLowerCase().includes('snow')
      );
      return itemTime <= next48h && hasSnow;
    });
  }

  // Count freeze days (temp < 0°C) in next 5 days
  let freezeDays = 0;
  if (forecast && forecast.list) {
    const processedDays = new Set();
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!processedDays.has(date) && item.main && item.main.temp < 0) {
        freezeDays++;
        processedDays.add(date);
      }
    });
  }

  // Count dry days ahead
  let dryDaysAhead = 0;
  if (forecast && forecast.list) {
    const processedDays = new Set();
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!processedDays.has(date)) {
        const hasRain = item.weather && item.weather.some(w =>
          w.main === 'Rain' || w.main === 'Snow' || w.main === 'Drizzle'
        );
        if (!hasRain) {
          dryDaysAhead++;
        }
        processedDays.add(date);
      }
    });
  }

  // Estimate days since snow (simplified - look at recent snow in forecast)
  let daysSinceSnow = 1; // Conservative default
  if (currentWeather && currentWeather.weather) {
    const hasSnowNow = currentWeather.weather.some(w =>
      w.main === 'Snow' || w.description.toLowerCase().includes('snow')
    );
    if (hasSnowNow) {
      daysSinceSnow = 0;
    } else if (forecast && forecast.list) {
      // Check if there was snow in the past day (approximate)
      const recentSnow = forecast.list.slice(0, 8).some(item => {
        return item.weather && item.weather.some(w =>
          w.main === 'Snow' || w.description.toLowerCase().includes('snow')
        );
      });
      daysSinceSnow = recentSnow ? 1 : 3;
    }
  }

  return {
    snowNext48h,
    dryDaysAhead,
    daysSinceSnow,
    daysSinceWash,
    freezeDays,
    washType: lastWashType,
  };
}
