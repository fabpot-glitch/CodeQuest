import React from 'react';

const ProgressTracker = ({ performanceData, detailed = false }) => {
  const calculateOverallProgress = () => {
    const goals = performanceData.goals || [];
    if (goals.length === 0) return 0;
    return goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length;
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className={`progress-tracker ${detailed ? 'detailed' : ''}`}>
      <div className="tracker-header">
        <h3>Your Progress</h3>
        {!detailed && <span className="overall-percentage">{Math.round(overallProgress)}%</span>}
      </div>

      {/* Overall Progress Circle */}
      {!detailed && (
        <div className="progress-circle-large">
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
              strokeDasharray={`${overallProgress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="progress-text">
            <span className="percentage">{Math.round(overallProgress)}%</span>
            <span className="label">Overall</span>
          </div>
        </div>
      )}

      {/* Detailed Progress Bars */}
      <div className="progress-bars">
        <div className="progress-item">
          <div className="progress-label">
            <span>Sessions Completed</span>
            <span>{performanceData.totalSessions || 0}</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${Math.min((performanceData.totalSessions / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Average Score</span>
            <span>{performanceData.averageScore || 0}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${performanceData.averageScore || 0}%`,
                backgroundColor: performanceData.averageScore >= 80 ? '#10b981' : 
                               performanceData.averageScore >= 60 ? '#f59e0b' : '#ef4444'
              }}
            ></div>
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Practice Hours</span>
            <span>{performanceData.totalHours || 0}h</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${Math.min((performanceData.totalHours / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Completion Rate</span>
            <span>{performanceData.completionRate || 0}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${performanceData.completionRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      {detailed && performanceData.skillsProgress && (
        <div className="skills-progress-detailed">
          <h4>Skills Mastery</h4>
          {performanceData.skillsProgress.map((skill, index) => (
            <div key={index} className="skill-progress-item">
              <div className="skill-label">
                <span>{skill.name}</span>
                <span>{skill.progress}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${skill.progress}%`,
                    backgroundColor: skill.progress >= 80 ? '#10b981' : 
                                   skill.progress >= 60 ? '#f59e0b' : '#3b82f6'
                  }}
                ></div>
              </div>
              <div className="skill-target">Target: {skill.target}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Achievements */}
      {detailed && (
        <div className="recent-achievements">
          <h4>Recent Achievements</h4>
          <div className="achievements-list">
            {performanceData.milestones?.filter(m => m.achieved).slice(0, 3).map(milestone => (
              <div key={milestone.id} className="achievement-item">
                <span className="achievement-icon">{milestone.icon || '🏆'}</span>
                <div className="achievement-details">
                  <span className="achievement-name">{milestone.name}</span>
                  <span className="achievement-date">
                    {new Date(milestone.achievedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {(!performanceData.milestones || performanceData.milestones.filter(m => m.achieved).length === 0) && (
              <p className="no-achievements">No achievements yet. Keep practicing!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;