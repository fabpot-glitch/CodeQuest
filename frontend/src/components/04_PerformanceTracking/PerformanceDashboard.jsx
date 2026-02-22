import React, { useState, useEffect } from 'react';
import Analytics from './Analytics';
import Goals from './Goals';
import Milestones from './Milestones';
import ProgressTracker from './ProgressTracker';
import Reports from './Reports';
import './PerformanceDashboard.css';

const PerformanceDashboard = ({ performanceData: initialData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(initialData || {
    totalSessions: 0,
    averageScore: 0,
    completionRate: 0,
    totalHours: 0,
    skillsProgress: [],
    recentSessions: [],
    goals: [],
    milestones: [],
    weeklyProgress: []
  });

  useEffect(() => {
    if (initialData) {
      setPerformanceData(initialData);
    }
  }, [initialData]);

  const updatePerformanceData = (newData) => {
    const updatedData = { ...performanceData, ...newData };
    setPerformanceData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'milestones', label: 'Milestones', icon: '🏆' },
    { id: 'progress', label: 'Progress', icon: '📉' },
    { id: 'reports', label: 'Reports', icon: '📑' }
  ];

  return (
    <div className="performance-dashboard">
      <div className="performance-header">
        <h2>Performance Tracking</h2>
        <p>Monitor your progress and achieve your interview goals</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <span className="summary-label">Total Sessions</span>
            <span className="summary-value">{performanceData.totalSessions}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <span className="summary-label">Avg. Score</span>
            <span className="summary-value">{performanceData.averageScore}%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <span className="summary-label">Completion Rate</span>
            <span className="summary-value">{performanceData.completionRate}%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">⏱️</div>
          <div className="summary-content">
            <span className="summary-label">Total Hours</span>
            <span className="summary-value">{performanceData.totalHours}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="performance-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <ProgressTracker performanceData={performanceData} />
            
            <div className="recent-sessions">
              <h3>Recent Sessions</h3>
              <div className="sessions-list">
                {performanceData.recentSessions.map((session, index) => (
                  <div key={index} className="session-item">
                    <div className="session-date">{session.date}</div>
                    <div className="session-type">{session.type}</div>
                    <div className="session-score" style={{ color: session.score >= 80 ? '#10b981' : '#f59e0b' }}>
                      {session.score}%
                    </div>
                    <div className="session-feedback">{session.feedback}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-progress">
              <h3>Skills Progress</h3>
              {performanceData.skillsProgress.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.progress}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics 
            performanceData={performanceData} 
            onUpdate={updatePerformanceData}
          />
        )}

        {activeTab === 'goals' && (
          <Goals 
            goals={performanceData.goals}
            onUpdate={(goals) => updatePerformanceData({ goals })}
          />
        )}

        {activeTab === 'milestones' && (
          <Milestones 
            milestones={performanceData.milestones}
            onUpdate={(milestones) => updatePerformanceData({ milestones })}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker 
            performanceData={performanceData}
            detailed={true}
          />
        )}

        {activeTab === 'reports' && (
          <Reports 
            performanceData={performanceData}
            onGenerateReport={(type) => {
              console.log('Generating report:', type);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;