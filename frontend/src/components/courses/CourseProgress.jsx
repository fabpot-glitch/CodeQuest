import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseProgress = ({ progress, courseId, curriculum, onAchievementUnlocked }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastActive: null,
    activityHistory: []
  });
  const [learningStats, setLearningStats] = useState({
    totalTimeSpent: 0,
    averageSessionLength: 0,
    mostActiveDay: '',
    completionRate: 0,
    lessonsPerWeek: 0,
    projectedCompletion: null
  });
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [recommendedNext, setRecommendedNext] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Load learning streak from localStorage
    const savedStreak = localStorage.getItem(`course_${courseId}_streak`);
    if (savedStreak) {
      setStreakData(JSON.parse(savedStreak));
    } else {
      const mockStreak = generateMockStreakData();
      setStreakData(mockStreak);
      localStorage.setItem(`course_${courseId}_streak`, JSON.stringify(mockStreak));
    }

    // Load learning stats
    const savedStats = localStorage.getItem(`course_${courseId}_stats`);
    if (savedStats) {
      setLearningStats(JSON.parse(savedStats));
    } else {
      const mockStats = generateMockStats(progress);
      setLearningStats(mockStats);
      localStorage.setItem(`course_${courseId}_stats`, JSON.stringify(mockStats));
    }

    // Load badges
    const savedBadges = localStorage.getItem(`course_${courseId}_badges`);
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      const mockBadges = generateMockBadges(progress);
      setBadges(mockBadges);
      localStorage.setItem(`course_${courseId}_badges`, JSON.stringify(mockBadges));
    }

    // Generate weekly progress data
    setWeeklyProgress(generateWeeklyProgress(progress));

    // Find recommended next lesson
    if (curriculum) {
      const next = findNextLesson();
      setRecommendedNext(next);
    }

    // Check for new achievements
    checkForAchievements();
  }, [progress, courseId, curriculum]);

  const generateMockStreakData = () => {
    const today = new Date();
    const activityHistory = [];
    let streak = 0;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const isActive = Math.random() < 0.8;
      if (isActive) streak++;
      else streak = 0;
      
      activityHistory.push({
        date: date.toISOString().split('T')[0],
        active: isActive,
        lessonsCompleted: isActive ? Math.floor(Math.random() * 3) + 1 : 0
      });
    }
    
    return {
      currentStreak: streak,
      longestStreak: Math.max(streak, 7),
      lastActive: today.toISOString(),
      activityHistory
    };
  };

  const generateMockStats = (progress) => {
    const totalLessons = curriculum?.flatMap(s => s.lessons).length || 0;
    
    return {
      totalTimeSpent: Math.floor(Math.random() * 50) + 10,
      averageSessionLength: Math.floor(Math.random() * 45) + 15,
      mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)],
      completionRate: progress,
      lessonsPerWeek: Math.floor(Math.random() * 10) + 5,
      projectedCompletion: new Date(Date.now() + (30 - progress/100 * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  };

  const generateMockBadges = (progress) => {
    const totalLessons = curriculum?.flatMap(s => s.lessons).length || 0;
    const completed = Math.round((progress / 100) * totalLessons);
    
    return [
      {
        id: 1,
        name: 'Quick Starter',
        description: 'Completed your first lesson',
        icon: '🚀',
        achieved: progress > 0,
        achievedDate: progress > 0 ? '2024-02-15' : null,
        rarity: 'common'
      },
      {
        id: 2,
        name: 'Bookworm',
        description: 'Completed 10 lessons',
        icon: '📚',
        achieved: completed >= 10,
        achievedDate: completed >= 10 ? '2024-02-18' : null,
        rarity: 'common'
      },
      {
        id: 3,
        name: 'Halfway Hero',
        description: 'Reached 50% completion',
        icon: '🌟',
        achieved: progress >= 50,
        achievedDate: progress >= 50 ? '2024-02-20' : null,
        rarity: 'rare'
      },
      {
        id: 4,
        name: 'Course Master',
        description: 'Completed the entire course',
        icon: '🎓',
        achieved: progress >= 100,
        achievedDate: progress >= 100 ? '2024-02-25' : null,
        rarity: 'legendary'
      },
      {
        id: 5,
        name: '7-Day Streak',
        description: 'Learned for 7 days in a row',
        icon: '🔥',
        achieved: streakData?.currentStreak >= 7,
        achievedDate: streakData?.currentStreak >= 7 ? '2024-02-19' : null,
        rarity: 'rare'
      }
    ];
  };

  const generateWeeklyProgress = (progress) => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 4; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      
      weeks.push({
        week: `Week ${5-i}`,
        startDate: weekStart.toLocaleDateString(),
        progress: Math.min(100, Math.max(0, progress - (i * 10) + Math.floor(Math.random() * 15))),
        lessonsCompleted: Math.floor(Math.random() * 8) + 2,
        timeSpent: Math.floor(Math.random() * 180) + 60
      });
    }
    
    return weeks;
  };

  const findNextLesson = () => {
    if (!curriculum) return null;
    
    for (const section of curriculum) {
      for (const lesson of section.lessons) {
        const completedLessons = JSON.parse(localStorage.getItem(`course_${courseId}_progress`) || '[]');
        if (!completedLessons.includes(lesson.id)) {
          return {
            ...lesson,
            sectionName: section.section
          };
        }
      }
    }
    return null;
  };

  const checkForAchievements = () => {
    const newAchievements = [];
    
    if (progress > 0 && !badges.find(b => b.id === 1)?.achieved) {
      newAchievements.push({
        id: 1,
        name: 'Quick Starter',
        icon: '🚀'
      });
    }
    
    newAchievements.forEach(achievement => {
      if (onAchievementUnlocked) {
        onAchievementUnlocked(achievement);
      }
    });
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#94a3b8';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getRarityBgColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#f1f5f9';
      case 'uncommon': return '#d1fae5';
      case 'rare': return '#dbeafe';
      case 'epic': return '#ede9fe';
      case 'legendary': return '#fed7aa';
      default: return '#f1f5f9';
    }
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const handleContinueLearning = () => {
    if (recommendedNext) {
      navigate(`/dashboard/courses/${courseId}/lessons/${recommendedNext.id}`);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const completedLessons = Math.round((progress / 100) * (curriculum?.flatMap(s => s.lessons).length || 0));
  const totalLessons = curriculum?.flatMap(s => s.lessons).length || 0;
  const remainingLessons = totalLessons - completedLessons;

  return (
    <div className="course-progress-container">
      {/* Header */}
      <div className="progress-header">
        <h2 className="progress-title">My Learning Progress</h2>
        <div className="view-selector">
          <button
            className={`view-button ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button
            className={`view-button ${activeView === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveView('badges')}
          >
            Badges ({badges.filter(b => b.achieved).length})
          </button>
          <button
            className={`view-button ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <>
          {/* Progress Overview Card */}
          <div className="progress-section-card">
            <div className="progress-main">
              <div className="progress-circle">
                <svg viewBox="0 0 100 100" className="progress-circle-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="progress-circle-bg"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="progress-circle-fill"
                    style={{
                      strokeDasharray: `${(progress / 100) * 283}, 283`,
                    }}
                  />
                </svg>
                <div className="progress-percentage">
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="progress-details">
                <h3 className="progress-subtitle">Course Completion</h3>
                <div className="progress-stats-row">
                  <div className="progress-stat-item">
                    <span className="progress-stat-value">{completedLessons} completed</span>
                  </div>
                  <div className="progress-stat-item">
                    <span className="progress-stat-value">{remainingLessons} remaining</span>
                  </div>
                </div>
                <div className="progress-actions">
                  <button className="view-details-btn">View Details</button>
                  <button className="bookmarks-btn">Bookmarks (0)</button>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-bar-text">{Math.round(progress)}% Complete</span>
                </div>
                {recommendedNext && (
                  <button
                    className="continue-learning-btn"
                    onClick={handleContinueLearning}
                  >
                    Continue Learning: {recommendedNext.title} →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon blue">📊</div>
                <span className="stat-title">Completion Rate</span>
              </div>
              <div className="stat-value">{Math.round(learningStats.completionRate)}%</div>
              <div className="stat-subtext">+15% this week</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon orange">⏱️</div>
                <span className="stat-title">Avg Session</span>
              </div>
              <div className="stat-value">{learningStats.averageSessionLength} min</div>
              <div className="stat-subtext">Last 7 days</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon green">📅</div>
                <span className="stat-title">Most Active</span>
              </div>
              <div className="stat-value">{learningStats.mostActiveDay}</div>
              <div className="stat-subtext">Peak learning day</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon red">🎯</div>
                <span className="stat-title">Projected Finish</span>
              </div>
              <div className="stat-value">{learningStats.projectedCompletion}</div>
              <div className="stat-subtext">Estimated completion</div>
            </div>
          </div>

          {/* Learning Streak */}
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Learning Streak
            </h3>
            <div className="streak-container">
              <div className="streak-header">
                <div className="streak-badge">
                  <span className="streak-icon">🔥</span>
                  <div className="streak-info">
                    <span className="streak-value">{streakData.currentStreak} days</span>
                    <span className="streak-label">Current streak</span>
                  </div>
                </div>
                <div className="streak-badge">
                  <span className="streak-icon">🏆</span>
                  <div className="streak-info">
                    <span className="streak-value">{streakData.longestStreak} days</span>
                    <span className="streak-label">Longest streak</span>
                  </div>
                </div>
              </div>
              <div className="streak-calendar">
                {streakData.activityHistory.slice(-14).map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${day.active ? 'active' : ''}`}
                    title={`${day.date}: ${day.lessonsCompleted} lessons`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Weekly Progress
            </h3>
            <div className="weekly-progress">
              {weeklyProgress.map((week, index) => (
                <div key={index} className="week-item">
                  <div className="week-header">
                    <span className="week-name">{week.week}</span>
                    <span className="week-date">Started {week.startDate}</span>
                  </div>
                  <div className="week-progress">
                    <div className="week-bar">
                      <div
                        className="week-bar-fill"
                        style={{ width: `${week.progress}%` }}
                      />
                    </div>
                    <span className="week-percentage">{Math.round(week.progress)}%</span>
                  </div>
                  <div className="week-stats">
                    <span>📚 {week.lessonsCompleted} lessons</span>
                    <span>⏱️ {formatTime(week.timeSpent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Badges View */}
      {activeView === 'badges' && (
        <>
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Earned Badges ({badges.filter(b => b.achieved).length})
            </h3>
            <div className="badges-grid">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`badge-card ${badge.achieved ? 'achieved' : 'locked'} ${badge.rarity}`}
                  onClick={() => badge.achieved && handleBadgeClick(badge)}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  {badge.achieved ? (
                    <div className={`badge-rarity ${badge.rarity}`}>
                      {badge.rarity}
                    </div>
                  ) : (
                    <div className="badge-locked">Locked</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next Achievements */}
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Next Achievements
            </h3>
            <div className="badges-grid">
              {badges.filter(b => !b.achieved).slice(0, 3).map((badge) => {
                const progress = badge.id === 2 ? (completedLessons / 10) * 100 :
                                badge.id === 3 ? progress :
                                badge.id === 4 ? (completedLessons / totalLessons) * 100 :
                                Math.random() * 100;
                return (
                  <div key={badge.id} className="badge-card next">
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-name">{badge.name}</div>
                    <div className="progress-bar-mini">
                      <div
                        className="progress-fill-mini"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="progress-text-mini">
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon blue">📈</div>
                <span className="stat-title">Learning Pace</span>
              </div>
              <div className="stat-value">{learningStats.lessonsPerWeek}/week</div>
              <div className="stat-subtext">Average lessons per week</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon orange">⏰</div>
                <span className="stat-title">Total Time</span>
              </div>
              <div className="stat-value">{learningStats.totalTimeSpent}h</div>
              <div className="stat-subtext">Lifetime learning</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon green">🎯</div>
                <span className="stat-title">Completion Goal</span>
              </div>
              <div className="stat-value">{Math.round((completedLessons / totalLessons) * 100)}%</div>
              <div className="stat-subtext">Target: 100%</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon red">📊</div>
                <span className="stat-title">Consistency</span>
              </div>
              <div className="stat-value">{Math.round((streakData.currentStreak / 30) * 100)}%</div>
              <div className="stat-subtext">30-day consistency</div>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Learning Patterns
            </h3>
            <div className="patterns-container">
              <div className="days-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const activity = Math.random() * 100;
                  return (
                    <div key={day} className="day-column">
                      <div className="day-label">{day}</div>
                      <div className="activity-bar-container">
                        <div
                          className="activity-bar"
                          style={{
                            height: `${activity}%`,
                            opacity: activity / 100,
                          }}
                        />
                      </div>
                      <div className="activity-percentage">
                        {Math.round(activity)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="patterns-note">
                You're most active on {learningStats.mostActiveDay}s
              </p>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="section">
            <h3 className="section-title">
              <span className="title-accent"></span>
              Learning Insights
            </h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">💡</div>
                <h4 className="insight-title">Peak Learning Time</h4>
                <p className="insight-text">You learn best in the evenings (7-9 PM)</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">⚡</div>
                <h4 className="insight-title">Learning Speed</h4>
                <p className="insight-text">
                  You're {completedLessons > 10 ? '20%' : '5%'} faster than average
                </p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <h4 className="insight-title">Focus Score</h4>
                <p className="insight-text">
                  You maintain focus for {learningStats.averageSessionLength} minutes on average
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Badge Detail Modal */}
      {showBadgeModal && selectedBadge && (
        <div className="modal-overlay" onClick={() => setShowBadgeModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBadgeModal(false)}>×</button>
            <div className="modal-badge">
              <div className="modal-badge-icon">{selectedBadge.icon}</div>
              <h3 className="modal-badge-name">{selectedBadge.name}</h3>
              <div className={`modal-badge-rarity ${selectedBadge.rarity}`}>
                {selectedBadge.rarity.toUpperCase()}
              </div>
              <p className="modal-badge-description">{selectedBadge.description}</p>
              {selectedBadge.achievedDate && (
                <p className="modal-badge-date">
                  Achieved on {new Date(selectedBadge.achievedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;