import React from 'react';

export const DefaultLoading = ({ message = 'Loading...', fullPage = false }) => {
  const loadingStyles = fullPage 
    ? 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900'
    : 'p-6 text-center';
    
  return (
    <div className={loadingStyles}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export const InlineLoading = ({ size = 4, className = '' }) => (
  <span 
    className={`inline-block h-${size} w-${size} border-2 border-blue-500 border-t-transparent rounded-full animate-spin ${className}`}
    aria-label="Loading..."
  />
);

export default DefaultLoading;
