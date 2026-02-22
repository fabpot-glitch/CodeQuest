// ./pages/PreparePage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PreparePage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const sessionData = {
    'technical-mock-interview': {
      title: 'Technical Mock Interview',
      type: 'TECHNICAL',
      interviewer: 'Senior Engineer',
      date: 'Tomorrow',
      time: '2:00 PM (60 min)',
      preparation: [
        'Review data structures and algorithms',
        'Practice whiteboarding',
        'Prepare 2-3 questions for the interviewer',
        'Test your webcam and microphone'
      ]
    },
    'behavioral-session': {
      title: 'Behavioral Practice Session',
      type: 'BEHAVIORAL',
      interviewer: 'HR Manager',
      date: 'Jan 25, 2024',
      time: '11:00 AM (45 min)',
      preparation: [
        'Review common behavioral questions',
        'Prepare STAR method examples',
        'Research company culture',
        'Dress professionally'
      ]
    }
  };
  
  const session = sessionData[sessionId] || {
    title: 'Session Not Found',
    type: 'UNKNOWN',
    preparation: ['This session does not exist']
  };
  
  return (
    <div className="prepare-page">
      <button onClick={() => navigate(-1)}>← Back to Sessions</button>
      
      <h1>Prepare for {session.title}</h1>
      <div className="session-info">
        <p><strong>Type:</strong> {session.type}</p>
        <p><strong>Interviewer:</strong> {session.interviewer}</p>
        <p><strong>Date:</strong> {session.date}</p>
        <p><strong>Time:</strong> {session.time}</p>
      </div>
      
      <div className="preparation-checklist">
        <h2>Preparation Checklist</h2>
        <ul>
          {session.preparation.map((item, index) => (
            <li key={index}>
              <input type="checkbox" id={`item-${index}`} />
              <label htmlFor={`item-${index}`}>{item}</label>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="actions">
        <button onClick={() => alert('Starting mock interview...')}>
          Start Practice Session
        </button>
        <button onClick={() => navigate(`/dashboard/mockinterviews/practice-sessions/details/${sessionId}`)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default PreparePage;