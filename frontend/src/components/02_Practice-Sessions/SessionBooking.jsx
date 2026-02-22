import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SessionBooking.css';

const SessionBooking = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    session: null,
    date: null,
    time: null,
    interviewer: null,
    preparation: [],
    notes: '',
    agreement: false
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data - In real app, fetch based on sessionId
  const sessionDetails = {
    id: sessionId,
    title: 'Technical Interview Practice',
    type: 'technical',
    description: 'Practice coding problems and technical concepts with experienced interviewer',
    duration: '60 min',
    price: 'Free',
    interviewer: {
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer @ Google',
      avatar: '👩‍💼',
      bio: '10+ years of experience in software engineering. Specialized in data structures, algorithms, and system design.',
      rating: 4.8,
      reviews: 124,
      languages: ['English', 'Spanish'],
      expertise: ['Algorithms', 'Data Structures', 'System Design']
    },
    availableDates: [
      { date: '2024-01-25', slots: ['09:00', '11:00', '14:00', '16:00'] },
      { date: '2024-01-26', slots: ['10:00', '13:00', '15:00'] },
      { date: '2024-01-27', slots: ['09:00', '12:00', '14:00', '17:00'] }
    ],
    prerequisites: [
      'Laptop with webcam and microphone',
      'Stable internet connection',
      'Code editor (VS Code recommended)',
      'Quiet environment'
    ],
    preparationMaterials: [
      { id: 1, name: 'Interview Preparation Guide', type: 'PDF', required: true },
      { id: 2, name: 'Common Technical Questions', type: 'Document', required: false },
      { id: 3, name: 'Practice Problems Set', type: 'Interactive', required: true }
    ]
  };

  const handleDateSelect = (date, time) => {
    setBookingData({
      ...bookingData,
      date,
      time
    });
  };

  const handlePreparationToggle = (materialId) => {
    const updated = bookingData.preparation.includes(materialId)
      ? bookingData.preparation.filter(id => id !== materialId)
      : [...bookingData.preparation, materialId];
    setBookingData({ ...bookingData, preparation: updated });
  };

  const handleBooking = () => {
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // API call to book session
    console.log('Booking confirmed:', bookingData);
    navigate('/dashboard/mockinterviews/practice/confirmation');
  };

  return (
    <div className="session-booking">
      {/* Progress Steps */}
      <div className="booking-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 1 ? '✓' : '1'}</div>
          <div className="step-label">Select Time</div>
        </div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
          <div className="step-label">Preparation</div>
        </div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirm</div>
        </div>
      </div>

      <div className="booking-container">
        {/* Left Column - Session Info */}
        <div className="session-info-sidebar">
          <div className="session-info-card">
            <div className="session-info-header">
              <span className={`session-type-badge ${sessionDetails.type}`}>
                {sessionDetails.type}
              </span>
              <h2>{sessionDetails.title}</h2>
              <p className="session-description">{sessionDetails.description}</p>
            </div>

            <div className="interviewer-profile">
              <div className="interviewer-avatar-large">
                {sessionDetails.interviewer.avatar}
              </div>
              <div className="interviewer-details">
                <h3>{sessionDetails.interviewer.name}</h3>
                <p className="interviewer-role">{sessionDetails.interviewer.role}</p>
                <div className="interviewer-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating">{sessionDetails.interviewer.rating}</span>
                  <span className="reviews">({sessionDetails.interviewer.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="interviewer-bio">
              <p>{sessionDetails.interviewer.bio}</p>
            </div>

            <div className="expertise-tags">
              {sessionDetails.interviewer.expertise.map((skill, idx) => (
                <span key={idx} className="expertise-tag">{skill}</span>
              ))}
            </div>

            <div className="session-meta-info">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <div>
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{sessionDetails.duration}</span>
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">💰</span>
                <div>
                  <span className="meta-label">Price</span>
                  <span className="meta-value price">{sessionDetails.price}</span>
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🌐</span>
                <div>
                  <span className="meta-label">Languages</span>
                  <span className="meta-value">{sessionDetails.interviewer.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="prerequisites-section">
              <h4>Prerequisites</h4>
              <ul className="prerequisites-list">
                {sessionDetails.prerequisites.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="booking-form">
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Select Date & Time</h3>
              <p className="step-description">Choose a convenient time for your mock interview</p>

              <div className="date-slots">
                {sessionDetails.availableDates.map((dateInfo, idx) => (
                  <div key={idx} className="date-group">
                    <div className="date-header">
                      {new Date(dateInfo.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="time-slots">
                      {dateInfo.slots.map((time, timeIdx) => (
                        <button
                          key={timeIdx}
                          className={`time-slot ${bookingData.date === dateInfo.date && bookingData.time === time ? 'selected' : ''}`}
                          onClick={() => handleDateSelect(dateInfo.date, time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/dashboard/mockinterviews/practice')}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  disabled={!bookingData.date || !bookingData.time}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to Preparation
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>Preparation Materials</h3>
              <p className="step-description">Review and acknowledge the preparation materials</p>

              <div className="preparation-materials">
                {sessionDetails.preparationMaterials.map(material => (
                  <div key={material.id} className="material-card">
                    <div className="material-info">
                      <div className="material-icon">
                        {material.type === 'PDF' && '📄'}
                        {material.type === 'Document' && '📝'}
                        {material.type === 'Interactive' && '🔄'}
                      </div>
                      <div className="material-details">
                        <h4>{material.name}</h4>
                        <span className="material-type">{material.type}</span>
                        {material.required && (
                          <span className="required-badge">Required</span>
                        )}
                      </div>
                    </div>
                    <div className="material-actions">
                      <button className="btn-view">Preview</button>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={bookingData.preparation.includes(material.id)}
                          onChange={() => handlePreparationToggle(material.id)}
                          disabled={material.required}
                        />
                        <span className="checkbox-custom"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notes-section">
                <label htmlFor="notes">Additional Notes (Optional)</label>
                <textarea
                  id="notes"
                  placeholder="Share any specific topics you'd like to focus on..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </button>
                <button 
                  className="btn-primary"
                  disabled={!sessionDetails.preparationMaterials.filter(m => m.required).every(m => 
                    bookingData.preparation.includes(m.id)
                  )}
                  onClick={() => setCurrentStep(3)}
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>Review & Confirm</h3>
              <p className="step-description">Please review your booking details</p>

              <div className="confirmation-summary">
                <div className="summary-section">
                  <h4>Session Details</h4>
                  <div className="summary-item">
                    <span>Session:</span>
                    <strong>{sessionDetails.title}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Date:</span>
                    <strong>{new Date(bookingData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Time:</span>
                    <strong>{bookingData.time}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Duration:</span>
                    <strong>{sessionDetails.duration}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Interviewer:</span>
                    <strong>{sessionDetails.interviewer.name}</strong>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Preparation Status</h4>
                  <div className="preparation-status">
                    {sessionDetails.preparationMaterials.map(material => (
                      <div key={material.id} className="status-item">
                        <span className={`status-icon ${bookingData.preparation.includes(material.id) ? 'completed' : ''}`}>
                          {bookingData.preparation.includes(material.id) ? '✓' : '○'}
                        </span>
                        <span>{material.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {bookingData.notes && (
                  <div className="summary-section">
                    <h4>Your Notes</h4>
                    <p className="notes-preview">{bookingData.notes}</p>
                  </div>
                )}

                <div className="agreement-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={bookingData.agreement}
                      onChange={(e) => setBookingData({ ...bookingData, agreement: e.target.checked })}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="agreement-text">
                      I agree to the <a href="/terms">terms and conditions</a> and confirm that I'll attend the session on time
                    </span>
                  </label>
                </div>
              </div>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </button>
                <button 
                  className="btn-primary"
                  disabled={!bookingData.agreement}
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-icon">🎉</div>
            <h2>Booking Confirmed!</h2>
            <p>Your mock interview session has been successfully scheduled</p>
            
            <div className="confirmation-details">
              <div className="detail-row">
                <span>Session:</span>
                <strong>{sessionDetails.title}</strong>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <strong>{new Date(bookingData.date).toLocaleDateString()}</strong>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <strong>{bookingData.time}</strong>
              </div>
              <div className="detail-row">
                <span>Interviewer:</span>
                <strong>{sessionDetails.interviewer.name}</strong>
              </div>
            </div>

            <div className="next-steps">
              <h4>Next Steps:</h4>
              <ul>
                <li>📧 Check your email for confirmation and meeting link</li>
                <li>📅 Add to calendar (link sent via email)</li>
                <li>📚 Review preparation materials</li>
                <li>🎥 Test your audio/video setup</li>
              </ul>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => navigate('/dashboard/mockinterviews/practice')}
              >
                Browse More Sessions
              </button>
              <button 
                className="btn-primary"
                onClick={confirmBooking}
              >
                Go to My Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionBooking;