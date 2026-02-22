import React, { useState } from 'react';
import PreparationChecklist from './PreparationChecklist';
import ResumeReview from './ResumeReview';
import './InterviewPreparation.css';

const InterviewPreparation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [preparationProgress, setPreparationProgress] = useState(0);

  const preparationCategories = [
    {
      id: 1,
      title: 'Resume & LinkedIn',
      icon: '📄',
      description: 'Polish your resume and optimize your LinkedIn profile',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Common Questions',
      icon: '💬',
      description: 'Practice answers to frequently asked interview questions',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'Company Research',
      icon: '🔍',
      description: 'Research your target companies and their culture',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'STAR Method',
      icon: '⭐',
      description: 'Master the STAR technique for behavioral questions',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'Technical Skills',
      icon: '💻',
      description: 'Brush up on technical concepts and coding challenges',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'Mock Interviews',
      icon: '🎯',
      description: 'Schedule practice sessions with peers or mentors',
      status: 'not-started'
    }
  ];

  const tips = [
    'Start preparing at least 2-3 weeks before your interview',
    'Research the company culture and recent news',
    'Prepare 3-5 stories using the STAR method',
    'Practice your answers out loud',
    'Prepare thoughtful questions to ask the interviewer'
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-progress';
      case 'not-started': return 'status-not-started';
      default: return '';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="progress-section">
              <h3>Your Preparation Progress</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${preparationProgress}%` }}
                >
                  {preparationProgress}%
                </div>
              </div>
            </div>

            <div className="categories-grid">
              {preparationCategories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-icon">{category.icon}</div>
                  <h4>{category.title}</h4>
                  <p>{category.description}</p>
                  <span className={`category-status ${getStatusClass(category.status)}`}>
                    {category.status.replace('-', ' ')}
                  </span>
                  <button className="start-btn">
                    {category.status === 'not-started' ? 'Start' : 'Continue'}
                  </button>
                </div>
              ))}
            </div>

            <div className="tips-section">
              <h3>💡 Quick Tips</h3>
              <ul className="tips-list">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'checklist':
        return <PreparationChecklist />;
      
      case 'resume':
        return <ResumeReview />;
      
      default:
        return null;
    }
  };

  return (
    <div className="interview-preparation">
      <div className="preparation-header">
        <h1>Interview Preparation</h1>
        <p>Prepare thoroughly for your upcoming interviews with our comprehensive tools and resources.</p>
      </div>

      <div className="preparation-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
        <button 
          className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume Review
        </button>
      </div>

      <div className="preparation-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default InterviewPreparation;