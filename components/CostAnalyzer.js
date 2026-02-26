/**
 * CostAnalyzer Component
 * Cost comparison and break-even analysis
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences, loadWashDataFromStorage } from '@/store/washSlice';
import { calculateWashCosts, generateCostRecommendation } from '@/lib/costCalculator';

export default function CostAnalyzer() {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.wash.preferences);

  const [pricePerWash, setPricePerWash] = useState(preferences.pricePerWash);
  const [monthlyMembership, setMonthlyMembership] = useState(preferences.monthlyMembership);
  const [washesPerMonth, setWashesPerMonth] = useState(preferences.washesPerMonth);

  useEffect(() => {
    dispatch(loadWashDataFromStorage());
  }, [dispatch]);

  useEffect(() => {
    setPricePerWash(preferences.pricePerWash);
    setMonthlyMembership(preferences.monthlyMembership);
    setWashesPerMonth(preferences.washesPerMonth);
  }, [preferences]);

  const analysis = useMemo(
    () => calculateWashCosts({ pricePerWash, monthlyMembership, washesPerMonth }),
    [pricePerWash, monthlyMembership, washesPerMonth]
  );

  const recommendation = useMemo(
    () => generateCostRecommendation(analysis),
    [analysis]
  );

  const handleUpdate = () => {
    dispatch(updatePreferences({
      pricePerWash,
      monthlyMembership,
      washesPerMonth,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Cost Analyzer</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per Wash ($)
          </label>
          <input
            type="number"
            value={pricePerWash}
            onChange={(e) => setPricePerWash(parseFloat(e.target.value) || 0)}
            onBlur={handleUpdate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Membership ($)
          </label>
          <input
            type="number"
            value={monthlyMembership}
            onChange={(e) => setMonthlyMembership(parseFloat(e.target.value) || 0)}
            onBlur={handleUpdate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Washes per Month
          </label>
          <input
            type="number"
            value={washesPerMonth}
            onChange={(e) => setWashesPerMonth(parseInt(e.target.value) || 0)}
            onBlur={handleUpdate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="1"
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Pay-per-Wash</p>
              <p className="text-lg font-bold text-gray-800">
                ${analysis.payPerWash.monthly.toFixed(2)}/mo
              </p>
              <p className="text-xs text-gray-500">
                ${analysis.payPerWash.annual.toFixed(2)}/year
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Membership</p>
              <p className="text-lg font-bold text-blue-800">
                ${analysis.membership.monthly.toFixed(2)}/mo
              </p>
              <p className="text-xs text-gray-500">
                ${analysis.membership.annual.toFixed(2)}/year
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              analysis.breakEven.isMembershipWorthIt
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            <p className="text-sm font-medium text-gray-800">{recommendation}</p>
            {analysis.breakEven.isMembershipWorthIt && (
              <p className="text-xs text-green-700 mt-2">
                Annual savings: ${Math.abs(analysis.savings.annual).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
