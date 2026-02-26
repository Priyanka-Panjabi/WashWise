/**
 * SaltRiskMeter Component
 * Visual indicator for salt corrosion risk
 */

'use client';

import { useWashRecommendation } from '@/hooks/useWashRecommendation';

export default function SaltRiskMeter() {
  const recommendation = useWashRecommendation();

  if (!recommendation) {
    return null;
  }

  const { riskScore, riskLevel, effectiveProtection } = recommendation;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-700';
      case 'Moderate':
        return 'text-yellow-700';
      case 'High':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const percentage = Math.min((riskScore / 20) * 100, 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Salt Corrosion Risk</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Risk Level:</span>
          <span className={`font-bold text-lg ${getRiskTextColor(riskLevel)}`}>
            {riskLevel}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Risk Score</span>
            <span className="font-medium">{riskScore.toFixed(1)} / 20</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${getRiskColor(riskLevel)} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <span>Low</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <span>Moderate</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <span>High</span>
          </div>
        </div>

        {/* Protection Display */}
        {effectiveProtection !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Protection:</span>
              <span className="font-semibold text-blue-600">
                {effectiveProtection.toFixed(1)} points
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
