import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;