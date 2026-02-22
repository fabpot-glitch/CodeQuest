import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionTypes.css';

const SessionTypes = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const sessionTypes = [
    {
      id: 'technical',
      title: 'Technical Interviews',
      icon: '💻',
      color: '#3b82f6',
      description: 'Practice coding challenges, algorithms, and system design with experienced engineers',
      longDescription: 'Master technical interviews through realistic practice sessions. Work on data structures, algorithms, and problem-solving with immediate feedback.',
      features: [
        'Live coding challenges',
        'Algorithm optimization',
        'System design discussions',
        'Code review and feedback',
        'Time-bound problem solving'
      ],
      formats: [
        { name: 'Coding Interview', duration: '60 min', difficulty: 'Medium' },
        { name: 'System Design', duration: '90 min', difficulty: 'Hard' },
        { name: 'Algorithm Practice', duration: '45 min', difficulty: 'Variable' }
      ],
      languages: ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
      companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
      stats: {
        sessions: '2,500+',
        interviewers: '150+',
        rating: '4.9',
        success: '85%'
      },
      image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interviews',
      icon: '🎯',
      color: '#10b981',
      description: 'Master STAR method and behavioral questions with HR professionals',
      longDescription: 'Ace behavioral interviews by learning how to structure your answers and highlight your achievements effectively.',
      features: [
        'STAR method training',
        'Leadership scenarios',
        'Conflict resolution',
        'Team collaboration examples',
        'Career goal discussions'
      ],
      formats: [
        { name: 'HR Screening', duration: '45 min', difficulty: 'Easy' },
        { name: 'In-depth Behavioral', duration: '60 min', difficulty: 'Medium' },
        { name: 'Leadership Assessment', duration: '75 min', difficulty: 'Hard' }
      ],
      languages: ['English', 'Spanish', 'French', 'German'],
      companies: ['All Industries', 'Tech', 'Finance', 'Consulting'],
      stats: {
        sessions: '1,800+',
        interviewers: '80+',
        rating: '4.8',
        success: '92%'
      },
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'system-design',
      title: 'System Design',
      icon: '🏗️',
      color: '#8b5cf6',
      description: 'Design scalable architectures and distributed systems',
      longDescription: 'Learn to design large-scale systems that handle millions of users. Perfect for senior and staff level interviews.',
      features: [
        'Scalability patterns',
        'Database design',
        'Microservices architecture',
        'Load balancing strategies',
        'Caching mechanisms'
      ],
      formats: [
        { name: 'Basic Design', duration: '60 min', difficulty: 'Medium' },
        { name: 'Advanced Architecture', duration: '90 min', difficulty: 'Hard' },
        { name: 'Case Study Review', duration: '75 min', difficulty: 'Hard' }
      ],
      languages: ['Architecture Diagrams', 'UML', 'Whiteboarding'],
      companies: ['Netflix', 'Uber', 'Airbnb', 'Twitter', 'Spotify'],
      stats: {
        sessions: '950+',
        interviewers: '60+',
        rating: '4.9',
        success: '78%'
      },
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'frontend',
      title: 'Frontend Development',
      icon: '🎨',
      color: '#f59e0b',
      description: 'Practice React, Vue, and frontend architecture interviews',
      longDescription: 'Specialize in frontend interviews with focus on modern frameworks, responsive design, and web performance.',
      features: [
        'Component design',
        'State management',
        'Performance optimization',
        'Responsive layouts',
        'Browser APIs'
      ],
      formats: [
        { name: 'React Deep Dive', duration: '60 min', difficulty: 'Medium' },
        { name: 'Frontend System Design', duration: '75 min', difficulty: 'Hard' },
        { name: 'CSS Architecture', duration: '45 min', difficulty: 'Medium' }
      ],
      languages: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript'],
      companies: ['Meta', 'Airbnb', 'Stripe', 'Shopify', 'Figma'],
      stats: {
        sessions: '1,200+',
        interviewers: '70+',
        rating: '4.8',
        success: '88%'
      },
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      icon: '📊',
      color: '#ec4899',
      description: 'ML algorithms, statistics, and data analysis interviews',
      longDescription: 'Prepare for data science interviews with focus on machine learning, statistical analysis, and business acumen.',
      features: [
        'ML algorithms',
        'Statistical analysis',
        'Python/R programming',
        'Data visualization',
        'Case studies'
      ],
      formats: [
        { name: 'ML Theory', duration: '60 min', difficulty: 'Hard' },
        { name: 'Coding Challenge', duration: '75 min', difficulty: 'Medium' },
        { name: 'Case Study', duration: '90 min', difficulty: 'Hard' }
      ],
      languages: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch'],
      companies: ['Google', 'Meta', 'Netflix', 'Spotify', 'LinkedIn'],
      stats: {
        sessions: '800+',
        interviewers: '50+',
        rating: '4.7',
        success: '82%'
      },
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'product-management',
      title: 'Product Management',
      icon: '📱',
      color: '#6366f1',
      description: 'Product sense, strategy, and execution interviews',
      longDescription: 'Master product management interviews with focus on product strategy, metrics, and stakeholder management.',
      features: [
        'Product strategy',
        'Metric definition',
        'User research',
        'Go-to-market planning',
        'Prioritization frameworks'
      ],
      formats: [
        { name: 'Product Sense', duration: '60 min', difficulty: 'Medium' },
        { name: 'Strategy Case', duration: '75 min', difficulty: 'Hard' },
        { name: 'Execution Review', duration: '60 min', difficulty: 'Medium' }
      ],
      languages: ['English', 'Case Studies', 'Whiteboarding'],
      companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'],
      stats: {
        sessions: '600+',
        interviewers: '40+',
        rating: '4.8',
        success: '86%'
      },
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowDetails(true);
  };

  const handleBookSession = () => {
    navigate(`/dashboard/mockinterviews/practice?type=${selectedType.id}`);
  };

  return (
    <div className="session-types">
      {/* Header */}
      <div className="types-header">
        <h1>Interview Practice Types</h1>
        <p>Choose the type of interview you want to practice</p>
      </div>

      {/* Types Grid */}
      <div className="types-grid">
        {sessionTypes.map((type) => (
          <div
            key={type.id}
            className={`type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
            onClick={() => handleTypeSelect(type)}
            style={{ borderTopColor: type.color }}
          >
            <div className="type-card-header">
              <div className="type-icon" style={{ backgroundColor: `${type.color}15`, color: type.color }}>
                {type.icon}
              </div>
              <h3>{type.title}</h3>
            </div>
            <p className="type-description">{type.description}</p>
            <div className="type-stats">
              <div className="stat">
                <span className="stat-value">{type.stats.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat">
                <span className="stat-value">{type.stats.rating}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{type.stats.success}</span>
                <span className="stat-label">Success</span>
              </div>
            </div>
            <div className="type-card-footer">
              <span className="companies-count">{type.companies.length}+ companies</span>
              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTypeSelect(type);
                }}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Type Details Modal */}
      {showDetails && selectedType && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="type-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
            
            <div className="modal-header" style={{ borderBottomColor: selectedType.color }}>
              <div className="modal-title">
                <div className="modal-icon" style={{ backgroundColor: `${selectedType.color}15`, color: selectedType.color }}>
                  {selectedType.icon}
                </div>
                <div>
                  <h2>{selectedType.title}</h2>
                  <p>{selectedType.longDescription}</p>
                </div>
              </div>
            </div>

            <div className="modal-body">
              {/* Image Section */}
              <div className="details-image">
                <img src={selectedType.image} alt={selectedType.title} />
              </div>

              {/* Features */}
              <div className="details-section">
                <h3>✨ Key Features</h3>
                <div className="features-list">
                  {selectedType.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-check">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Formats */}
              <div className="details-section">
                <h3>📋 Interview Formats</h3>
                <div className="formats-grid">
                  {selectedType.formats.map((format, idx) => (
                    <div key={idx} className="format-card">
                      <h4>{format.name}</h4>
                      <div className="format-meta">
                        <span>⏱️ {format.duration}</span>
                        <span className={`difficulty-badge ${format.difficulty.toLowerCase()}`}>
                          {format.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages/Tools */}
              <div className="details-section">
                <h3>🛠️ Languages & Tools</h3>
                <div className="tools-tags">
                  {selectedType.languages.map((lang, idx) => (
                    <span key={idx} className="tool-tag">{lang}</span>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div className="details-section">
                <h3>🏢 Interviewers from</h3>
                <div className="companies-grid">
                  {selectedType.companies.map((company, idx) => (
                    <div key={idx} className="company-badge">
                      {company}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="details-section">
                <h3>📊 Performance Stats</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-large">{selectedType.stats.sessions}</span>
                    <span className="stat-label">Practice Sessions</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-large">{selectedType.stats.interviewers}</span>
                    <span className="stat-label">Expert Interviewers</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-large">{selectedType.stats.rating}</span>
                    <span className="stat-label">Average Rating</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-large">{selectedType.stats.success}</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetails(false)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={handleBookSession}
                style={{ background: `linear-gradient(135deg, ${selectedType.color}, ${selectedType.color}dd)` }}
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Comparison Table */}
      <div className="comparison-section">
        <h2>Compare Interview Types</h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Focus Areas</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Technical</td>
                <td><span className="difficulty-badge medium">Medium-Hard</span></td>
                <td>45-90 min</td>
                <td>Algorithms, Data Structures</td>
                <td>Software Engineers</td>
              </tr>
              <tr>
                <td>Behavioral</td>
                <td><span className="difficulty-badge easy">Easy-Medium</span></td>
                <td>45-75 min</td>
                <td>Leadership, STAR Method</td>
                <td>All Roles</td>
              </tr>
              <tr>
                <td>System Design</td>
                <td><span className="difficulty-badge hard">Hard</span></td>
                <td>60-90 min</td>
                <td>Architecture, Scalability</td>
                <td>Senior Engineers</td>
              </tr>
              <tr>
                <td>Frontend</td>
                <td><span className="difficulty-badge medium">Medium</span></td>
                <td>45-75 min</td>
                <td>React, CSS, Performance</td>
                <td>Frontend Developers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I choose the right interview type?</h3>
            <p>Consider your target role and current skill level. If you're applying for software engineering positions, start with technical interviews. For leadership roles, focus on behavioral and system design.</p>
          </div>
          <div className="faq-item">
            <h3>Can I practice multiple types?</h3>
            <p>Yes! Many candidates practice multiple interview types. You can book different sessions based on your needs and schedule.</p>
          </div>
          <div className="faq-item">
            <h3>How experienced are the interviewers?</h3>
            <p>All our interviewers have 5+ years of industry experience and have conducted 100+ interviews at top tech companies.</p>
          </div>
          <div className="faq-item">
            <h3>Do you provide feedback?</h3>
            <p>Yes, every session includes detailed feedback and a recording for your review. You'll also get actionable improvement suggestions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTypes;