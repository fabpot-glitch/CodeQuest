import React from 'react';
import './PersonalInfo.css';

const PersonalInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="personal-info-form">
      <div className="form-header">
        <h3><i className="fas fa-user"></i> Personal Information</h3>
        <p className="section-description">Enter your basic contact details</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="fullName">
            <i className="fas fa-signature"></i> Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i> Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <i className="fas fa-phone"></i> Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (123) 456-7890"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <i className="fas fa-map-marker-alt"></i> Location
          </label>
          <input
            type="text"
            id="address"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin">
            <i className="fab fa-linkedin"></i> LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github">
            <i className="fab fa-github"></i> GitHub URL
          </label>
          <input
            type="url"
            id="github"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="portfolio">
            <i className="fas fa-globe"></i> Portfolio Website
          </label>
          <input
            type="url"
            id="portfolio"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="summary">
          <i className="fas fa-file-alt"></i> Professional Summary
        </label>
        <textarea
          id="summary"
          value={data.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Brief summary of your professional background, skills, and career objectives. Aim for 3-4 sentences highlighting your key strengths..."
          rows={5}
          maxLength={500}
        />
        <div className="textarea-footer">
          <small className="helper-text">
            Write a concise summary highlighting your key qualifications and career goals
          </small>
          <span className="char-count">{data.summary?.length || 0}/500 characters</span>
        </div>
      </div>

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Tips:</h4>
        <ul>
          <li>Use a professional email address</li>
          <li>Include your LinkedIn profile for networking</li>
          <li>Keep summary focused on relevant skills and experience</li>
          <li>Use keywords from your target job descriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfo;