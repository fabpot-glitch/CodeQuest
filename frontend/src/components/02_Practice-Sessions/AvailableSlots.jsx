import React, { useState } from 'react';
import './PracticeSessionsDashboard.css';

const AvailableSlots = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [selectedType, setSelectedType] = useState('all');

  const timeSlots = [
    { id: 1, time: '09:00 AM', duration: '60 min', interviewer: 'Alex Chen', type: 'technical', rating: 4.9, experience: 'Senior Engineer at Google' },
    { id: 2, time: '10:30 AM', duration: '45 min', interviewer: 'Sarah Johnson', type: 'behavioral', rating: 4.8, experience: 'HR Director at Meta' },
    { id: 3, time: '01:00 PM', duration: '60 min', interviewer: 'Mike Wilson', type: 'system', rating: 4.7, experience: 'System Architect at Amazon' },
    { id: 4, time: '03:30 PM', duration: '45 min', interviewer: 'Emily Davis', type: 'technical', rating: 4.9, experience: 'Lead Developer at Microsoft' },
    { id: 5, time: '05:00 PM', duration: '60 min', interviewer: 'David Brown', type: 'case', rating: 4.6, experience: 'Product Manager at Apple' }
  ];

  const dates = [
    { date: '2024-01-15', day: 'Mon', month: 'Jan', available: 5 },
    { date: '2024-01-16', day: 'Tue', month: 'Jan', available: 8 },
    { date: '2024-01-17', day: 'Wed', month: 'Jan', available: 6 },
    { date: '2024-01-18', day: 'Thu', month: 'Jan', available: 7 },
    { date: '2024-01-19', day: 'Fri', month: 'Jan', available: 4 }
  ];

  const sessionTypes = [
    { id: 'all', name: 'All Types', icon: '🎯' },
    { id: 'technical', name: 'Technical', icon: '💻' },
    { id: 'behavioral', name: 'Behavioral', icon: '🗣️' },
    { id: 'system', name: 'System Design', icon: '🏗️' },
    { id: 'case', name: 'Case Study', icon: '📊' }
  ];

  const handleBookSlot = (slot) => {
    alert(`Booking ${slot.time} session with ${slot.interviewer}\nType: ${slot.type}\nDuration: ${slot.duration}`);
  };

  const filteredSlots = timeSlots.filter(slot => 
    selectedType === 'all' || slot.type.toLowerCase() === selectedType.toLowerCase()
  );

  return (
    <div className="available-slots">
      <div className="header-section">
        <h1>Available Time Slots</h1>
        <p>Book your mock interview sessions with experienced interviewers from top tech companies</p>
      </div>

      <div className="date-picker">
        <h3>📅 Select Date</h3>
        <div className="dates-grid">
          {dates.map(date => (
            <div 
              key={date.date}
              className={`date-card ${selectedDate === date.date ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date.date)}
            >
              <div className="date-day">{date.day}</div>
              <div className="date-number">{date.date.split('-')[2]}</div>
              <div className="date-month">{date.month}</div>
              <div className="slots-available">{date.available} slots</div>
            </div>
          ))}
        </div>
      </div>

      <div className="filters-section">
        <h3>🔍 Filter by Session Type</h3>
        <div className="type-filters">
          {sessionTypes.map(type => (
            <button
              key={type.id}
              className={`type-filter ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <span className="filter-icon">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="slots-section">
        <h3>⏰ Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
        
        {filteredSlots.length === 0 ? (
          <div className="no-slots" style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: 'var(--gray-50)', 
            borderRadius: 'var(--radius-lg)',
            color: 'var(--gray-600)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>No slots available</h3>
            <p>Please try a different date or session type</p>
          </div>
        ) : (
          <div className="slots-list">
            {filteredSlots.map(slot => (
              <div key={slot.id} className="slot-card">
                <div className="slot-time">
                  <div className="time">{slot.time}</div>
                  <div className="duration">{slot.duration}</div>
                </div>
                
                <div className="slot-details">
                  <div className="interviewer">
                    <span className="label">👤 Interviewer:</span>
                    <span className="value">{slot.interviewer}</span>
                  </div>
                  <div className="interviewer">
                    <span className="label">💼 Experience:</span>
                    <span className="value">{slot.experience}</span>
                  </div>
                  <div className="type">
                    <span className="label">📋 Type:</span>
                    <span className={`type-value ${slot.type.toLowerCase()}`}>
                      {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                    </span>
                  </div>
                  <div className="interviewer">
                    <span className="label">⭐ Rating:</span>
                    <span className="value" style={{ color: 'var(--warning-600)' }}>{slot.rating}/5.0</span>
                  </div>
                </div>

                <div className="slot-actions">
                  <button 
                    className="book-btn"
                    onClick={() => handleBookSlot(slot)}
                  >
                    📅 Book Slot
                  </button>
                  <button className="details-btn">
                    👁️ View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tips-section">
        <h3>💡 Booking Tips</h3>
        <div className="tips">
          <div className="tip">
            <span className="tip-icon">⏰</span>
            <span>Book at least 24 hours in advance to ensure availability and give yourself time to prepare</span>
          </div>
          <div className="tip">
            <span className="tip-icon">📝</span>
            <span>Prepare specific questions or topics you want to focus on beforehand for a more productive session</span>
          </div>
          <div className="tip">
            <span className="tip-icon">🎯</span>
            <span>Choose interviewers based on their experience at your target companies for relevant insights</span>
          </div>
          <div className="tip">
            <span className="tip-icon">💬</span>
            <span>Review the interviewer's profile and expertise to match with your preparation needs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableSlots;