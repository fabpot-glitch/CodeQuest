import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep = 0, steps = [] }) => {
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-text">
          Step {currentStep + 1} of {steps.length || 0}
        </span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="step-labels">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`step-label ${index <= currentStep ? 'active' : ''}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
