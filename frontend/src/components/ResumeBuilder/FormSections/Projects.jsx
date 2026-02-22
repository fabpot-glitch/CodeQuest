import React from 'react';
import './Projects.css';

const Projects = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: '',
        startDate: '',
        endDate: '',
        current: false,
        role: '',
        achievements: []
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
    
    if (field === 'current' && value === true) {
      newData[index].endDate = '';
    }
    
    onChange(newData);
  };

  const handleAddAchievement = (index) => {
    const newData = [...data];
    const achievements = newData[index].achievements || [];
    achievements.push('');
    newData[index].achievements = achievements;
    onChange(newData);
  };

  const handleAchievementChange = (index, achievementIndex, value) => {
    const newData = [...data];
    newData[index].achievements[achievementIndex] = value;
    onChange(newData);
  };

  const handleRemoveAchievement = (index, achievementIndex) => {
    const newData = [...data];
    newData[index].achievements.splice(achievementIndex, 1);
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
    <div className="projects-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-project-diagram"></i> Projects</h3>
          <p className="section-description">Showcase your personal, academic, or professional projects</p>
        </div>
        <button onClick={handleAdd} className="add-btn">
          <i className="fas fa-plus"></i> Add Project
        </button>
      </div>

      {data.map((project, index) => (
        <div key={project.id} className="project-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-number">Project #{index + 1}</span>
              <span className="card-status">
                {project.name || 'New Project'}
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
                  title="Remove project"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`name-${index}`}>
                <i className="fas fa-cube"></i> Project Name *
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={project.name || ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="E-commerce Website"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={`role-${index}`}>
                <i className="fas fa-user-tie"></i> Your Role
              </label>
              <input
                type="text"
                id={`role-${index}`}
                value={project.role || ''}
                onChange={(e) => handleChange(index, 'role', e.target.value)}
                placeholder="Lead Developer, Project Manager, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor={`technologies-${index}`}>
                <i className="fas fa-code"></i> Technologies Used
              </label>
              <input
                type="text"
                id={`technologies-${index}`}
                value={project.technologies || ''}
                onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`link-${index}`}>
                <i className="fas fa-link"></i> Project Link
              </label>
              <input
                type="url"
                id={`link-${index}`}
                value={project.link || ''}
                onChange={(e) => handleChange(index, 'link', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`startDate-${index}`}>
                <i className="fas fa-calendar-alt"></i> Start Date
              </label>
              <input
                type="month"
                id={`startDate-${index}`}
                value={project.startDate || ''}
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
                  value={project.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  disabled={project.current}
                  placeholder={project.current ? "Present" : ""}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={project.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                  />
                  <span>Ongoing Project</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`description-${index}`}>
              <i className="fas fa-align-left"></i> Project Description *
            </label>
            <textarea
              id={`description-${index}`}
              value={project.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              placeholder="Describe the project objectives, your contributions, and the outcome..."
              rows={4}
              required
            />
            <small className="helper-text">
              Explain the problem, your solution, and the results achieved
            </small>
          </div>

          <div className="achievements-section">
            <div className="achievements-header">
              <label>
                <i className="fas fa-trophy"></i> Key Achievements
              </label>
              <button 
                type="button"
                onClick={() => handleAddAchievement(index)}
                className="add-achievement-btn"
              >
                <i className="fas fa-plus"></i> Add Achievement
              </button>
            </div>
            
            <div className="achievements-list">
              {project.achievements && project.achievements.map((achievement, aIndex) => (
                <div key={aIndex} className="achievement-item">
                  <div className="achievement-input">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, aIndex, e.target.value)}
                      placeholder="e.g., Increased performance by 40%"
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveAchievement(index, aIndex)}
                      className="remove-achievement-btn"
                      title="Remove achievement"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <span className="bullet-point">•</span>
                </div>
              ))}
              
              {(!project.achievements || project.achievements.length === 0) && (
                <div className="no-achievements">
                  <p>No achievements added yet. Click "Add Achievement" to add key results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-project-diagram"></i>
          <h4>No Projects Added</h4>
          <p>Showcase your work by adding projects that demonstrate your skills</p>
          <button onClick={handleAdd} className="btn-primary">
            <i className="fas fa-plus"></i> Add First Project
          </button>
        </div>
      )}

      <div className="section-footer">
        <button onClick={handleAdd} className="add-another-btn">
          <i className="fas fa-plus-circle"></i> Add Another Project
        </button>
      </div>

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Project Writing Tips:</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-chart-line"></i>
            <h5>Quantify Results</h5>
            <p>Use metrics to show project impact</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-tasks"></i>
            <h5>Showcase Skills</h5>
            <p>Highlight technologies and methodologies used</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-rocket"></i>
            <h5>Demonstrate Impact</h5>
            <p>Focus on business value and outcomes</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-code-branch"></i>
            <h5>Include Links</h5>
            <p>Add GitHub or live demo links when possible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;