import React, { useState } from 'react';
import { FiAward, FiStar, FiTarget, FiTrendingUp, FiCheck, FiLock, FiZap } from 'react-icons/fi';

const AchievementsPage = () => {
  const [filter, setFilter] = useState('all');

  const achievements = [
    {
      id: 1,
      title: 'Resume Master',
      description: 'Complete all resume sections',
      icon: <FiAward />,
      points: 100,
      unlocked: true,
      progress: 100,
      category: 'resume'
    },
    {
      id: 2,
      title: 'Problem Solver',
      description: 'Solve 100 coding problems',
      icon: <FiStar />,
      points: 200,
      unlocked: true,
      progress: 80,
      category: 'coding'
    },
    {
      id: 3,
      title: 'Interview Pro',
      description: 'Complete 10 mock interviews',
      icon: <FiTarget />,
      points: 150,
      unlocked: false,
      progress: 60,
      category: 'interview'
    },
    {
      id: 4,
      title: 'Learning Champion',
      description: 'Complete 5 courses',
      icon: <FiTrendingUp />,
      points: 120,
      unlocked: true,
      progress: 100,
      category: 'learning'
    },
    {
      id: 5,
      title: 'Contest Winner',
      description: 'Win a coding contest',
      icon: <FiZap />,
      points: 300,
      unlocked: false,
      progress: 0,
      category: 'contest'
    },
    {
      id: 6,
      title: 'Perfect Resume',
      description: 'Export resume in all formats',
      icon: <FiCheck />,
      points: 80,
      unlocked: true,
      progress: 100,
      category: 'resume'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Achievements', icon: <FiAward /> },
    { id: 'resume', label: 'Resume Builder', icon: <FiCheck /> },
    { id: 'coding', label: 'Coding', icon: <FiStar /> },
    { id: 'interview', label: 'Interview', icon: <FiTarget /> },
    { id: 'learning', label: 'Learning', icon: <FiTrendingUp /> }
  ];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-page">
      <div className="page-header">
        <h1><FiAward /> Achievements</h1>
        <p className="subtitle">Track your progress and earn badges</p>
      </div>

      <div className="achievements-stats">
        <div className="stat-card">
          <div className="stat-value">{unlockedCount}</div>
          <div className="stat-label">Unlocked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{achievements.length}</div>
          <div className="stat-label">Total Achievements</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Gold</div>
          <div className="stat-label">Current Rank</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="achievements-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${filter === category.id ? 'active' : ''}`}
            onClick={() => setFilter(category.id)}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">
              {achievement.unlocked ? achievement.icon : <FiLock />}
            </div>
            
            <div className="achievement-content">
              <div className="achievement-header">
                <h4>{achievement.title}</h4>
                <span className="achievement-points">{achievement.points} pts</span>
              </div>
              
              <p className="achievement-description">{achievement.description}</p>
              
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{achievement.progress}%</span>
              </div>
              
              <div className="achievement-status">
                {achievement.unlocked ? (
                  <span className="status-badge unlocked">
                    <FiCheck /> Unlocked
                  </span>
                ) : (
                  <span className="status-badge locked">
                    <FiLock /> Locked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="achievements-leaderboard">
        <h3><FiTrendingUp /> Top Achievers</h3>
        <div className="leaderboard-list">
          <div className="leaderboard-item">
            <span className="rank">1</span>
            <div className="user-info">
              <span className="user-name">Alex Johnson</span>
              <span className="user-title">Senior Developer</span>
            </div>
            <span className="user-points">450 pts</span>
          </div>
          <div className="leaderboard-item">
            <span className="rank">2</span>
            <div className="user-info">
              <span className="user-name">Sarah Miller</span>
              <span className="user-title">Data Scientist</span>
            </div>
            <span className="user-points">380 pts</span>
          </div>
          <div className="leaderboard-item">
            <span className="rank">3</span>
            <div className="user-info">
              <span className="user-name">Mike Chen</span>
              <span className="user-title">Full Stack Dev</span>
            </div>
            <span className="user-points">320 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;