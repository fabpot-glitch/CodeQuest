import React from 'react';
import './StepNavigation.css';

const StepNavigation = ({ currentStep = 0, steps = [], onNext, onBack }) => {
  return (
    <div className="step-navigation">
      <button
        className="nav-btn"
        onClick={onBack}
        disabled={currentStep === 0}
      >
        Back
      </button>
      <button
        className="nav-btn"
        onClick={onNext}
        disabled={currentStep === steps.length - 1}
      >
        Next
      </button>
    </div>
  );
};

export default StepNavigation;
