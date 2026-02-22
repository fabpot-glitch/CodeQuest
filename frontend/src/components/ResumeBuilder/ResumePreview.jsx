// components/ResumeBuilder/ResumePreview.jsx
import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import './ResumePreview.css';

const ResumePreview = () => {
  const { resumeData } = useResume();

  // Demo data
  const demoData = {
    personalInfo: {
      fullName: 'John Doe',
      headline: 'Senior Full Stack Developer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Results-driven Full Stack Developer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture. Led development teams of 5+ engineers and delivered 20+ enterprise projects with 99.9% uptime.'
    },
    experience: [
      {
        position: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        startDate: '2021-01',
        endDate: '',
        description: [
          'Architected and deployed microservices infrastructure on AWS, reducing API response time by 40% and serving 500K+ monthly active users',
          'Led agile development team of 6 engineers, implementing CI/CD pipelines that reduced deployment time by 60%',
          'Modernized legacy PHP application to React/Node.js stack, improving performance score from 45 to 95 on Lighthouse',
          'Established code review standards and mentored 4 junior developers who were promoted within 1 year'
        ]
      },
      {
        position: 'Frontend Developer',
        company: 'Digital Innovations Inc',
        startDate: '2018-03',
        endDate: '2020-12',
        description: [
          'Developed responsive React component library used across 12+ e-commerce platforms',
          'Optimized bundle size by 45% through code splitting and lazy loading, improving FCP from 2.5s to 1.2s',
          'Implemented Redux state management and WebSocket integration for real-time inventory updates',
          'Collaborated with UX team to achieve 98% accessibility compliance (WCAG 2.1 AA)'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        institution: 'Stanford University',
        startDate: '2014-09',
        endDate: '2016-05',
        gpa: '3.8/4.0',
        achievements: ['Teaching Assistant for Advanced Web Development', 'Published research on distributed systems']
      },
      {
        degree: 'Bachelor of Science in Software Engineering',
        institution: 'University of California, Berkeley',
        startDate: '2010-09',
        endDate: '2014-05',
        gpa: '3.6/4.0',
        achievements: ["Dean's List (4 semesters)", 'ACM Programming Contest Finalist']
      }
    ],
    skills: {
      frontend: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Webpack'],
      backend: ['Node.js', 'Python', 'Java', 'GraphQL', 'REST APIs'],
      database: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      devops: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
    },
    projects: [
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution serving 50K+ customers',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
        highlights: [
          'Implemented payment gateway handling $2M+ in transactions',
          'Designed inventory system with real-time stock updates',
          'Achieved 95% test coverage with Jest and Cypress'
        ]
      },
      {
        name: 'TaskFlow - Project Management',
        description: 'Collaborative task management tool with real-time features',
        technologies: ['Next.js', 'Express', 'Socket.io', 'PostgreSQL'],
        highlights: [
          'Built real-time collaboration features with operational transformation',
          'Reduced server costs by 35% through optimized database queries',
          'Implemented OAuth 2.0 with support for 5+ providers'
        ]
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023', id: 'AWS-12345' },
      { name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2022', id: 'PSM-54321' },
      { name: 'Google Professional Cloud Developer', issuer: 'Google Cloud', date: '2023', id: 'GCP-98765' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Spanish', proficiency: 'Professional Working' },
      { name: 'Mandarin', proficiency: 'Conversational' }
    ]
  };

  const data = resumeData?.personalInfo?.fullName ? resumeData : demoData;

  const formatDate = (date) => {
    if (!date) return 'Present';
    try {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return date;
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JD';

  // ─── MODERN TEMPLATE ───────────────────────────────────────
  const ModernTemplate = () => (
    <div className="template-modern">
      <div className="modern-grid">
        <div className="modern-left">
          <div className="modern-profile">
            <div className="modern-avatar">{getInitials(data.personalInfo.fullName)}</div>
            <h1>{data.personalInfo.fullName}</h1>
            <p className="modern-title">{data.personalInfo.headline}</p>
          </div>

          <div className="modern-section">
            <h2>Contact</h2>
            <div className="modern-contact">
              <div><span className="contact-icon">📧</span> {data.personalInfo.email}</div>
              <div><span className="contact-icon">📱</span> {data.personalInfo.phone}</div>
              <div><span className="contact-icon">📍</span> {data.personalInfo.location}</div>
            </div>
          </div>

          <div className="modern-section">
            <h2>Technical Skills</h2>
            <div className="modern-skills">
              {Object.entries(data.skills).map(([cat, skills]) => (
                <div className="skill-category" key={cat}>
                  <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                  <div className="skill-tags">
                    {skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modern-section">
            <h2>Certifications</h2>
            <div className="modern-certifications">
              {data.certifications.map((cert, i) => (
                <div key={i} className="cert-item">
                  <div className="cert-icon">🏅</div>
                  <div className="cert-details">
                    <strong>{cert.name}</strong>
                    <span>{cert.issuer} · {cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modern-right">
          <div className="modern-section">
            <h2>Professional Summary</h2>
            <p className="modern-summary">{data.personalInfo.summary}</p>
          </div>

          <div className="modern-section">
            <h2>Work Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="experience-item">
                <div className="exp-header">
                  <div className="exp-title">
                    <h3>{exp.position}</h3>
                    <span className="exp-company">{exp.company}</span>
                  </div>
                  <span className="exp-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                </div>
                <ul className="exp-description">
                  {exp.description.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="modern-section">
            <h2>Featured Projects</h2>
            {data.projects.map((project, i) => (
              <div key={i} className="project-item">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <div className="project-tech">
                    {project.technologies.map((tech, j) => <span key={j} className="tech-badge">{tech}</span>)}
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <ul className="project-highlights">
                  {project.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="modern-section">
            <h2>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="education-item">
                <div className="edu-header">
                  <div>
                    <h3>{edu.degree}</h3>
                    <span className="edu-institution">{edu.institution}</span>
                  </div>
                  <span className="edu-date">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
                <div className="edu-gpa">GPA: {edu.gpa}</div>
                <ul className="edu-achievements">
                  {edu.achievements.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PROFESSIONAL TEMPLATE ─────────────────────────────────
  const ProfessionalTemplate = () => (
    <div className="template-professional">
      <div className="professional-header">
        <div className="header-content">
          <h1>{data.personalInfo.fullName}</h1>
          <p className="professional-title">{data.personalInfo.headline}</p>
          <div className="professional-contact">
            <span>📧 {data.personalInfo.email}</span>
            <span>📱 {data.personalInfo.phone}</span>
            <span>📍 {data.personalInfo.location}</span>
          </div>
        </div>
      </div>

      <div className="professional-grid">
        <div className="professional-left">
          <div className="professional-block">
            <h2>Profile</h2>
            <p>{data.personalInfo.summary}</p>
          </div>
          <div className="professional-block">
            <h2>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="professional-exp-item">
                <div className="exp-marker">
                  <div className="exp-dot" />
                  {i < data.experience.length - 1 && <div className="exp-line" />}
                </div>
                <div className="exp-content">
                  <div className="exp-header">
                    <h3>{exp.position}</h3>
                    <span className="exp-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                  </div>
                  <div className="exp-company">{exp.company}</div>
                  <ul>{exp.description.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="professional-right">
          <div className="professional-block">
            <h2>Skills</h2>
            <div className="professional-skills">
              {Object.entries(data.skills).map(([cat, skills]) => (
                <div key={cat} className="skill-category">
                  <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                  <div className="skill-list">
                    {skills.map((s, i) => <div key={i} className="skill-item"><span>{s}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="professional-block">
            <h2>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="professional-edu-item">
                <h3>{edu.degree}</h3>
                <div className="edu-meta">
                  <span className="edu-institution">{edu.institution}</span>
                  <span className="edu-date">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                </div>
                <div className="edu-gpa">GPA: {edu.gpa}</div>
              </div>
            ))}
          </div>

          <div className="professional-block">
            <h2>Certifications</h2>
            <div className="professional-certs">
              {data.certifications.map((cert, i) => (
                <div key={i} className="cert-item">
                  <div className="cert-icon">▹</div>
                  <div className="cert-info">
                    <strong>{cert.name}</strong>
                    <span>{cert.issuer} · {cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── EXECUTIVE TEMPLATE ────────────────────────────────────
  const ExecutiveTemplate = () => (
    <div className="template-executive">
      <div className="executive-container">
        <div className="executive-header">
          <div className="executive-name-title">
            <h1>{data.personalInfo.fullName}</h1>
            <p className="executive-subtitle">{data.personalInfo.headline}</p>
          </div>
          <div className="executive-accent" style={{ backgroundColor: '#7c3aed' }} />
        </div>

        <div className="executive-contact-bar">
          <div className="contact-item"><span>📧</span><span>{data.personalInfo.email}</span></div>
          <div className="contact-divider">|</div>
          <div className="contact-item"><span>📱</span><span>{data.personalInfo.phone}</span></div>
          <div className="contact-divider">|</div>
          <div className="contact-item"><span>📍</span><span>{data.personalInfo.location}</span></div>
        </div>

        <div className="executive-grid">
          <div className="executive-main">
            <div className="executive-section">
              <h2>Executive Profile</h2>
              <p className="executive-summary">{data.personalInfo.summary}</p>
            </div>
            <div className="executive-section">
              <h2>Professional Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} className="executive-exp-item">
                  <div className="exp-period"><span className="exp-date-range">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span></div>
                  <div className="exp-details">
                    <h3>{exp.position}</h3>
                    <div className="exp-company">{exp.company}</div>
                    <ul className="exp-achievements">{exp.description.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="executive-section">
              <h2>Key Projects</h2>
              {data.projects.map((project, i) => (
                <div key={i} className="executive-project-item">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech-stack">
                    {project.technologies.map((tech, j) => <span key={j} className="tech-pill">{tech}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="executive-sidebar">
            <div className="executive-section">
              <h2>Core Competencies</h2>
              <div className="competencies-list">
                {Object.entries(data.skills).map(([cat, skills]) => (
                  <div key={cat} className="competency-category">
                    <h3>{cat}</h3>
                    <div className="competency-items">
                      {skills.map((s, i) => <div key={i} className="competency-item">{s}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="executive-section">
              <h2>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="executive-edu-item">
                  <h3>{edu.degree}</h3>
                  <div className="edu-institution">{edu.institution}</div>
                  <div className="edu-meta">
                    <span>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                    <span className="edu-gpa">GPA: {edu.gpa}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="executive-section">
              <h2>Languages</h2>
              <div className="executive-languages">
                {data.languages.map((lang, i) => (
                  <div key={i} className="language-item">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-level">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── MINIMAL TEMPLATE ──────────────────────────────────────
  const MinimalTemplate = () => (
    <div className="template-minimal">
      <div className="minimal-container">
        <div className="minimal-header">
          <h1>{data.personalInfo.fullName}</h1>
          <p className="minimal-headline">{data.personalInfo.headline}</p>
          <div className="minimal-contact">
            <span>{data.personalInfo.email}</span>
            <span className="separator">•</span>
            <span>{data.personalInfo.phone}</span>
            <span className="separator">•</span>
            <span>{data.personalInfo.location}</span>
          </div>
        </div>

        <hr className="minimal-divider" />

        <div className="minimal-content">
          <div className="minimal-block">
            <h2>Summary</h2>
            <p className="minimal-summary">{data.personalInfo.summary}</p>
          </div>

          <div className="minimal-two-column">
            <div className="minimal-left">
              <div className="minimal-block">
                <h2>Experience</h2>
                {data.experience.map((exp, i) => (
                  <div key={i} className="minimal-exp-item">
                    <div className="exp-header">
                      <div>
                        <h3>{exp.position}</h3>
                        <p className="exp-company">{exp.company}</p>
                      </div>
                      <span className="exp-date">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                    </div>
                    <ul className="exp-list">{exp.description.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="minimal-block">
                <h2>Projects</h2>
                {data.projects.map((project, i) => (
                  <div key={i} className="minimal-project-item">
                    <h3>{project.name}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tech-minimal">
                      {project.technologies.map((tech, j) => <span key={j}>{tech}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="minimal-right">
              <div className="minimal-block">
                <h2>Skills</h2>
                {Object.entries(data.skills).map(([cat, skills]) => (
                  <div key={cat} className="minimal-skill-category">
                    <h3>{cat}</h3>
                    <div className="minimal-skill-tags">
                      {skills.map((s, i) => <span key={i} className="minimal-skill-tag">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="minimal-block">
                <h2>Education</h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="minimal-edu-item">
                    <h3>{edu.degree}</h3>
                    <p className="edu-institution">{edu.institution}</p>
                    <div className="edu-meta">
                      <span>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="minimal-block">
                <h2>Certifications</h2>
                {data.certifications.map((cert, i) => (
                  <div key={i} className="minimal-cert-item">
                    <strong>{cert.name}</strong>
                    <span>{cert.issuer} · {cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────
  // Default to modern — template selection lives in ExportPage
  return (
    <div className="resume-preview-wrapper">
      <div className="resume-paper">
        <ModernTemplate />
      </div>
    </div>
  );
};

export default ResumePreview;