import React, { useState } from 'react';

const Analytics = ({ performanceData, onUpdate }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const metrics = [
    { id: 'score', name: 'Average Score', value: performanceData.averageScore, unit: '%', color: '#3b82f6' },
    { id: 'sessions', name: 'Sessions Completed', value: performanceData.totalSessions, unit: '', color: '#10b981' },
    { id: 'hours', name: 'Practice Hours', value: performanceData.totalHours, unit: 'h', color: '#f59e0b' },
    { id: 'streak', name: 'Current Streak', value: calculateStreak(), unit: 'days', color: '#8b5cf6' }
  ];

  function calculateStreak() {
    const sessions = performanceData.recentSessions || [];
    if (sessions.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if practiced today
    const practicedToday = sessions.some(s => s.date === today);
    if (!practicedToday) return 0;
    
    // Calculate consecutive days
    for (let i = 1; i < sessions.length; i++) {
      const prevDate = new Date(sessions[i-1].date);
      const currDate = new Date(sessions[i].date);
      const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  const weeklyData = performanceData.weeklyProgress || [
    { week: 'Week 1', sessions: 3, avgScore: 72 },
    { week: 'Week 2', sessions: 4, avgScore: 75 },
    { week: 'Week 3', sessions: 3, avgScore: 78 },
    { week: 'Week 4', sessions: 2, avgScore: 82 }
  ];

  return (
    <div className="analytics-tab">
      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button 
          className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button 
          className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button 
          className={`range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
          onClick={() => setTimeRange('quarter')}
        >
          Quarter
        </button>
        <button 
          className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
          onClick={() => setTimeRange('year')}
        >
          Year
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.id} className="metric-card-large">
            <div className="metric-icon" style={{ backgroundColor: `${metric.color}15`, color: metric.color }}>
              {metric.id === 'score' && '⭐'}
              {metric.id === 'sessions' && '🎯'}
              {metric.id === 'hours' && '⏱️'}
              {metric.id === 'streak' && '🔥'}
            </div>
            <div className="metric-details">
              <span className="metric-name">{metric.name}</span>
              <span className="metric-value">{metric.value}{metric.unit}</span>
            </div>
            <div className="metric-trend">↑ 12% from last {timeRange}</div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="chart-container">
        <h3>Performance Trend</h3>
        <div className="chart">
          {weeklyData.map((week, index) => (
            <div key={index} className="chart-bar-group">
              <div className="chart-bars">
                <div 
                  className="bar sessions-bar" 
                  style={{ 
                    height: `${(week.sessions / 10) * 100}px`,
                    backgroundColor: '#3b82f6'
                  }}
                  title={`Sessions: ${week.sessions}`}
                ></div>
                <div 
                  className="bar score-bar" 
                  style={{ 
                    height: `${week.avgScore}px`,
                    backgroundColor: '#10b981'
                  }}
                  title={`Avg Score: ${week.avgScore}%`}
                ></div>
              </div>
              <span className="chart-label">{week.week}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
            <span>Sessions</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            <span>Average Score</span>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="skills-breakdown">
        <h3>Skills Breakdown</h3>
        <div className="skills-grid">
          {performanceData.skillsProgress.map((skill, index) => (
            <div key={index} className="skill-card">
              <h4>{skill.name}</h4>
              <div className="skill-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${skill.progress}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={skill.progress >= 80 ? '#10b981' : '#f59e0b'}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="percentage">{skill.progress}%</span>
              </div>
              <div className="skill-target">Target: {skill.target}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;