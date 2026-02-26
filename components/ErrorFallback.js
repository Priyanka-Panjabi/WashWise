/**
 * ErrorFallback Component
 * Generic error UI with retry mechanism
 */

'use client';

export default function ErrorFallback({ error, resetError }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.message || 'An unexpected error occurred'}
          </p>

          {resetError && (
            <button
              onClick={resetError}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If the problem persists, try refreshing the page or checking your
              internet connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
