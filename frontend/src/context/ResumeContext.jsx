// context/ResumeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    experience: [],
    education: [],
    skills: {
      frontend: [],
      backend: [],
      database: [],
      devops: []
    },
    projects: [],
    certifications: [],
    languages: []
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form validation status
  useEffect(() => {
    const validateForm = () => {
      // Basic validation - check if personal info has required fields
      const { personalInfo } = resumeData;
      const isValid = personalInfo.fullName?.trim() !== '' && 
                     personalInfo.email?.trim() !== '' &&
                     personalInfo.phone?.trim() !== '';
      setIsFormValid(isValid);
    };
    validateForm();
  }, [resumeData]);

  const updatePersonalInfo = (info) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const addExperience = (exp) => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...exp, id: Date.now() }]
    }));
  };

  const updateExperience = (id, updatedExp) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updatedExp } : exp
      )
    }));
  };

  const deleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = (edu) => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { ...edu, id: Date.now() }]
    }));
  };

  const updateEducation = (id, updatedEdu) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updatedEdu } : edu
      )
    }));
  };

  const deleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateSkills = (category, skills) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills }
    }));
  };

  const addProject = (project) => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: Date.now() }]
    }));
  };

  const updateProject = (id, updatedProject) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, ...updatedProject } : project
      )
    }));
  };

  const deleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addCertification = (cert) => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...cert, id: Date.now() }]
    }));
  };

  const deleteCertification = (id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addLanguage = (lang) => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, { ...lang, id: Date.now() }]
    }));
  };

  const deleteLanguage = (id) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const resetResume = () => {
    setResumeData({
      personalInfo: {
        fullName: '',
        headline: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      experience: [],
      education: [],
      skills: {
        frontend: [],
        backend: [],
        database: [],
        devops: []
      },
      projects: [],
      certifications: [],
      languages: []
    });
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      activeStep,
      setActiveStep,
      isFormValid,
      updatePersonalInfo,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      updateSkills,
      addProject,
      updateProject,
      deleteProject,
      addCertification,
      deleteCertification,
      addLanguage,
      deleteLanguage,
      resetResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
};