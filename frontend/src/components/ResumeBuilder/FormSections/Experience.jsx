import React from 'react';
import './Experience.css';

const Experience = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
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
    
    // If current is checked, clear endDate
    if (field === 'current' && value === true) {
      newData[index].endDate = '';
    }
    
    onChange(newData);
  };

  const handleMove = (index, direction) => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < data.length - 1)
    ) {
      const newData = [...data];
      const temp = newData[index];
      newData[index] = newData[direction === 'up' ? index - 1 : index + 1];
      newData[direction === 'up' ? index - 1 : index + 1] = temp;
      onChange(newData);
    }
  };

  const addBulletPoint = (index) => {
    const newDescription = data[index].description 
      ? `${data[index].description}\n• `
      : '• ';
    handleChange(index, 'description', newDescription);
  };

  return (
    <div className="experience-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-briefcase"></i> Work Experience</h3>
          <p className="section-description">List your work history in reverse chronological order</p>
        </div>
        <button onClick={handleAdd} className="add-btn">
          <i className="fas fa-plus"></i> Add Experience
        </button>
      </div>

      {data.map((exp, index) => (
        <div key={exp.id} className="experience-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-number">Experience #{index + 1}</span>
              <span className="card-status">
                {exp.position || exp.company || 'New Experience Entry'}
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
                  title="Remove experience"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`company-${index}`}>
                <i className="fas fa-building"></i> Company *
              </label>
              <input
                type="text"
                id={`company-${index}`}
                value={exp.company || ''}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`position-${index}`}>
                <i className="fas fa-user-tie"></i> Position *
              </label>
              <input
                type="text"
                id={`position-${index}`}
                value={exp.position || ''}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                placeholder="Job Title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`location-${index}`}>
                <i className="fas fa-map-marker-alt"></i> Location
              </label>
              <input
                type="text"
                id={`location-${index}`}
                value={exp.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                placeholder="City, State/Country"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`startDate-${index}`}>
                <i className="fas fa-calendar-alt"></i> Start Date
              </label>
              <input
                type="month"
                id={`startDate-${index}`}
                value={exp.startDate || ''}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`endDate-${index}`}>
                <i className="fas fa-calendar-alt"></i> End Date
              </label>
              <div className="date-input-group">
                <input
                  type="month"
                  id={`endDate-${index}`}
                  value={exp.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                  placeholder={exp.current ? "Present" : ""}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                  />
                  <span>I currently work here</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor={`description-${index}`}>
                <i className="fas fa-align-left"></i> Description *
              </label>
              <div className="textarea-with-actions">
                <textarea
                  id={`description-${index}`}
                  value={exp.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and contributions. Use bullet points for better readability."
                  rows={6}
                  required
                />
                <button 
                  type="button"
                  onClick={() => addBulletPoint(index)}
                  className="add-bullet-btn"
                  title="Add bullet point"
                >
                  <i className="fas fa-plus"></i> Add Bullet Point
                </button>
              </div>
              <div className="textarea-footer">
                <small className="helper-text">
                  Use action verbs and quantify achievements when possible (e.g., "Increased sales by 20%")
                </small>
                <span className="char-count">{exp.description?.length || 0}/2000 characters</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <h4>No Experience Added</h4>
          <p>Add your work experience to showcase your professional journey</p>
          <button onClick={handleAdd} className="btn-primary">
            <i className="fas fa-plus"></i> Add First Experience
          </button>
        </div>
      )}

      <div className="section-footer">
        <button onClick={handleAdd} className="add-another-btn">
          <i className="fas fa-plus-circle"></i> Add Another Experience
        </button>
      </div>

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Experience Writing Tips:</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-chart-line"></i>
            <h5>Quantify Achievements</h5>
            <p>Use numbers and percentages to show impact</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-bullseye"></i>
            <h5>Use Action Verbs</h5>
            <p>Start bullet points with strong action words</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-trophy"></i>
            <h5>Highlight Achievements</h5>
            <p>Focus on results, not just responsibilities</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-key"></i>
            <h5>Include Keywords</h5>
            <p>Use keywords from job descriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;