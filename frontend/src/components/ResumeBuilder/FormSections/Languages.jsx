import React from 'react';
import './Languages.css';

const Languages = ({ data, onChange }) => {
  const proficiencies = [
    { id: 'native', name: 'Native', description: 'Native or bilingual proficiency' },
    { id: 'fluent', name: 'Fluent', description: 'Full professional proficiency' },
    { id: 'advanced', name: 'Advanced', description: 'Professional working proficiency' },
    { id: 'intermediate', name: 'Intermediate', description: 'Limited working proficiency' },
    { id: 'basic', name: 'Basic', description: 'Elementary proficiency' },
    { id: 'beginner', name: 'Beginner', description: 'Beginner level' }
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)',
    'Japanese', 'Arabic', 'Portuguese', 'Russian', 'Hindi',
    'Italian', 'Korean', 'Dutch', 'Turkish', 'Polish'
  ];

  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        language: '',
        proficiency: 'intermediate',
        certification: '',
        years: '',
        notes: ''
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

  const getProficiencyColor = (proficiencyId) => {
    const colors = {
      native: '#2ecc71',
      fluent: '#27ae60',
      advanced: '#3498db',
      intermediate: '#f39c12',
      basic: '#e74c3c',
      beginner: '#c0392b'
    };
    return colors[proficiencyId] || '#95a5a6';
  };

  const calculateLanguageScore = () => {
    const scores = {
      native: 5,
      fluent: 4,
      advanced: 3,
      intermediate: 2,
      basic: 1,
      beginner: 0.5
    };
    
    const totalScore = data.reduce((sum, lang) => {
      return sum + (scores[lang.proficiency] || 0);
    }, 0);
    
    const maxPossible = data.length * 5;
    return maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
  };

  return (
    <div className="languages-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-language"></i> Languages</h3>
          <p className="section-description">Add languages you speak, read, or write</p>
        </div>
        <div className="language-stats">
          <div className="stat-card">
            <span className="stat-number">{data.length}</span>
            <span className="stat-label">Languages</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{calculateLanguageScore()}%</span>
            <span className="stat-label">Proficiency Score</span>
          </div>
        </div>
      </div>

      <div className="languages-container">
        {data.map((lang, index) => (
          <div key={lang.id} className="language-card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-number">Language #{index + 1}</span>
                <span className="card-status">
                  {lang.language || 'New Language'}
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
                    title="Remove language"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor={`language-${index}`}>
                  <i className="fas fa-globe"></i> Language *
                </label>
                <div className="language-input-group">
                  <input
                    type="text"
                    id={`language-${index}`}
                    value={lang.language || ''}
                    onChange={(e) => handleChange(index, 'language', e.target.value)}
                    placeholder="English, Spanish, French..."
                    required
                    list={`language-suggestions-${index}`}
                  />
                  <datalist id={`language-suggestions-${index}`}>
                    {commonLanguages.map(langName => (
                      <option key={langName} value={langName} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`proficiency-${index}`}>
                  <i className="fas fa-chart-line"></i> Proficiency Level
                </label>
                <select
                  id={`proficiency-${index}`}
                  value={lang.proficiency || 'intermediate'}
                  onChange={(e) => handleChange(index, 'proficiency', e.target.value)}
                  className="proficiency-select"
                  style={{ 
                    borderLeftColor: getProficiencyColor(lang.proficiency),
                    borderLeftWidth: '4px'
                  }}
                >
                  {proficiencies.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name} - {level.description}
                    </option>
                  ))}
                </select>
                <div className="proficiency-indicator">
                  <div 
                    className="proficiency-bar"
                    style={{
                      width: `${(proficiencies.findIndex(p => p.id === lang.proficiency) + 1) / proficiencies.length * 100}%`,
                      backgroundColor: getProficiencyColor(lang.proficiency)
                    }}
                  ></div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`certification-${index}`}>
                  <i className="fas fa-certificate"></i> Certification
                </label>
                <input
                  type="text"
                  id={`certification-${index}`}
                  value={lang.certification || ''}
                  onChange={(e) => handleChange(index, 'certification', e.target.value)}
                  placeholder="e.g., TOEFL, DELE, JLPT"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`years-${index}`}>
                  <i className="fas fa-calendar-alt"></i> Years of Experience
                </label>
                <input
                  type="number"
                  id={`years-${index}`}
                  value={lang.years || ''}
                  onChange={(e) => handleChange(index, 'years', e.target.value)}
                  placeholder="Number of years"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`notes-${index}`}>
                <i className="fas fa-sticky-note"></i> Additional Notes
              </label>
              <textarea
                id={`notes-${index}`}
                value={lang.notes || ''}
                onChange={(e) => handleChange(index, 'notes', e.target.value)}
                placeholder="Additional details about your language skills, context of use, or special achievements..."
                rows={2}
              />
            </div>

            <div className="skill-breakdown">
              <div className="skill-categories">
                <div className="skill-category">
                  <span className="skill-label">Speaking</span>
                  <div className="skill-dots">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <button
                        key={dot}
                        className={`skill-dot ${dot <= (lang.speaking || 3) ? 'active' : ''}`}
                        onClick={() => handleChange(index, 'speaking', dot)}
                        style={{
                          backgroundColor: dot <= (lang.speaking || 3) ? getProficiencyColor(lang.proficiency) : '#e0e0e0'
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="skill-category">
                  <span className="skill-label">Reading</span>
                  <div className="skill-dots">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <button
                        key={dot}
                        className={`skill-dot ${dot <= (lang.reading || 3) ? 'active' : ''}`}
                        onClick={() => handleChange(index, 'reading', dot)}
                        style={{
                          backgroundColor: dot <= (lang.reading || 3) ? getProficiencyColor(lang.proficiency) : '#e0e0e0'
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="skill-category">
                  <span className="skill-label">Writing</span>
                  <div className="skill-dots">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <button
                        key={dot}
                        className={`skill-dot ${dot <= (lang.writing || 3) ? 'active' : ''}`}
                        onClick={() => handleChange(index, 'writing', dot)}
                        style={{
                          backgroundColor: dot <= (lang.writing || 3) ? getProficiencyColor(lang.proficiency) : '#e0e0e0'
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-language"></i>
          <h4>No Languages Added</h4>
          <p>Add languages to showcase your multilingual abilities</p>
          
          <div className="quick-add-languages">
            <p className="quick-add-label">Quick Add Common Languages:</p>
            <div className="language-suggestions">
              {commonLanguages.map(language => (
                <button
                  key={language}
                  onClick={() => {
                    onChange([
                      ...data,
                      {
                        id: Date.now(),
                        language: language,
                        proficiency: language === 'English' ? 'native' : 'intermediate',
                        certification: '',
                        years: '',
                        notes: ''
                      }
                    ]);
                  }}
                  className="language-suggestion"
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={handleAdd} className="btn-primary">
            <i className="fas fa-plus"></i> Add Custom Language
          </button>
        </div>
      )}

      <div className="section-footer">
        <button onClick={handleAdd} className="add-another-btn">
          <i className="fas fa-plus-circle"></i> Add Another Language
        </button>
      </div>

      <div className="proficiency-guide">
        <h4><i className="fas fa-info-circle"></i> Proficiency Level Guide</h4>
        <div className="guide-container">
          {proficiencies.map(level => (
            <div key={level.id} className="guide-item">
              <div className="guide-header">
                <span 
                  className="level-indicator"
                  style={{ backgroundColor: getProficiencyColor(level.id) }}
                ></span>
                <span className="level-name">{level.name}</span>
              </div>
              <p className="level-description">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Language Tips:</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-comments"></i>
            <h5>Be Honest</h5>
            <p>Accurately represent your proficiency level</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-briefcase"></i>
            <h5>Job Relevant</h5>
            <p>Highlight languages useful for the target role</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-certificate"></i>
            <h5>Certifications</h5>
            <p>Include official language test scores</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-star"></i>
            <h5>Order by Proficiency</h5>
            <p>List languages from strongest to weakest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Languages;