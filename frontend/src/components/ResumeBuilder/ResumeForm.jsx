// components/ResumeBuilder/ResumeForm.jsx
import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import './ResumeForm.css';

const ResumeForm = () => {
  const { 
    resumeData, 
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    addProject,
    deleteProject,
    addCertification,
    deleteCertification,
    addLanguage,
    deleteLanguage
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal');
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // ============ PERSONAL INFO STATE ============
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  // ============ EXPERIENCE STATE ============
  const [experienceForm, setExperienceForm] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: [''],
    current: false
  });

  // ============ EDUCATION STATE ============
  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    gpa: '',
    achievements: ['']
  });

  // ============ SKILLS STATE ============
  const [skillInputs, setSkillInputs] = useState({
    frontend: '',
    backend: '',
    database: '',
    devops: ''
  });

  // ============ PROJECT STATE ============
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    technologies: [''],
    highlights: [''],
    link: ''
  });

  // ============ CERTIFICATION STATE ============
  const [certificationForm, setCertificationForm] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: ''
  });

  // ============ LANGUAGE STATE ============
  const [languageForm, setLanguageForm] = useState({
    name: '',
    proficiency: 'Professional Working'
  });

  // Load existing data when component mounts or when resumeData changes
  useEffect(() => {
    if (resumeData.personalInfo) {
      setPersonalInfo(prev => ({
        ...prev,
        ...resumeData.personalInfo
      }));
    }
  }, [resumeData.personalInfo]);

  // ============ VALIDATION FUNCTIONS ============
  const validatePersonalInfo = () => {
    const errors = {};
    if (!personalInfo.fullName.trim()) errors.fullName = 'Full name is required';
    if (!personalInfo.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) errors.email = 'Email is invalid';
    if (!personalInfo.phone.trim()) errors.phone = 'Phone number is required';
    return errors;
  };

  const validateExperience = () => {
    const errors = {};
    if (!experienceForm.position.trim()) errors.position = 'Job title is required';
    if (!experienceForm.company.trim()) errors.company = 'Company name is required';
    if (!experienceForm.startDate) errors.startDate = 'Start date is required';
    if (!experienceForm.current && !experienceForm.endDate) errors.endDate = 'End date is required';
    return errors;
  };

  const validateEducation = () => {
    const errors = {};
    if (!educationForm.degree.trim()) errors.degree = 'Degree is required';
    if (!educationForm.institution.trim()) errors.institution = 'Institution is required';
    if (!educationForm.startDate) errors.startDate = 'Start date is required';
    if (!educationForm.endDate) errors.endDate = 'End date is required';
    return errors;
  };

  const validateProject = () => {
    const errors = {};
    if (!projectForm.name.trim()) errors.name = 'Project name is required';
    if (!projectForm.description.trim()) errors.description = 'Description is required';
    return errors;
  };

  const validateCertification = () => {
    const errors = {};
    if (!certificationForm.name.trim()) errors.name = 'Certification name is required';
    if (!certificationForm.issuer.trim()) errors.issuer = 'Issuer is required';
    if (!certificationForm.date) errors.date = 'Date is required';
    return errors;
  };

  const validateLanguage = () => {
    const errors = {};
    if (!languageForm.name.trim()) errors.name = 'Language name is required';
    return errors;
  };

  // ============ PERSONAL INFO HANDLERS ============
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    setFormTouched(prev => ({ ...prev, [name]: true }));
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    const errors = validatePersonalInfo();
    if (Object.keys(errors).length === 0) {
      updatePersonalInfo(personalInfo);
      setFormErrors({});
      setActiveTab('experience');
    } else {
      setFormErrors(errors);
    }
  };

  // ============ EXPERIENCE HANDLERS ============
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExperienceDescriptionChange = (index, value) => {
    const newDescriptions = [...experienceForm.description];
    newDescriptions[index] = value;
    setExperienceForm(prev => ({ ...prev, description: newDescriptions }));
  };

  const addExperienceDescription = () => {
    setExperienceForm(prev => ({
      ...prev,
      description: [...prev.description, '']
    }));
  };

  const removeExperienceDescription = (index) => {
    if (experienceForm.description.length > 1) {
      setExperienceForm(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== index)
      }));
    }
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    const errors = validateExperience();
    if (Object.keys(errors).length === 0) {
      if (editingId) {
        updateExperience(editingId, experienceForm);
        setEditingId(null);
      } else {
        addExperience(experienceForm);
      }
      // Reset form
      setExperienceForm({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: [''],
        current: false
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleEditExperience = (exp) => {
    setExperienceForm({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description || [''],
      current: !exp.endDate
    });
    setEditingId(exp.id);
  };

  // ============ EDUCATION HANDLERS ============
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...educationForm.achievements];
    newAchievements[index] = value;
    setEducationForm(prev => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setEducationForm(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const removeAchievement = (index) => {
    if (educationForm.achievements.length > 1) {
      setEducationForm(prev => ({
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEducationSubmit = (e) => {
    e.preventDefault();
    const errors = validateEducation();
    if (Object.keys(errors).length === 0) {
      if (editingId) {
        updateEducation(editingId, educationForm);
        setEditingId(null);
      } else {
        addEducation(educationForm);
      }
      // Reset form
      setEducationForm({
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: ['']
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const handleEditEducation = (edu) => {
    setEducationForm({
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa || '',
      achievements: edu.achievements || ['']
    });
    setEditingId(edu.id);
  };

  // ============ SKILLS HANDLERS ============
  const handleSkillInputChange = (e) => {
    const { name, value } = e.target;
    setSkillInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkills = (category) => {
    const skillsArray = skillInputs[category]
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    
    if (skillsArray.length > 0) {
      const currentSkills = resumeData.skills[category] || [];
      const updatedSkills = [...new Set([...currentSkills, ...skillsArray])];
      updateSkills(category, updatedSkills);
      setSkillInputs(prev => ({ ...prev, [category]: '' }));
    }
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    const currentSkills = resumeData.skills[category] || [];
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    updateSkills(category, updatedSkills);
  };

  // ============ PROJECT HANDLERS ============
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTechnologyChange = (index, value) => {
    const newTechs = [...projectForm.technologies];
    newTechs[index] = value;
    setProjectForm(prev => ({ ...prev, technologies: newTechs }));
  };

  const addProjectTechnology = () => {
    setProjectForm(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const removeProjectTechnology = (index) => {
    if (projectForm.technologies.length > 1) {
      setProjectForm(prev => ({
        ...prev,
        technologies: prev.technologies.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProjectHighlightChange = (index, value) => {
    const newHighlights = [...projectForm.highlights];
    newHighlights[index] = value;
    setProjectForm(prev => ({ ...prev, highlights: newHighlights }));
  };

  const addProjectHighlight = () => {
    setProjectForm(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeProjectHighlight = (index) => {
    if (projectForm.highlights.length > 1) {
      setProjectForm(prev => ({
        ...prev,
        highlights: prev.highlights.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const errors = validateProject();
    if (Object.keys(errors).length === 0) {
      addProject(projectForm);
      // Reset form
      setProjectForm({
        name: '',
        description: '',
        technologies: [''],
        highlights: [''],
        link: ''
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  // ============ CERTIFICATION HANDLERS ============
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCertificationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCertificationSubmit = (e) => {
    e.preventDefault();
    const errors = validateCertification();
    if (Object.keys(errors).length === 0) {
      addCertification(certificationForm);
      // Reset form
      setCertificationForm({
        name: '',
        issuer: '',
        date: '',
        credentialId: ''
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  // ============ LANGUAGE HANDLERS ============
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setLanguageForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageSubmit = (e) => {
    e.preventDefault();
    const errors = validateLanguage();
    if (Object.keys(errors).length === 0) {
      addLanguage(languageForm);
      // Reset form
      setLanguageForm({
        name: '',
        proficiency: 'Professional Working'
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const proficiencies = [
    'Native',
    'Fluent',
    'Professional Working',
    'Advanced',
    'Intermediate',
    'Conversational',
    'Elementary'
  ];

  // ============ RENDER FUNCTIONS ============
  const renderPersonalInfo = () => (
    <form onSubmit={handlePersonalInfoSubmit} className="form-section">
      <div className="section-header">
        <div className="section-icon">👤</div>
        <div>
          <h2>Personal Information</h2>
          <p>Tell us about yourself</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name <span className="required">*</span></label>
          <input
            type="text"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handlePersonalInfoChange}
            placeholder="John Doe"
            className={formErrors.fullName ? 'error' : ''}
          />
          {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Professional Headline</label>
          <input
            type="text"
            name="headline"
            value={personalInfo.headline}
            onChange={handlePersonalInfoChange}
            placeholder="Senior Full Stack Developer"
          />
        </div>

        <div className="form-group">
          <label>Email <span className="required">*</span></label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handlePersonalInfoChange}
            placeholder="john.doe@example.com"
            className={formErrors.email ? 'error' : ''}
          />
          {formErrors.email && <span className="error-message">{formErrors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone <span className="required">*</span></label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handlePersonalInfoChange}
            placeholder="+1 (555) 123-4567"
            className={formErrors.phone ? 'error' : ''}
          />
          {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={personalInfo.location}
            onChange={handlePersonalInfoChange}
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handlePersonalInfoChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="form-group">
          <label>GitHub</label>
          <input
            type="text"
            name="github"
            value={personalInfo.github}
            onChange={handlePersonalInfoChange}
            placeholder="github.com/johndoe"
          />
        </div>

        <div className="form-group">
          <label>Portfolio</label>
          <input
            type="text"
            name="portfolio"
            value={personalInfo.portfolio}
            onChange={handlePersonalInfoChange}
            placeholder="johndoe.dev"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Professional Summary</label>
        <textarea
          name="summary"
          value={personalInfo.summary}
          onChange={handlePersonalInfoChange}
          placeholder="Write a compelling summary of your professional background, key achievements, and career goals..."
          rows="5"
        />
        <div className="textarea-hint">
          <span className="hint-icon">💡</span>
          <span>Tip: Highlight your years of experience, key skills, and major achievements</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save & Continue
          <span className="btn-icon">→</span>
        </button>
      </div>
    </form>
  );

  const renderExperience = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">💼</div>
        <div>
          <h2>Work Experience</h2>
          <p>Add your relevant work experience</p>
        </div>
      </div>

      {/* Experience Form */}
      <form onSubmit={handleExperienceSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label>Job Title <span className="required">*</span></label>
            <input
              type="text"
              name="position"
              value={experienceForm.position}
              onChange={handleExperienceChange}
              placeholder="e.g., Senior Full Stack Developer"
              className={formErrors.position ? 'error' : ''}
            />
            {formErrors.position && <span className="error-message">{formErrors.position}</span>}
          </div>

          <div className="form-group">
            <label>Company <span className="required">*</span></label>
            <input
              type="text"
              name="company"
              value={experienceForm.company}
              onChange={handleExperienceChange}
              placeholder="e.g., TechCorp Solutions"
              className={formErrors.company ? 'error' : ''}
            />
            {formErrors.company && <span className="error-message">{formErrors.company}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date <span className="required">*</span></label>
            <input
              type="month"
              name="startDate"
              value={experienceForm.startDate}
              onChange={handleExperienceChange}
              className={formErrors.startDate ? 'error' : ''}
            />
            {formErrors.startDate && <span className="error-message">{formErrors.startDate}</span>}
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="month"
              name="endDate"
              value={experienceForm.endDate}
              onChange={handleExperienceChange}
              disabled={experienceForm.current}
              className={formErrors.endDate && !experienceForm.current ? 'error' : ''}
            />
            {formErrors.endDate && !experienceForm.current && (
              <span className="error-message">{formErrors.endDate}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="current"
                checked={experienceForm.current}
                onChange={handleExperienceChange}
              />
              <span className="checkbox-text">I currently work here</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Key Achievements</label>
          <div className="dynamic-list">
            {experienceForm.description.map((desc, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => handleExperienceDescriptionChange(index, e.target.value)}
                  placeholder="• Led development team, reducing deployment time by 60%"
                />
                {experienceForm.description.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeExperienceDescription(index)}
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-item-btn"
              onClick={addExperienceDescription}
            >
              <span className="btn-icon">+</span>
              Add Achievement
            </button>
          </div>
          <div className="field-hint">
            <span className="hint-icon">💡</span>
            <span>Use action verbs and include metrics (e.g., "Increased sales by 20%")</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Experience' : 'Add Experience'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setExperienceForm({
                  position: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: [''],
                  current: false
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Experience List */}
      {resumeData.experience.length > 0 && (
        <div className="items-list">
          <h3>Added Experience</h3>
          <div className="items-grid">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="item-card">
                <div className="item-card-header">
                  <div>
                    <h4>{exp.position}</h4>
                    <p className="item-subtitle">{exp.company}</p>
                  </div>
                  <span className="item-date">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="item-description-list">
                  {exp.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
                <div className="item-card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditExperience(exp)}
                  >
                    <span className="btn-icon">✎</span>
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    <span className="btn-icon">🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">🎓</div>
        <div>
          <h2>Education</h2>
          <p>Add your educational background</p>
        </div>
      </div>

      {/* Education Form */}
      <form onSubmit={handleEducationSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label>Degree <span className="required">*</span></label>
            <input
              type="text"
              name="degree"
              value={educationForm.degree}
              onChange={handleEducationChange}
              placeholder="e.g., Master of Science in Computer Science"
              className={formErrors.degree ? 'error' : ''}
            />
            {formErrors.degree && <span className="error-message">{formErrors.degree}</span>}
          </div>

          <div className="form-group">
            <label>Institution <span className="required">*</span></label>
            <input
              type="text"
              name="institution"
              value={educationForm.institution}
              onChange={handleEducationChange}
              placeholder="e.g., Stanford University"
              className={formErrors.institution ? 'error' : ''}
            />
            {formErrors.institution && <span className="error-message">{formErrors.institution}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date <span className="required">*</span></label>
            <input
              type="month"
              name="startDate"
              value={educationForm.startDate}
              onChange={handleEducationChange}
              className={formErrors.startDate ? 'error' : ''}
            />
            {formErrors.startDate && <span className="error-message">{formErrors.startDate}</span>}
          </div>

          <div className="form-group">
            <label>End Date <span className="required">*</span></label>
            <input
              type="month"
              name="endDate"
              value={educationForm.endDate}
              onChange={handleEducationChange}
              className={formErrors.endDate ? 'error' : ''}
            />
            {formErrors.endDate && <span className="error-message">{formErrors.endDate}</span>}
          </div>

          <div className="form-group">
            <label>GPA</label>
            <input
              type="text"
              name="gpa"
              value={educationForm.gpa}
              onChange={handleEducationChange}
              placeholder="3.8/4.0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Achievements & Activities</label>
          <div className="dynamic-list">
            {educationForm.achievements.map((achievement, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                  placeholder="• Dean's List, Teaching Assistant, Research Published"
                />
                {educationForm.achievements.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeAchievement(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-item-btn"
              onClick={addAchievement}
            >
              <span className="btn-icon">+</span>
              Add Achievement
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Education' : 'Add Education'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setEducationForm({
                  degree: '',
                  institution: '',
                  startDate: '',
                  endDate: '',
                  gpa: '',
                  achievements: ['']
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Education List */}
      {resumeData.education.length > 0 && (
        <div className="items-list">
          <h3>Added Education</h3>
          <div className="items-grid">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="item-card">
                <div className="item-card-header">
                  <div>
                    <h4>{edu.degree}</h4>
                    <p className="item-subtitle">{edu.institution}</p>
                  </div>
                  <span className="item-date">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.gpa && <p className="item-gpa">GPA: {edu.gpa}</p>}
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="item-description-list">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
                <div className="item-card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditEducation(edu)}
                  >
                    <span className="btn-icon">✎</span>
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteEducation(edu.id)}
                  >
                    <span className="btn-icon">🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">⚡</div>
        <div>
          <h2>Skills</h2>
          <p>Add your technical skills by category</p>
        </div>
      </div>

      <div className="skills-categories">
        {['frontend', 'backend', 'database', 'devops'].map(category => (
          <div key={category} className="skill-category-card">
            <div className="category-header">
              <span className="category-icon">
                {category === 'frontend' && '🎨'}
                {category === 'backend' && '⚙️'}
                {category === 'database' && '🗄️'}
                {category === 'devops' && '🚀'}
              </span>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            </div>
            
            <div className="skill-input-group">
              <input
                type="text"
                name={category}
                value={skillInputs[category]}
                onChange={handleSkillInputChange}
                placeholder={`Add ${category} skills (comma separated)`}
              />
              <button 
                type="button"
                className="add-skill-btn"
                onClick={() => handleAddSkills(category)}
              >
                Add
              </button>
            </div>

            <div className="skills-tags-container">
              {resumeData.skills[category]?.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button 
                    className="remove-skill-btn"
                    onClick={() => handleRemoveSkill(category, skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
              {(!resumeData.skills[category] || resumeData.skills[category].length === 0) && (
                <p className="no-skills">No skills added yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="skills-tip">
        <span className="tip-icon">💡</span>
        <div>
          <strong>Pro Tip:</strong> Add both technical and soft skills. Use specific technologies 
          (e.g., "React" instead of "Frontend Development")
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">🚀</div>
        <div>
          <h2>Projects</h2>
          <p>Showcase your key projects</p>
        </div>
      </div>

      {/* Project Form */}
      <form onSubmit={handleProjectSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Project Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={projectForm.name}
              onChange={handleProjectChange}
              placeholder="e.g., E-Commerce Platform"
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description <span className="required">*</span></label>
          <textarea
            name="description"
            value={projectForm.description}
            onChange={handleProjectChange}
            placeholder="Describe the project, its purpose, and your role..."
            rows="3"
            className={formErrors.description ? 'error' : ''}
          />
          {formErrors.description && <span className="error-message">{formErrors.description}</span>}
        </div>

        <div className="form-group">
          <label>Technologies Used</label>
          <div className="dynamic-list">
            {projectForm.technologies.map((tech, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleProjectTechnologyChange(index, e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
                {projectForm.technologies.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeProjectTechnology(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-item-btn"
              onClick={addProjectTechnology}
            >
              <span className="btn-icon">+</span>
              Add Technology
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Key Highlights</label>
          <div className="dynamic-list">
            {projectForm.highlights.map((highlight, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleProjectHighlightChange(index, e.target.value)}
                  placeholder="• Implemented payment gateway handling $2M+ in transactions"
                />
                {projectForm.highlights.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-item-btn"
                    onClick={() => removeProjectHighlight(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-item-btn"
              onClick={addProjectHighlight}
            >
              <span className="btn-icon">+</span>
              Add Highlight
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Project Link (Optional)</label>
          <input
            type="url"
            name="link"
            value={projectForm.link}
            onChange={handleProjectChange}
            placeholder="https://github.com/yourusername/project"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Project
          </button>
        </div>
      </form>

      {/* Projects List */}
      {resumeData.projects.length > 0 && (
        <div className="items-list">
          <h3>Added Projects</h3>
          <div className="items-grid">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="item-card">
                <h4>{project.name}</h4>
                <p className="project-description">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-tech-tags">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="item-description-list">
                    {project.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    <span className="link-icon">🔗</span>
                    View Project
                  </a>
                )}
                <div className="item-card-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => deleteProject(project.id)}
                  >
                    <span className="btn-icon">🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">🏅</div>
        <div>
          <h2>Certifications</h2>
          <p>Add your professional certifications</p>
        </div>
      </div>

      {/* Certification Form */}
      <form onSubmit={handleCertificationSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label>Certification Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={certificationForm.name}
              onChange={handleCertificationChange}
              placeholder="e.g., AWS Certified Solutions Architect"
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Issuing Organization <span className="required">*</span></label>
            <input
              type="text"
              name="issuer"
              value={certificationForm.issuer}
              onChange={handleCertificationChange}
              placeholder="e.g., Amazon Web Services"
              className={formErrors.issuer ? 'error' : ''}
            />
            {formErrors.issuer && <span className="error-message">{formErrors.issuer}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Issue Date <span className="required">*</span></label>
            <input
              type="month"
              name="date"
              value={certificationForm.date}
              onChange={handleCertificationChange}
              className={formErrors.date ? 'error' : ''}
            />
            {formErrors.date && <span className="error-message">{formErrors.date}</span>}
          </div>

          <div className="form-group">
            <label>Credential ID (Optional)</label>
            <input
              type="text"
              name="credentialId"
              value={certificationForm.credentialId}
              onChange={handleCertificationChange}
              placeholder="e.g., AWS-12345"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Certification
          </button>
        </div>
      </form>

      {/* Certifications List */}
      {resumeData.certifications.length > 0 && (
        <div className="items-list">
          <h3>Added Certifications</h3>
          <div className="items-grid">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="item-card certification-card">
                <div className="certification-icon">🏆</div>
                <div className="certification-details">
                  <h4>{cert.name}</h4>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <span className="cert-date">Issued: {cert.date}</span>
                  {cert.credentialId && (
                    <span className="cert-id">ID: {cert.credentialId}</span>
                  )}
                </div>
                <div className="item-card-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => deleteCertification(cert.id)}
                  >
                    <span className="btn-icon">🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">🌐</div>
        <div>
          <h2>Languages</h2>
          <p>Add languages you speak</p>
        </div>
      </div>

      {/* Language Form */}
      <form onSubmit={handleLanguageSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label>Language <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={languageForm.name}
              onChange={handleLanguageChange}
              placeholder="e.g., English, Spanish, Mandarin"
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Proficiency</label>
            <select
              name="proficiency"
              value={languageForm.proficiency}
              onChange={handleLanguageChange}
            >
              {proficiencies.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Language
          </button>
        </div>
      </form>

      {/* Languages List */}
      {resumeData.languages.length > 0 && (
        <div className="items-list">
          <h3>Added Languages</h3>
          <div className="items-grid">
            {resumeData.languages.map((lang) => (
              <div key={lang.id} className="item-card language-card">
                <div className="language-header">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-level">{lang.proficiency || 'Professional Working'}</span>
                </div>
                <div className="item-card-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => deleteLanguage(lang.id)}
                  >
                    <span className="btn-icon">🗑</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="resume-form-container">
      <div className="form-progress-sidebar">
        <div className="progress-header">
          <h3>Resume Builder</h3>
          <p>Complete all sections</p>
        </div>
        
        <div className="progress-steps">
          <button 
            className={`step-item ${activeTab === 'personal' ? 'active' : ''} ${resumeData.personalInfo?.fullName ? 'completed' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <span className="step-indicator">
              {resumeData.personalInfo?.fullName ? '✓' : '1'}
            </span>
            <span className="step-info">
              <span className="step-name">Personal Info</span>
              <span className="step-status">
                {resumeData.personalInfo?.fullName ? 'Completed' : 'Not started'}
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'experience' ? 'active' : ''} ${resumeData.experience.length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <span className="step-indicator">
              {resumeData.experience.length > 0 ? '✓' : '2'}
            </span>
            <span className="step-info">
              <span className="step-name">Experience</span>
              <span className="step-status">
                {resumeData.experience.length} {resumeData.experience.length === 1 ? 'entry' : 'entries'}
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'education' ? 'active' : ''} ${resumeData.education.length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <span className="step-indicator">
              {resumeData.education.length > 0 ? '✓' : '3'}
            </span>
            <span className="step-info">
              <span className="step-name">Education</span>
              <span className="step-status">
                {resumeData.education.length} {resumeData.education.length === 1 ? 'entry' : 'entries'}
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'skills' ? 'active' : ''} ${Object.values(resumeData.skills).flat().length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <span className="step-indicator">
              {Object.values(resumeData.skills).flat().length > 0 ? '✓' : '4'}
            </span>
            <span className="step-info">
              <span className="step-name">Skills</span>
              <span className="step-status">
                {Object.values(resumeData.skills).flat().length} skills
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'projects' ? 'active' : ''} ${resumeData.projects.length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="step-indicator">
              {resumeData.projects.length > 0 ? '✓' : '5'}
            </span>
            <span className="step-info">
              <span className="step-name">Projects</span>
              <span className="step-status">
                {resumeData.projects.length} {resumeData.projects.length === 1 ? 'project' : 'projects'}
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'certifications' ? 'active' : ''} ${resumeData.certifications.length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            <span className="step-indicator">
              {resumeData.certifications.length > 0 ? '✓' : '6'}
            </span>
            <span className="step-info">
              <span className="step-name">Certifications</span>
              <span className="step-status">
                {resumeData.certifications.length} {resumeData.certifications.length === 1 ? 'cert' : 'certs'}
              </span>
            </span>
          </button>

          <button 
            className={`step-item ${activeTab === 'languages' ? 'active' : ''} ${resumeData.languages.length > 0 ? 'completed' : ''}`}
            onClick={() => setActiveTab('languages')}
          >
            <span className="step-indicator">
              {resumeData.languages.length > 0 ? '✓' : '7'}
            </span>
            <span className="step-info">
              <span className="step-name">Languages</span>
              <span className="step-status">
                {resumeData.languages.length} {resumeData.languages.length === 1 ? 'language' : 'languages'}
              </span>
            </span>
          </button>
        </div>

        <div className="progress-footer">
          <div className="completion-stats">
            <div className="completion-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${Math.min(
                    ((resumeData.personalInfo?.fullName ? 1 : 0) +
                    (resumeData.experience.length > 0 ? 1 : 0) +
                    (resumeData.education.length > 0 ? 1 : 0) +
                    (Object.values(resumeData.skills).flat().length > 0 ? 1 : 0) +
                    (resumeData.projects.length > 0 ? 1 : 0) +
                    (resumeData.certifications.length > 0 ? 1 : 0) +
                    (resumeData.languages.length > 0 ? 1 : 0)) * 14.28, 100)} 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="completion-percentage">
                {Math.round(
                  ((resumeData.personalInfo?.fullName ? 1 : 0) +
                  (resumeData.experience.length > 0 ? 1 : 0) +
                  (resumeData.education.length > 0 ? 1 : 0) +
                  (Object.values(resumeData.skills).flat().length > 0 ? 1 : 0) +
                  (resumeData.projects.length > 0 ? 1 : 0) +
                  (resumeData.certifications.length > 0 ? 1 : 0) +
                  (resumeData.languages.length > 0 ? 1 : 0)) * 14.28
                )}%
              </span>
            </div>
            <div className="completion-text">
              <strong>Resume Complete</strong>
              <span>7 sections total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-main-content">
        <div className="form-content-wrapper">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'experience' && renderExperience()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'certifications' && renderCertifications()}
          {activeTab === 'languages' && renderLanguages()}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;