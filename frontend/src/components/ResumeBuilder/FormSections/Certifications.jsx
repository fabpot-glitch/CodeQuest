import React from 'react';
import './Certifications.css';

const Certifications = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
        credentialUrl: '',
        expirationDate: '',
        skills: []
      }
    ]);
  };

  const handleRemove = (index) => {
    if (data.length > 1) {
      const newData = [...data];
      newData.splice(index, 1);
      onChange(newData);
    }
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    onChange(newData);
  };

  const handleAddSkill = (index) => {
    const newData = [...data];
    const skills = newData[index].skills || [];
    skills.push('');
    newData[index].skills = skills;
    onChange(newData);
  };

  const handleSkillChange = (index, skillIndex, value) => {
    const newData = [...data];
    newData[index].skills[skillIndex] = value;
    onChange(newData);
  };

  const handleRemoveSkill = (index, skillIndex) => {
    const newData = [...data];
    newData[index].skills.splice(skillIndex, 1);
    onChange(newData);
  };

  const handleMove = (index, direction) => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < data.length - 1)
    ) {
      const newData = [...data];
      const temp = newData[index];
      newData[index] = newData[direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index];
      newData[direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index] = temp;
      onChange(newData);
    }
  };

  const popularCertifications = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'Google Cloud Professional', issuer: 'Google' },
    { name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft' },
    { name: 'Project Management Professional (PMP)', issuer: 'PMI' },
    { name: 'Certified Scrum Master (CSM)', issuer: 'Scrum Alliance' },
    { name: 'CompTIA Security+', issuer: 'CompTIA' },
    { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco' },
    { name: 'Salesforce Administrator', issuer: 'Salesforce' }
  ];

  return (
    <div className="certifications-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-certificate"></i> Certifications</h3>
          <p className="section-description">Add professional certifications to showcase your expertise</p>
        </div>
        <button onClick={handleAdd} className="add-btn">
          <i className="fas fa-plus"></i> Add Certification
        </button>
      </div>

      {data.map((cert, index) => (
        <div key={cert.id} className="certification-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-number">Certification #{index + 1}</span>
              <span className="card-status">
                {cert.name || 'New Certification'}
              </span>
            </div>
            <div className="card-actions">
              <div className="move-buttons">
                <button 
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="move-btn"
                  title="Move up"
                >
                  <i className="fas fa-arrow-up"></i>
                </button>
                <button 
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === data.length - 1}
                  className="move-btn"
                  title="Move down"
                >
                  <i className="fas fa-arrow-down"></i>
                </button>
              </div>
              {data.length > 1 && (
                <button 
                  onClick={() => handleRemove(index)}
                  className="remove-btn"
                  title="Remove certification"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`name-${index}`}>
                <i className="fas fa-award"></i> Certification Name *
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={cert.name || ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`issuer-${index}`}>
                <i className="fas fa-building"></i> Issuing Organization *
              </label>
              <input
                type="text"
                id={`issuer-${index}`}
                value={cert.issuer || ''}
                onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`date-${index}`}>
                <i className="fas fa-calendar-alt"></i> Date Earned
              </label>
              <input
                type="month"
                id={`date-${index}`}
                value={cert.date || ''}
                onChange={(e) => handleChange(index, 'date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`expirationDate-${index}`}>
                <i className="fas fa-calendar-times"></i> Expiration Date
              </label>
              <input
                type="month"
                id={`expirationDate-${index}`}
                value={cert.expirationDate || ''}
                onChange={(e) => handleChange(index, 'expirationDate', e.target.value)}
                placeholder="If applicable"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`credentialId-${index}`}>
                <i className="fas fa-id-card"></i> Credential ID
              </label>
              <input
                type="text"
                id={`credentialId-${index}`}
                value={cert.credentialId || ''}
                onChange={(e) => handleChange(index, 'credentialId', e.target.value)}
                placeholder="AWS-12345"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`credentialUrl-${index}`}>
                <i className="fas fa-link"></i> Credential URL
              </label>
              <input
                type="url"
                id={`credentialUrl-${index}`}
                value={cert.credentialUrl || ''}
                onChange={(e) => handleChange(index, 'credentialUrl', e.target.value)}
                placeholder="https://www.credly.com/badges/..."
              />
            </div>
          </div>

          <div className="skills-section">
            <div className="skills-header">
              <label>
                <i className="fas fa-code"></i> Related Skills
              </label>
              <button 
                type="button"
                onClick={() => handleAddSkill(index)}
                className="add-skill-btn"
              >
                <i className="fas fa-plus"></i> Add Skill
              </button>
            </div>
            
            <div className="skills-list">
              {cert.skills && cert.skills.map((skill, sIndex) => (
                <div key={sIndex} className="skill-item">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, sIndex, e.target.value)}
                    placeholder="e.g., Cloud Architecture, Security"
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemoveSkill(index, sIndex)}
                    className="remove-skill-btn"
                    title="Remove skill"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              
              {(!cert.skills || cert.skills.length === 0) && (
                <div className="no-skills">
                  <p>Add skills covered by this certification</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-certificate"></i>
          <h4>No Certifications Added</h4>
          <p>Add professional certifications to validate your skills</p>
          
          <div className="popular-certifications">
            <p className="popular-label">Popular Certifications:</p>
            <div className="certification-suggestions">
              {popularCertifications.map((cert, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onChange([
                      ...data,
                      {
                        id: Date.now(),
                        name: cert.name,
                        issuer: cert.issuer,
                        date: '',
                        credentialId: '',
                        credentialUrl: '',
                        expirationDate: '',
                        skills: []
                      }
                    ]);
                  }}
                  className="certification-suggestion"
                >
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={handleAdd} className="btn-primary">
            <i className="fas fa-plus"></i> Add Custom Certification
          </button>
        </div>
      )}

      <div className="section-footer">
        <button onClick={handleAdd} className="add-another-btn">
          <i className="fas fa-plus-circle"></i> Add Another Certification
        </button>
      </div>

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Certification Tips:</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-industry"></i>
            <h5>Industry Relevant</h5>
            <p>Include certifications valued in your industry</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-calendar-check"></i>
            <h5>Recent Certifications</h5>
            <p>Prioritize certifications earned in the last 3-5 years</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-star"></i>
            <h5>Valid Credentials</h5>
            <p>Include credential IDs and verification links</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-graduation-cap"></i>
            <h5>Skills Validation</h5>
            <p>Link certifications to specific skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;