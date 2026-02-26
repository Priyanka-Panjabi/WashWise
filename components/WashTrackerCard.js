/**
 * Wash Tracker Card Component
 * Allows users to record washes and view protection status
 */

'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { recordWash } from '@/store/washSlice';
import { calculateEffectiveProtection } from '@/lib/washDecisionEngine';
import { WASH_TYPES } from '@/constants';

export default function WashTrackerCard() {
  const dispatch = useDispatch();
  const { lastWashDate, lastWashType } = useSelector((state) => state.wash);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('undercarriage');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate current protection
  const daysSinceWash = lastWashDate
    ? Math.floor((Date.now() - new Date(lastWashDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const protection = daysSinceWash !== null
    ? calculateEffectiveProtection(daysSinceWash, lastWashType || 'basic')
    : null;

  const handleRecordWash = () => {
    dispatch(recordWash({
      date: new Date(selectedDate).toISOString(),
      washType: selectedType
    }));
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Last Wash Tracker</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Record Wash
        </button>
      </div>

      {/* Last Wash Info */}
      {lastWashDate ? (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Last Wash</p>
              <p className="font-semibold">
                {daysSinceWash === 0 ? 'Today' : `${daysSinceWash} days ago`}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(lastWashDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Wash Type</p>
              <p className="font-semibold">
                {WASH_TYPES[lastWashType?.toUpperCase() || 'BASIC']?.name || 'Basic'}
              </p>
            </div>
          </div>

          {/* Protection Meter */}
          {protection && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Current Protection</span>
                <span className={`text-sm font-semibold ${
                  protection.protectionLevel === 'High' ? 'text-green-600' :
                  protection.protectionLevel === 'Medium' ? 'text-yellow-600' :
                  protection.protectionLevel === 'Low' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {protection.protectionLevel}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    protection.protectionLevel === 'High' ? 'bg-green-500' :
                    protection.protectionLevel === 'Medium' ? 'bg-yellow-500' :
                    protection.protectionLevel === 'Low' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(protection.currentProtection / protection.initialProtection) * 100}%` }}
                />
              </div>

              <p className="text-xs text-gray-600 mt-1">
                {protection.currentProtection.toFixed(1)} / {protection.initialProtection} protection points
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">No wash recorded yet</p>
          <p className="text-sm text-gray-500">Record your first wash to track protection</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Record Car Wash</h3>

            {/* Date picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wash Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Wash type selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wash Type
              </label>
              <div className="space-y-2">
                {Object.entries(WASH_TYPES).map(([key, type]) => (
                  <label
                    key={key}
                    className={`block border-2 rounded-lg p-3 cursor-pointer transition ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="washType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <div>
                        <p className="font-semibold">{type.name}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.details}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordWash}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                Save Wash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
