import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MockInterviewDashboard.css';

const MockInterviewsDashboard = () => {
  const [registeredSessions, setRegisteredSessions] = useState([1, 2]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState({
    totalSessions: 12,
    averageScore: 78,
    completionRate: 85,
    totalHours: 18.5,
    skillsProgress: [
      { name: 'Algorithms', progress: 75, target: 90 },
      { name: 'System Design', progress: 60, target: 85 },
      { name: 'Behavioral', progress: 85, target: 90 },
      { name: 'Data Structures', progress: 70, target: 85 }
    ],
    recentSessions: [
      { date: '2024-01-15', type: 'Technical', score: 82, feedback: 'Good problem solving approach' },
      { date: '2024-01-12', type: 'Behavioral', score: 88, feedback: 'Excellent communication' },
      { date: '2024-01-10', type: 'System Design', score: 75, feedback: 'Need more practice on scalability' }
    ],
    goals: [
      { id: 1, name: 'Complete 20 practice sessions', progress: 60, target: 20, current: 12, deadline: '2024-03-01' },
      { id: 2, name: 'Achieve 85% average score', progress: 78, target: 85, current: 78, deadline: '2024-04-01' },
      { id: 3, name: 'Master System Design', progress: 60, target: 100, current: 60, deadline: '2024-05-01' }
    ],
    milestones: [
      { id: 1, name: 'First Technical Interview', achieved: true, date: '2024-01-05' },
      { id: 2, name: 'Complete 5 Sessions', achieved: true, date: '2024-01-10' },
      { id: 3, name: 'Score 80%+ in Technical', achieved: true, date: '2024-01-15' },
      { id: 4, name: 'Complete 10 Sessions', achieved: false, progress: 60 },
      { id: 5, name: 'Score 85%+ Average', achieved: false, progress: 78 }
    ],
    weeklyProgress: [
      { week: 'Week 1', sessions: 3, avgScore: 72 },
      { week: 'Week 2', sessions: 4, avgScore: 75 },
      { week: 'Week 3', sessions: 3, avgScore: 78 },
      { week: 'Week 4', sessions: 2, avgScore: 82 }
    ]
  });

  const features = [
    {
      id: 1,
      title: 'Interview Preparation',
      description: 'Access comprehensive study materials, templates, and guides',
      buttonText: 'Start Preparing',
      path: '/dashboard/mockinterviews/preparation',
      icon: '📚',
      color: '#3b82f6',
      progress: 65,
      stats: '12 resources'
    },
    {
      id: 2,
      title: 'Practice Sessions',
      description: 'Schedule and conduct mock interviews with feedback',
      buttonText: 'Schedule Session',
      path: '/dashboard/mockinterviews/practice',
      icon: '🎯',
      color: '#10b981',
      progress: 40,
      stats: '3 upcoming'
    },
    {
      id: 3,
      title: 'Session Recordings',
      description: 'Review and analyze your past interview performances',
      buttonText: 'View Library',
      path: '/dashboard/mockinterviews/recordings',
      icon: '🎥',
      color: '#8b5cf6',
      progress: 30,
      stats: '8 recordings'
    },
    {
      id: 4,
      title: 'Performance Tracking',
      description: 'Track your progress, set goals, and achieve milestones',
      buttonText: 'View Analytics',
      path: '/dashboard/mockinterviews/performance',
      icon: '📊',
      color: '#f59e0b',
      progress: 75,
      stats: '78% avg score'
    }
  ];

  const quickStats = [
    { label: 'Practice Sessions', value: performanceData.totalSessions.toString(), icon: '🎯', trend: '+3 this week' },
    { label: 'Avg. Score', value: `${performanceData.averageScore}%`, icon: '⭐', trend: '+5% improvement' },
    { label: 'Completion Rate', value: `${performanceData.completionRate}%`, icon: '✅', trend: 'On track' },
    { label: 'Next Session', value: 'Tomorrow', icon: '⏰', trend: '2:00 PM' }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: 'Technical Mock Interview',
      type: 'technical',
      date: 'Tomorrow',
      time: '2:00 PM',
      duration: '60 min',
      interviewer: 'Sarah Johnson',
      interviewerRole: 'Senior Software Engineer @ Google',
      interviewerAvatar: '👩‍💼',
      interviewerBio: '10+ years of experience in software engineering. Specialized in data structures, algorithms, and system design. Has conducted 500+ technical interviews.',
      difficulty: 'Medium',
      topics: ['Data Structures', 'Algorithms', 'Problem Solving'],
      spotsLeft: 3,
      totalSpots: 10,
      description: 'Practice coding problems and technical concepts with experienced interviewer',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      prerequisites: ['Laptop with webcam', 'Stable internet connection', 'Code editor of your choice'],
      agenda: [
        'Introduction and ice-breaking (5 min)',
        'Technical problem solving (35 min)',
        'Q&A session (10 min)',
        'Feedback and next steps (10 min)'
      ]
    },
    {
      id: 2,
      title: 'Behavioral Practice',
      type: 'behavioral',
      date: 'Jan 25',
      time: '11:00 AM',
      duration: '45 min',
      interviewer: 'Mike Chen',
      interviewerRole: 'Engineering Manager @ Amazon',
      interviewerAvatar: '👨‍💼',
      interviewerBio: 'Engineering Manager with 8 years of leadership experience. Expert in behavioral interviews and team dynamics.',
      difficulty: 'Easy',
      topics: ['Leadership', 'Teamwork', 'Conflict Resolution'],
      spotsLeft: 5,
      totalSpots: 8,
      description: 'Master behavioral questions using the STAR method with real scenarios',
      meetingLink: 'https://zoom.us/j/123456789',
      prerequisites: ['Prepare 3-4 STAR stories', 'Review your resume', 'Quiet environment'],
      agenda: [
        'Introduction (5 min)',
        'Behavioral questions practice (30 min)',
        'Feedback discussion (10 min)'
      ]
    },
    {
      id: 3,
      title: 'System Design Workshop',
      type: 'system-design',
      date: 'Jan 27',
      time: '3:00 PM',
      duration: '90 min',
      interviewer: 'Alex Rivera',
      interviewerRole: 'Staff Engineer @ Netflix',
      interviewerAvatar: '👨‍🔬',
      interviewerBio: 'Staff Engineer specializing in distributed systems and scalable architectures. Built systems serving millions of users.',
      difficulty: 'Hard',
      topics: ['Scalability', 'Microservices', 'Database Design'],
      spotsLeft: 2,
      totalSpots: 6,
      description: 'Design large-scale systems and learn architectural best practices',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      prerequisites: ['Whiteboard/drawing tool', 'Basic understanding of distributed systems', 'Familiarity with common system design patterns'],
      agenda: [
        'System design problem introduction (10 min)',
        'Design discussion and diagramming (60 min)',
        'Review and best practices (15 min)',
        'Q&A (5 min)'
      ]
    },
    {
      id: 4,
      title: 'Frontend Interview Prep',
      type: 'technical',
      date: 'Jan 28',
      time: '1:00 PM',
      duration: '75 min',
      interviewer: 'Emily Rodriguez',
      interviewerRole: 'Lead Frontend Engineer @ Meta',
      interviewerAvatar: '👩‍💻',
      interviewerBio: 'Lead Frontend Engineer with expertise in React, TypeScript, and web performance optimization. Has interviewed 300+ frontend candidates.',
      difficulty: 'Medium',
      topics: ['React', 'JavaScript', 'CSS', 'Performance'],
      spotsLeft: 4,
      totalSpots: 8,
      description: 'Deep dive into frontend technologies and component design patterns',
      meetingLink: 'https://meet.google.com/frontend-prep-123',
      prerequisites: ['Code editor setup', 'Node.js installed', 'Portfolio/projects ready to discuss'],
      agenda: [
        'Frontend concepts discussion (20 min)',
        'Live coding challenge (40 min)',
        'Code review and optimization (10 min)',
        'Feedback session (5 min)'
      ]
    }
  ];

  const performanceMetrics = [
    { name: 'Communication', value: 75, trend: '+5% from last month', color: '#3b82f6' },
    { name: 'Problem Solving', value: 82, trend: '+8% from last month', color: '#10b981' },
    { name: 'Technical Knowledge', value: 68, trend: '+3% from last month', color: '#f59e0b' }
  ];

  const quickTips = [
    {
      icon: '💡',
      title: 'Practice with Time Limits',
      description: 'Simulate real interview conditions by setting strict time limits for your practice sessions'
    },
    {
      icon: '🎯',
      title: 'Focus on Weak Areas',
      description: 'Use your performance analytics to identify and improve your weakest skills'
    },
    {
      icon: '🎥',
      title: 'Review Recordings',
      description: 'Watch your past sessions to identify body language and communication patterns'
    },
    {
      icon: '📝',
      title: 'Take Notes',
      description: 'Document key learnings and feedback after each practice session for continuous improvement'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your performance metrics and celebrate milestones to stay motivated'
    },
    {
      icon: '🎯',
      title: 'Set SMART Goals',
      description: 'Define Specific, Measurable, Achievable, Relevant, and Time-bound goals for your interview prep'
    }
  ];

  const handleRegister = (session) => {
    setSelectedSession(session);
    setShowRegisterModal(true);
  };

  const confirmRegistration = () => {
    if (selectedSession) {
      setRegisteredSessions([...registeredSessions, selectedSession.id]);
      setShowRegisterModal(false);
      setSelectedSession(null);
    }
  };

  const handleCancelRegistration = (sessionId) => {
    setRegisteredSessions(registeredSessions.filter(id => id !== sessionId));
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const handleJoinSession = (session) => {
    setSelectedSession(session);
    setShowJoinModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setShowJoinModal(false);
    setShowRegisterModal(false);
    setSelectedSession(null);
  };

  return (
    <div className="mock-interviews-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Mock Interview Platform</h1>
          <p>Practice, prepare, and perfect your interview skills</p>
        </div>
        <div className="header-actions">
          <div className="next-session-card">
            <div className="next-session-label">Next Session</div>
            <div className="next-session-date">Tomorrow</div>
            <div className="next-session-time">2:00 PM</div>
          </div>
          <Link to="/dashboard/mockinterviews/practice" className="primary-btn">
            <span className="btn-icon">+</span>
            Schedule Session
          </Link>
        </div>
      </div>

      {/* Simplified Tab Navigation - Only Overview Tab */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats Grid */}
            <div className="stats-grid">
              {quickStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">{stat.icon}</span>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-trend">{stat.trend}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Sections */}
            <div className="dashboard-sections">
              {/* Upcoming Sessions Section */}
              <div className="section">
                <div className="section-header">
                  <h2 className="upcoming">Upcoming Sessions</h2>
                  <Link to="/dashboard/mockinterviews/practice" className="view-all-link">
                    View All
                  </Link>
                </div>
                <div className="sessions-grid-enhanced">
                  {upcomingSessions.slice(0, 2).map(session => {
                    const isRegistered = registeredSessions.includes(session.id);
                    return (
                      <div key={session.id} className={`session-card-enhanced ${isRegistered ? 'registered' : ''}`}>
                        <div className="session-header-enhanced">
                          <div className={`session-type-badge ${session.type}`}>
                            {session.type === 'technical' && '💻'}
                            {session.type === 'behavioral' && '🎯'}
                            {session.type === 'system-design' && '🏗️'}
                            <span>{session.type.replace('-', ' ')}</span>
                          </div>
                          <div className={`difficulty-badge ${session.difficulty.toLowerCase()}`}>
                            {session.difficulty}
                          </div>
                        </div>

                        <h3 className="session-title-enhanced">{session.title}</h3>
                        <p className="session-description">{session.description}</p>

                        <div className="interviewer-info">
                          <div className="interviewer-avatar">{session.interviewerAvatar}</div>
                          <div className="interviewer-details">
                            <div className="interviewer-name">{session.interviewer}</div>
                            <div className="interviewer-role">{session.interviewerRole}</div>
                          </div>
                        </div>

                        <div className="session-details-grid">
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div className="detail-content">
                              <span className="detail-label">Date & Time</span>
                              <span className="detail-value">{session.date}, {session.time}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">⏱️</span>
                            <div className="detail-content">
                              <span className="detail-label">Duration</span>
                              <span className="detail-value">{session.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="session-topics">
                          <span className="topics-label">Topics:</span>
                          <div className="topics-tags">
                            {session.topics.map((topic, idx) => (
                              <span key={idx} className="topic-tag">{topic}</span>
                            ))}
                          </div>
                        </div>

                        <div className="spots-info">
                          <div className="spots-bar">
                            <div 
                              className="spots-filled" 
                              style={{ width: `${((session.totalSpots - session.spotsLeft) / session.totalSpots) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`spots-text ${session.spotsLeft <= 2 ? 'urgent' : ''}`}>
                            {session.spotsLeft} spots left out of {session.totalSpots}
                          </span>
                        </div>

                        <div className="session-actions-enhanced">
                          {isRegistered ? (
                            <>
                              <button 
                                className="btn-join"
                                onClick={() => handleJoinSession(session)}
                              >
                                <span>🎥</span> Join Session
                              </button>
                              <button 
                                className="btn-cancel"
                                onClick={() => handleCancelRegistration(session.id)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="btn-register"
                                onClick={() => handleRegister(session)}
                                disabled={session.spotsLeft === 0}
                              >
                                {session.spotsLeft === 0 ? '⏸️ Full' : '✓ Register'}
                              </button>
                              <button 
                                className="btn-details"
                                onClick={() => handleViewDetails(session)}
                              >
                                View Details
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Metrics Section */}
              <div className="section">
                <div className="section-header">
                  <h2 className="metrics">Performance Metrics</h2>
                  <Link to="/dashboard/mockinterviews/performance" className="view-all-link">
                    View Details
                  </Link>
                </div>
                <div className="metrics-grid">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                      <div className="metric-header">
                        <span className="metric-name">{metric.name}</span>
                        <span className="metric-value">{metric.value}%</span>
                      </div>
                      <div className="metric-bar-container">
                        <div 
                          className="metric-bar-fill" 
                          style={{ 
                            width: `${metric.value}%`,
                            background: `linear-gradient(90deg, ${metric.color}, ${metric.color}dd)`
                          }}
                        ></div>
                      </div>
                      <div className="metric-trend up">{metric.trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips Section */}
              <div className="section">
                <div className="section-header">
                  <h2 className="tips">Quick Tips</h2>
                </div>
                <div className="tips-grid">
                  {quickTips.slice(0, 4).map((tip, index) => (
                    <div key={index} className="tip-card">
                      <div className="tip-icon">{tip.icon}</div>
                      <div className="tip-content">
                        <h4>{tip.title}</h4>
                        <p>{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Section */}
              <div className="features-section">
                <div className="section-header">
                  <h2>Practice Modules</h2>
                </div>
                <div className="features-grid">
                  {features.map(feature => (
                    <div key={feature.id} className="feature-card">
                      <div className="progress-circle" style={{
                        background: `conic-gradient(${feature.color} 0deg ${(feature.progress / 100) * 360}deg, #e2e8f0 ${(feature.progress / 100) * 360}deg 360deg)`
                      }}>
                        <span>{feature.progress}%</span>
                      </div>
                      <div className="feature-card-header">
                        <div className="feature-icon" style={{ backgroundColor: `${feature.color}15` }}>
                          <span style={{ color: feature.color }}>{feature.icon}</span>
                        </div>
                      </div>
                      <div className="feature-card-body">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                      <Link 
                        to={feature.path} 
                        className="card-button"
                        style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)` }}
                      >
                        {feature.buttonText}
                        <span className="btn-arrow">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div className={`session-type-badge ${selectedSession.type}`}>
                {selectedSession.type === 'technical' && '💻'}
                {selectedSession.type === 'behavioral' && '🎯'}
                {selectedSession.type === 'system-design' && '🏗️'}
                <span>{selectedSession.type.replace('-', ' ')}</span>
              </div>
              <h2>{selectedSession.title}</h2>
              <p className="modal-description">{selectedSession.description}</p>
            </div>

            <div className="modal-body">
              {/* Interviewer Section */}
              <div className="modal-section">
                <h3>👤 About the Interviewer</h3>
                <div className="interviewer-detail">
                  <div className="interviewer-avatar-large">{selectedSession.interviewerAvatar}</div>
                  <div>
                    <h4>{selectedSession.interviewer}</h4>
                    <p className="interviewer-role-modal">{selectedSession.interviewerRole}</p>
                    <p className="interviewer-bio">{selectedSession.interviewerBio}</p>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="modal-section">
                <h3>📅 Session Details</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label-modal">Date & Time:</span>
                    <span className="detail-value-modal">{selectedSession.date}, {selectedSession.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label-modal">Duration:</span>
                    <span className="detail-value-modal">{selectedSession.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label-modal">Difficulty:</span>
                    <span className={`difficulty-badge ${selectedSession.difficulty.toLowerCase()}`}>
                      {selectedSession.difficulty}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label-modal">Available Spots:</span>
                    <span className="detail-value-modal">{selectedSession.spotsLeft} / {selectedSession.totalSpots}</span>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="modal-section">
                <h3>📚 Topics Covered</h3>
                <div className="topics-tags">
                  {selectedSession.topics.map((topic, idx) => (
                    <span key={idx} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div className="modal-section">
                <h3>📋 Session Agenda</h3>
                <ul className="agenda-list">
                  {selectedSession.agenda.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div className="modal-section">
                <h3>✅ Prerequisites</h3>
                <ul className="prerequisites-list">
                  {selectedSession.prerequisites.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-secondary" onClick={closeModal}>
                Close
              </button>
              <button 
                className="btn-modal-primary"
                onClick={() => {
                  closeModal();
                  handleRegister(selectedSession);
                }}
                disabled={selectedSession.spotsLeft === 0}
              >
                {selectedSession.spotsLeft === 0 ? 'Session Full' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-join" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div className="join-icon">🎥</div>
              <h2>Join Session</h2>
              <p className="modal-description">{selectedSession.title}</p>
            </div>

            <div className="modal-body">
              <div className="join-info">
                <div className="join-detail">
                  <span className="join-label">📅 Date & Time:</span>
                  <span className="join-value">{selectedSession.date}, {selectedSession.time}</span>
                </div>
                <div className="join-detail">
                  <span className="join-label">⏱️ Duration:</span>
                  <span className="join-value">{selectedSession.duration}</span>
                </div>
                <div className="join-detail">
                  <span className="join-label">👤 Interviewer:</span>
                  <span className="join-value">{selectedSession.interviewer}</span>
                </div>
              </div>

              <div className="meeting-link-section">
                <h3>🔗 Meeting Link</h3>
                <div className="meeting-link-box">
                  <input 
                    type="text" 
                    value={selectedSession.meetingLink} 
                    readOnly 
                    className="meeting-link-input"
                  />
                  <button 
                    className="copy-link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSession.meetingLink);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="checklist-section">
                <h3>✅ Pre-Session Checklist</h3>
                <ul className="checklist">
                  <li>
                    <input type="checkbox" id="check1" />
                    <label htmlFor="check1">Camera and microphone are working</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check2" />
                    <label htmlFor="check2">In a quiet environment</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check3" />
                    <label htmlFor="check3">Have all necessary materials ready</label>
                  </li>
                  <li>
                    <input type="checkbox" id="check4" />
                    <label htmlFor="check4">Reviewed session agenda</label>
                  </li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-secondary" onClick={closeModal}>
                Cancel
              </button>
              <a 
                href={selectedSession.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-primary"
              >
                🚀 Launch Meeting
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Register Confirmation Modal */}
      {showRegisterModal && selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-register" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div className="register-icon">✓</div>
              <h2>Confirm Registration</h2>
              <p className="modal-description">You're about to register for this session</p>
            </div>

            <div className="modal-body">
              <div className="session-summary">
                <h3>{selectedSession.title}</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="summary-icon">📅</span>
                    <span>{selectedSession.date}, {selectedSession.time}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">⏱️</span>
                    <span>{selectedSession.duration}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">👤</span>
                    <span>{selectedSession.interviewer}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-icon">📊</span>
                    <span className={`difficulty-badge ${selectedSession.difficulty.toLowerCase()}`}>
                      {selectedSession.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="registration-notes">
                <h4>📝 Important Notes:</h4>
                <ul>
                  <li>You'll receive a confirmation email with meeting details</li>
                  <li>A calendar invite will be sent to your email</li>
                  <li>You can cancel up to 2 hours before the session</li>
                  <li>Please join 5 minutes early for technical setup</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn-modal-primary"
                onClick={confirmRegistration}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewsDashboard;