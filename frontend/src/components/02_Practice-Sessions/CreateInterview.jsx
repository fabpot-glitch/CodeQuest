import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeSessionsDashboard.css';

const CreateInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    interviewType: 'Technical',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    difficulty: 'Medium',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.company || !formData.position || !formData.scheduledDate || !formData.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get existing interviews from localStorage
    const existingInterviews = JSON.parse(localStorage.getItem('mockInterviews') || '[]');
    
    // Create new interview object
    const newInterview = {
      id: Date.now(),
      ...formData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    existingInterviews.push(newInterview);
    localStorage.setItem('mockInterviews', JSON.stringify(existingInterviews));
    
    // Show success message and navigate
    alert('✅ Interview created successfully!');
    navigate('/mockinterviews');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const interviewTypes = [
    { value: 'Technical', icon: '💻', color: '#3B82F6' },
    { value: 'Behavioral', icon: '🗣️', color: '#10B981' },
    { value: 'Case Study', icon: '📊', color: '#F59E0B' },
    { value: 'System Design', icon: '🏗️', color: '#8B5CF6' }
  ];

  const durations = [
    { value: 30, label: '30 minutes', icon: '⚡' },
    { value: 45, label: '45 minutes', icon: '⏱️' },
    { value: 60, label: '1 hour', icon: '🕐' },
    { value: 90, label: '1.5 hours', icon: '🕑' },
    { value: 120, label: '2 hours', icon: '🕒' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--spacing-2xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--gray-200)'
      }}>
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <button 
            onClick={() => navigate('/mockinterviews')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-600)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-base)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--primary-50)';
              e.currentTarget.style.paddingLeft = '0.25rem';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.paddingLeft = '0.5rem';
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ 
            color: 'var(--gray-900)', 
            marginBottom: 'var(--spacing-sm)',
            fontSize: '2rem',
            fontWeight: '800',
            letterSpacing: '-0.02em'
          }}>
            📝 Schedule New Interview
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
            Fill in the details to schedule your mock interview session
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Company Input */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              🏢 Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g., Google, Amazon, Microsoft"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                transition: 'all var(--transition-base)',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-500)';
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-200)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Position Input */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              💼 Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer, Product Manager"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                transition: 'all var(--transition-base)',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-500)';
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-200)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Interview Type */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-md)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              📋 Interview Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-md)' }}>
              {interviewTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({...formData, interviewType: type.value})}
                  style={{
                    padding: 'var(--spacing-md)',
                    border: `2px solid ${formData.interviewType === type.value ? type.color : 'var(--gray-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    background: formData.interviewType === type.value ? `${type.color}15` : 'white',
                    color: formData.interviewType === type.value ? type.color : 'var(--gray-700)',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{type.icon}</span>
                  {type.value}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)', 
                color: 'var(--gray-900)', 
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                📅 Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate || defaultDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: '2px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  transition: 'all var(--transition-base)',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-500)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-100)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--gray-200)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)', 
                color: 'var(--gray-900)', 
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                ⏰ Time *
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime || '10:00'}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: '2px solid var(--gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  transition: 'all var(--transition-base)',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-500)';
                  e.target.style.boxShadow = '0 0 0 4px var(--primary-100)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--gray-200)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-md)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              ⏱️ Duration *
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              {durations.map(dur => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setFormData({...formData, duration: dur.value})}
                  style={{
                    flex: '1',
                    minWidth: '100px',
                    padding: 'var(--spacing-md)',
                    border: `2px solid ${formData.duration === dur.value ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    background: formData.duration === dur.value ? 'var(--primary-600)' : 'white',
                    color: formData.duration === dur.value ? 'white' : 'var(--gray-700)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{dur.icon}</span>
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-md)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              🎯 Difficulty Level *
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {difficulties.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({...formData, difficulty: level})}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-md)',
                    border: `2px solid ${formData.difficulty === level ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    background: formData.difficulty === level ? 'var(--primary-600)' : 'white',
                    color: formData.difficulty === level ? 'white' : 'var(--gray-700)',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    transition: 'all var(--transition-base)'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)', 
              color: 'var(--gray-900)', 
              fontWeight: '600',
              fontSize: '0.9375rem'
            }}>
              📝 Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific topics or areas you want to focus on..."
              rows={4}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                border: '2px solid var(--gray-200)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                transition: 'all var(--transition-base)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-500)';
                e.target.style.boxShadow = '0 0 0 4px var(--primary-100)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-200)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
            <button
              type="button"
              onClick={() => navigate('/mockinterviews')}
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                border: '2px solid var(--gray-300)',
                borderRadius: 'var(--radius-lg)',
                background: 'white',
                color: 'var(--gray-700)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--gray-50)';
                e.currentTarget.style.borderColor = 'var(--gray-400)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = 'var(--gray-300)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-600)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--primary-700)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--primary-600)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📅 Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;