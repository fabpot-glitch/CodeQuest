// components/Sidebar/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const navigationItems = [
    { id: 1, name: 'Dashboard', icon: '📊' },
    { id: 2, name: 'Problems', icon: '❓' },
    { id: 3, name: 'Submissions', icon: '📤' },
    { id: 4, name: 'Contests', icon: '🏆' },
    { id: 5, name: 'Leaderboard', icon: '📈' },
    { id: 6, name: 'Courses', icon: '📚' },
    { id: 7, name: 'Learning Paths', icon: '🛤️' },
    { id: 8, name: 'Mock Interviews', icon: '🎤' },
    { id: 9, name: 'Resume Builder', icon: '📝', active: true },
    { id: 10, name: 'Profile', icon: '👤' },
    { id: 11, name: 'Admin', icon: '⚙️' }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">NAVIGATION</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <div className="nav-item-content">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;