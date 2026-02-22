import React from 'react';
import './Education.css';

const Education = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
        current: false
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

  return (
    <div className="education-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-graduation-cap"></i> Education</h3>
          <p className="section-description">List your educational background in reverse chronological order</p>
        </div>
        <button onClick={handleAdd} className="add-btn">
          <i className="fas fa-plus"></i> Add Education
        </button>
      </div>

      {data.map((edu, index) => (
        <div key={edu.id} className="education-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-number">Education #{index + 1}</span>
              <span className="card-status">
                {edu.institution || 'New Education Entry'}
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
                  title="Remove education"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`institution-${index}`}>
                <i className="fas fa-university"></i> Institution *
              </label>
              <input
                type="text"
                id={`institution-${index}`}
                value={edu.institution || ''}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                placeholder="University Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`degree-${index}`}>
                <i className="fas fa-certificate"></i> Degree *
              </label>
              <select
                id={`degree-${index}`}
                value={edu.degree || ''}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                required
              >
                <option value="">Select Degree</option>
                <option value="High School">High School Diploma</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD/Doctorate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`field-${index}`}>
                <i className="fas fa-book"></i> Field of Study
              </label>
              <input
                type="text"
                id={`field-${index}`}
                value={edu.field || ''}
                onChange={(e) => handleChange(index, 'field', e.target.value)}
                placeholder="Computer Science, Business Administration, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor={`gpa-${index}`}>
                <i className="fas fa-chart-line"></i> GPA
              </label>
              <input
                type="text"
                id={`gpa-${index}`}
                value={edu.gpa || ''}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                placeholder="3.8/4.0 or 4.5/5.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`startDate-${index}`}>
                <i className="fas fa-calendar-alt"></i> Start Date
              </label>
              <input
                type="month"
                id={`startDate-${index}`}
                value={edu.startDate || ''}
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
                  value={edu.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  disabled={edu.current}
                  placeholder={edu.current ? "Present" : ""}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={edu.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                  />
                  <span>Currently attending</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`description-${index}`}>
              <i className="fas fa-align-left"></i> Description
            </label>
            <textarea
              id={`description-${index}`}
              value={edu.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="Relevant coursework, honors, awards, extracurricular activities, thesis/dissertation topic..."
              rows={3}
            />
            <small className="helper-text">
              Highlight achievements, relevant projects, or notable accomplishments
            </small>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-graduation-cap"></i>
          <h4>No Education Added</h4>
          <p>Start by adding your educational background</p>
          <button onClick={handleAdd} className="btn-primary">
            <i className="fas fa-plus"></i> Add First Education
          </button>
        </div>
      )}

      <div className="section-footer">
        <button onClick={handleAdd} className="add-another-btn">
          <i className="fas fa-plus-circle"></i> Add Another Education
        </button>
      </div>
    </div>
  );
};

export default Education;