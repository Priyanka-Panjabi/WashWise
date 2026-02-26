/**
 * RecommendationBadge Component
 * Displays wash recommendation with explanation inline
 */

'use client';

import { useWashRecommendation } from '@/hooks/useWashRecommendation';

export default function RecommendationBadge() {
  const recommendation = useWashRecommendation();

  if (!recommendation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading recommendation...</p>
      </div>
    );
  }

  const getRecommendationStyles = (rec) => {
    switch (rec) {
      case 'Wash Now':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: '🚗💧',
        };
      case 'Undercarriage Recommended':
        return {
          bg: 'bg-yellow-500',
          text: 'text-white',
          icon: '⚠️',
        };
      case 'Wait':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          icon: '✅',
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          icon: 'ℹ️',
        };
    }
  };

  const styles = getRecommendationStyles(recommendation.recommendation);

  return (
    <div className={`${styles.bg} ${styles.text} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between gap-6">
        {/* Recommendation */}
        <div className="flex items-center gap-4">
          <div className="text-3xl">{styles.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">
              {recommendation.recommendation}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm opacity-90">
              <span>Confidence: {recommendation.confidence}</span>
              <span>•</span>
              <span>Priority: {recommendation.priority.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex-1 max-w-2xl">
          <p className="text-base leading-relaxed opacity-95">
            <span className="font-semibold">Why: </span>
            {recommendation.explanation}
          </p>
        </div>

        {/* Key Factors */}
        {recommendation.factors && (
          <div className="flex items-center gap-4 text-sm">
            {recommendation.factors.snowNext48h && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-2 rounded">
                <span>❄️</span>
                <span>Snow soon</span>
              </div>
            )}
            {recommendation.factors.freezeDays > 0 && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-2 rounded">
                <span>🥶</span>
                <span>{recommendation.factors.freezeDays} freeze days</span>
              </div>
            )}
            {recommendation.factors.dryDaysAhead > 0 && (
              <div className="flex items-center gap-1 bg-white/20 px-3 py-2 rounded">
                <span>☀️</span>
                <span>{recommendation.factors.dryDaysAhead} dry days</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
