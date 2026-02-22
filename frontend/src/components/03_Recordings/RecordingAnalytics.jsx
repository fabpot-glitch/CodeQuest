import React from 'react';

const RecordingAnalytics = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card primary">
        <div className="stat-icon">🎥</div>
        <div className="stat-content">
          <h3>Total Recordings</h3>
          <span className="stat-number">{stats.totalRecordings}</span>
          <span className="stat-label">SESSIONS RECORDED</span>
        </div>
      </div>

      <div className="stat-card success">
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <h3>Watch Time</h3>
          <span className="stat-number">{stats.totalWatchTime}</span>
          <span className="stat-label">TOTAL TIME WATCHED</span>
        </div>
      </div>

      <div className="stat-card warning">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <h3>Average Rating</h3>
          <span className="stat-number">{stats.averageRating}</span>
          <span className="stat-label">OUT OF 5.0</span>
          <div className="stat-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(stats.averageRating / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card info">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Completion Rate</h3>
          <span className="stat-number">{stats.completionRate}%</span>
          <span className="stat-label">SESSIONS COMPLETED</span>
          <div className="stat-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="progress-text">{stats.completionRate}% complete</span>
          </div>
        </div>
      </div>

      <div className="stat-card accent">
        <div className="stat-icon">💾</div>
        <div className="stat-content">
          <h3>Downloads</h3>
          <span className="stat-number">{stats.totalDownloads}</span>
          <span className="stat-label">TIMES DOWNLOADED</span>
        </div>
      </div>

      <div className="stat-card purple">
        <div className="stat-icon">↗️</div>
        <div className="stat-content">
          <h3>Shares</h3>
          <span className="stat-number">{stats.totalShares}</span>
          <span className="stat-label">TIMES SHARED</span>
        </div>
      </div>

      <div className="stat-card teal">
        <div className="stat-icon">🔖</div>
        <div className="stat-content">
          <h3>Bookmarks</h3>
          <span className="stat-number">{stats.totalBookmarks}</span>
          <span className="stat-label">BOOKMARKS CREATED</span>
        </div>
      </div>

      <div className="stat-card orange">
        <div className="stat-icon">📝</div>
        <div className="stat-content">
          <h3>Notes</h3>
          <span className="stat-number">{stats.totalNotes}</span>
          <span className="stat-label">NOTES ADDED</span>
        </div>
      </div>
    </div>
  );
};

export default RecordingAnalytics;