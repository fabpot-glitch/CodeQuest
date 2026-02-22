import React, { useState } from 'react';
import './Skills.css';

const Skills = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('Technical');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSkill, setEditSkill] = useState('');

  const categories = [
    { id: 'technical', name: 'Technical Skills', icon: 'fas fa-code' },
    { id: 'soft', name: 'Soft Skills', icon: 'fas fa-users' },
    { id: 'tools', name: 'Tools & Software', icon: 'fas fa-wrench' },
    { id: 'languages', name: 'Programming Languages', icon: 'fas fa-laptop-code' },
    { id: 'frameworks', name: 'Frameworks', icon: 'fas fa-layer-group' },
    { id: 'methodologies', name: 'Methodologies', icon: 'fas fa-project-diagram' }
  ];

  const proficiencyLevels = [
    { id: 'expert', name: 'Expert', color: '#2ecc71' },
    { id: 'advanced', name: 'Advanced', color: '#3498db' },
    { id: 'intermediate', name: 'Intermediate', color: '#f39c12' },
    { id: 'beginner', name: 'Beginner', color: '#e74c3c' }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skillObj = {
        id: Date.now(),
        name: newSkill.trim(),
        category: skillCategory,
        proficiency: 'intermediate'
      };
      onChange([...data, skillObj]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...data];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleEditSkill = (index) => {
    setEditingIndex(index);
    setEditSkill(data[index].name);
  };

  const handleSaveEdit = () => {
    if (editSkill.trim()) {
      const newSkills = [...data];
      newSkills[editingIndex] = {
        ...newSkills[editingIndex],
        name: editSkill.trim()
      };
      onChange(newSkills);
      setEditingIndex(null);
      setEditSkill('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditSkill('');
  };

  const handleProficiencyChange = (index, proficiency) => {
    const newSkills = [...data];
    newSkills[index] = {
      ...newSkills[index],
      proficiency
    };
    onChange(newSkills);
  };

  const handleCategoryChange = (index, category) => {
    const newSkills = [...data];
    newSkills[index] = {
      ...newSkills[index],
      category
    };
    onChange(newSkills);
  };

  const getFilteredSkills = (categoryId) => {
    return data.filter(skill => skill.category === categoryId);
  };

  const popularSkills = {
    technical: ['JavaScript', 'Python', 'Java', 'C++', 'SQL', 'HTML/CSS'],
    languages: ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust'],
    frameworks: ['React', 'Node.js', 'Vue.js', 'Angular', 'Express', 'Django'],
    tools: ['Git', 'Docker', 'AWS', 'Jenkins', 'VS Code', 'Postman'],
    soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'],
    methodologies: ['Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD']
  };

  return (
    <div className="skills-form">
      <div className="section-header">
        <div className="header-content">
          <h3><i className="fas fa-code"></i> Skills</h3>
          <p className="section-description">Add your technical and soft skills with proficiency levels</p>
        </div>
        <div className="skills-stats">
          <span className="stat">
            <i className="fas fa-star"></i> {data.length} Skills
          </span>
        </div>
      </div>

      <div className="skills-input-section">
        <div className="input-group">
          <div className="input-with-category">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., React, Project Management)"
              className="skill-input"
            />
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddSkill} className="add-skill-btn">
            <i className="fas fa-plus"></i> Add Skill
          </button>
        </div>
        
        <div className="quick-add-skills">
          <p className="quick-add-label">Quick Add:</p>
          <div className="quick-add-buttons">
            {popularSkills[skillCategory]?.map(skill => (
              <button
                key={skill}
                onClick={() => {
                  if (!data.some(s => s.name === skill)) {
                    const skillObj = {
                      id: Date.now(),
                      name: skill,
                      category: skillCategory,
                      proficiency: 'intermediate'
                    };
                    onChange([...data, skillObj]);
                  }
                }}
                className="quick-add-btn"
                disabled={data.some(s => s.name === skill)}
              >
                {skill}
                {data.some(s => s.name === skill) && <i className="fas fa-check"></i>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="skills-container">
          <div className="skills-categories">
            {categories.map(category => {
              const categorySkills = getFilteredSkills(category.id);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category.id} className="category-section">
                  <div className="category-header">
                    <i className={category.icon}></i>
                    <h4>{category.name}</h4>
                    <span className="skill-count">{categorySkills.length}</span>
                  </div>
                  <div className="skills-list">
                    {categorySkills.map((skill, index) => {
                      const skillIndex = data.findIndex(s => s.id === skill.id);
                      
                      return (
                        <div key={skill.id} className="skill-item">
                          {editingIndex === skillIndex ? (
                            <div className="skill-edit">
                              <input
                                type="text"
                                value={editSkill}
                                onChange={(e) => setEditSkill(e.target.value)}
                                className="edit-input"
                                autoFocus
                              />
                              <div className="edit-actions">
                                <button onClick={handleSaveEdit} className="save-edit-btn">
                                  <i className="fas fa-check"></i>
                                </button>
                                <button onClick={handleCancelEdit} className="cancel-edit-btn">
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="skill-info">
                                <span className="skill-name">{skill.name}</span>
                                <div className="skill-actions">
                                  <button 
                                    onClick={() => handleEditSkill(skillIndex)}
                                    className="edit-btn"
                                    title="Edit skill"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveSkill(skillIndex)}
                                    className="remove-skill-btn"
                                    title="Remove skill"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="skill-meta">
                                <div className="proficiency-selector">
                                  <span className="proficiency-label">Proficiency:</span>
                                  <div className="proficiency-buttons">
                                    {proficiencyLevels.map(level => (
                                      <button
                                        key={level.id}
                                        className={`proficiency-btn ${skill.proficiency === level.id ? 'active' : ''}`}
                                        onClick={() => handleProficiencyChange(skillIndex, level.id)}
                                        style={{ 
                                          backgroundColor: skill.proficiency === level.id ? level.color : 'transparent',
                                          borderColor: level.color,
                                          color: skill.proficiency === level.id ? 'white' : level.color
                                        }}
                                      >
                                        {level.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <select
                                  value={skill.category}
                                  onChange={(e) => handleCategoryChange(skillIndex, e.target.value)}
                                  className="category-change"
                                >
                                  {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="skills-actions">
            <button 
              onClick={() => onChange([])}
              className="clear-all-btn"
            >
              <i className="fas fa-trash-alt"></i> Clear All Skills
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-code"></i>
          <h4>No Skills Added</h4>
          <p>Add your skills to showcase your expertise to employers</p>
        </div>
      )}

      <div className="form-tips">
        <h4><i className="fas fa-lightbulb"></i> Skills Tips:</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <i className="fas fa-star"></i>
            <h5>Prioritize Skills</h5>
            <p>List most relevant skills first</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-sort-amount-up"></i>
            <h5>Use Proficiency Levels</h5>
            <p>Indicate your skill level honestly</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-key"></i>
            <h5>Match Job Keywords</h5>
            <p>Include skills from job descriptions</p>
          </div>
          <div className="tip-card">
            <i className="fas fa-balance-scale"></i>
            <h5>Mix Technical & Soft</h5>
            <p>Include both technical and soft skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;