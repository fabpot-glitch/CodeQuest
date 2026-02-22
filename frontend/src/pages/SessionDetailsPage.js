// ./pages/SessionDetailsPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SessionDetailsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const sessionData = {
    'technical-mock-interview': {
      title: 'Technical Mock Interview',
      status: 'Confirmed',
      description: 'A mock technical interview focusing on data structures, algorithms, and system design.',
      interviewer: {
        name: 'Senior Engineer',
        experience: '8+ years at FAANG companies',
        expertise: ['Backend Systems', 'Scalability', 'Cloud Architecture']
      },
      format: 'Video Call',
      duration: '60 minutes',
      topics: ['Data Structures', 'Algorithms', 'System Design', 'Coding Problems'],
      materials: [
        'Coding environment setup',
        'Problem statement documents',
        'Interview evaluation rubric'
      ]
    },
    'behavioral-session': {
      title: 'Behavioral Practice Session',
      status: 'Scheduled',
      description: 'Practice session for behavioral interview questions using the STAR method.',
      interviewer: {
        name: 'HR Manager',
        experience: '5+ years in tech recruiting',
        expertise: ['Behavioral Interviews', 'Cultural Fit', 'Career Development']
      },
      format: 'Video Call',
      duration: '45 minutes',
      topics: ['Leadership', 'Conflict Resolution', 'Teamwork', 'Career Goals'],
      materials: [
        'STAR method guide',
        'Common behavioral questions',
        'Company research document'
      ]
    }
  };
  
  const session = sessionData[sessionId] || {
    title: 'Session Not Found',
    description: 'This session does not exist.'
  };
  
  return (
    <div className="session-details-page">
      <button onClick={() => navigate(-1)}>← Back</button>
      
      <div className="session-header">
        <h1>{session.title}</h1>
        <span className={`status-badge ${session.status?.toLowerCase()}`}>
          {session.status || 'Unknown'}
        </span>
      </div>
      
      <div className="details-grid">
        <div className="detail-section">
          <h3>Description</h3>
          <p>{session.description}</p>
        </div>
        
        <div className="detail-section">
          <h3>Interviewer</h3>
          <p><strong>Name:</strong> {session.interviewer?.name}</p>
          <p><strong>Experience:</strong> {session.interviewer?.experience}</p>
          <p><strong>Expertise:</strong></p>
          <ul>
            {(session.interviewer?.expertise || []).map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>
        </div>
        
        <div className="detail-section">
          <h3>Session Details</h3>
          <p><strong>Format:</strong> {session.format || 'Not specified'}</p>
          <p><strong>Duration:</strong> {session.duration || 'Not specified'}</p>
          <p><strong>Topics:</strong></p>
          <ul>
            {(session.topics || []).map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
        
        <div className="detail-section">
          <h3>Materials</h3>
          <ul>
            {(session.materials || []).map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="action-buttons">
        <button onClick={() => navigate(`/dashboard/mockinterviews/practice-sessions/prepare/${sessionId}`)}>
          Prepare
        </button>
        <button onClick={() => alert('Rescheduling...')}>
          Reschedule
        </button>
        <button onClick={() => alert('Cancelling...')}>
          Cancel Session
        </button>
      </div>
    </div>
  );
};

export default SessionDetailsPage;