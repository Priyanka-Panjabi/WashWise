/**
 * ExplanationCard Component
 * Displays natural language explanation for the recommendation
 */

'use client';

import { useWashRecommendation } from '@/hooks/useWashRecommendation';

export default function ExplanationCard() {
  const recommendation = useWashRecommendation();

  if (!recommendation || !recommendation.explanation) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl">💡</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Why This Recommendation?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {recommendation.explanation}
          </p>

          {recommendation.factors && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Key Factors:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {recommendation.factors.snowNext48h && (
                  <div className="flex items-center gap-2">
                    <span>❄️</span>
                    <span>Snow expected soon</span>
                  </div>
                )}
                {recommendation.factors.freezeDays > 0 && (
                  <div className="flex items-center gap-2">
                    <span>🥶</span>
                    <span>{recommendation.factors.freezeDays} freeze days</span>
                  </div>
                )}
                {recommendation.factors.daysSinceSnow !== undefined && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{recommendation.factors.daysSinceSnow} days since snow</span>
                  </div>
                )}
                {recommendation.factors.dryDaysAhead > 0 && (
                  <div className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>{recommendation.factors.dryDaysAhead} dry days ahead</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
