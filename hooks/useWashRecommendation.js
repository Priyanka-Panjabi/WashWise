/**
 * useWashRecommendation Hook
 * Integrates decision engine with Redux state
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  calculateWashRecommendation,
  generateExplanation,
  analyzeWeatherData,
} from '@/lib/washDecisionEngine';
import { parseCurrentWeather, parseForecastData } from '@/lib/weatherClient';

export function useWashRecommendation() {
  const { current, forecast } = useSelector((state) => state.weather);
  const { lastWashDate, lastWashType } = useSelector((state) => state.wash);

  const recommendation = useMemo(() => {
    if (!current || !forecast) {
      return null;
    }

    try {
      // Parse weather data
      const parsedCurrent = parseCurrentWeather(current);
      const parsedForecast = parseForecastData(forecast);

      // Analyze weather data to get decision inputs
      const analysisInputs = analyzeWeatherData(
        parsedCurrent,
        parsedForecast,
        lastWashDate,
        lastWashType || 'basic'
      );

      // Calculate recommendation
      const result = calculateWashRecommendation(analysisInputs);

      // Generate explanation
      const explanation = generateExplanation(result, {
        current: parsedCurrent,
        forecast: parsedForecast,
      });

      return {
        ...result,
        explanation,
      };
    } catch (error) {
      console.error('Error calculating recommendation:', error);
      return null;
    }
  }, [current, forecast, lastWashDate, lastWashType]);

  return recommendation;
}
