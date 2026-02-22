import React from 'react';
import { FiMap, FiTarget, FiCheckCircle, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';

const LearningPathsPage = () => {
  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Developer',
      description: 'Become a full-stack developer with modern technologies',
      level: 'Beginner to Advanced',
      duration: '6 months',
      courses: 12,
      students: 3200,
      progress: 45,
      icon: <FiMap />,
      color: '#2196F3'
    },
    {
      id: 2,
      title: 'Data Scientist',
      description: 'Master data science and machine learning',
      level: 'Intermediate to Advanced',
      duration: '8 months',
      courses: 15,
      students: 2100,
      progress: 20,
      icon: <FiTarget />,
      color: '#4CAF50'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      description: 'Learn DevOps practices and tools',
      level: 'Intermediate',
      duration: '4 months',
      courses: 10,
      students: 1800,
      progress: 0,
      icon: <FiTrendingUp />,
      color: '#FF9800'
    },
    {
      id: 4,
      title: 'Mobile Developer',
      description: 'Build iOS and Android applications',
      level: 'Beginner to Intermediate',
      duration: '5 months',
      courses: 8,
      students: 1500,
      progress: 100,
      icon: <FiUsers />,
      color: '#9C27B0'
    }
  ];

  return (
    <div className="learning-paths-page">
      <div className="page-header">
        <h1><FiMap /> Learning Paths</h1>
        <p className="subtitle">Structured learning journeys for career growth</p>
      </div>

      <div className="paths-stats">
        <div className="stat-card">
          <div className="stat-value">{learningPaths.length}</div>
          <div className="stat-label">Learning Paths</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{learningPaths.reduce((sum, path) => sum + path.courses, 0)}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{learningPaths.reduce((sum, path) => sum + path.students, 0)}</div>
          <div className="stat-label">Active Learners</div>
        </div>
      </div>

      <div className="paths-grid">
        {learningPaths.map(path => (
          <div key={path.id} className="path-card">
            <div className="path-header" style={{ backgroundColor: path.color }}>
              <div className="path-icon">{path.icon}</div>
              <div className="path-level">{path.level}</div>
            </div>
            
            <div className="path-content">
              <h3>{path.title}</h3>
              <p className="path-description">{path.description}</p>
              
              <div className="path-meta">
                <span className="meta-item">
                  <FiClock /> {path.duration}
                </span>
                <span className="meta-item">
                  <FiTarget /> {path.courses} courses
                </span>
                <span className="meta-item">
                  <FiUsers /> {path.students.toLocaleString()} students
                </span>
              </div>
              
              {path.progress > 0 ? (
                <div className="path-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{path.progress}% Complete</span>
                </div>
              ) : null}
              
              <div className="path-courses">
                <h4>Courses in this path:</h4>
                <ul className="courses-list">
                  <li><FiCheckCircle /> Introduction to Programming</li>
                  <li><FiCheckCircle /> Data Structures</li>
                  <li><FiCheckCircle /> Web Fundamentals</li>
                  <li><FiCheckCircle /> Advanced Topics</li>
                </ul>
              </div>
              
              <div className="path-actions">
                {path.progress === 0 ? (
                  <button className="path-btn primary">
                    Start Learning Path
                  </button>
                ) : path.progress === 100 ? (
                  <button className="path-btn success">
                    <FiCheckCircle /> Completed
                  </button>
                ) : (
                  <button className="path-btn primary">
                    Continue Path
                  </button>
                )}
                <button className="path-btn">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathsPage;