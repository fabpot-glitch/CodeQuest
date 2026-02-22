// pages/BuilderPage.jsx
import React, { useState, useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import ResumeForm from '../components/ResumeBuilder/ResumeForm';
import ResumePreview from '../components/ResumeBuilder/ResumePreview';
import Sidebar from '../components/Sidebar';
import './BuilderPage.css';

// Try to import html2pdf
let html2pdf;
try {
  html2pdf = require('html2pdf.js');
} catch (e) {
  console.warn('html2pdf.js not installed, using fallback methods');
  html2pdf = null;
}

const BuilderPage = () => {
  const { resumeData } = useResume();
  const [activeTab, setActiveTab] = useState('builder');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [selectedTextSize, setSelectedTextSize] = useState('medium');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    experience: true,
    skills: true,
    projects: true,
    education: true,
    certifications: true
  });
  
  // Create refs
  const previewRef = useRef(null);
  const fullPreviewRef = useRef(null);

  const tabs = [
    { id: 'builder', name: 'Form Builder', icon: 'fas fa-edit', color: '#3b82f6' },
    { id: 'preview', name: 'Live Preview', icon: 'fas fa-eye', color: '#10b981' },
    { id: 'export', name: 'Export', icon: 'fas fa-file-export', color: '#8b5cf6' }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', icon: 'fas fa-pen-fancy' },
    { id: 'professional', name: 'Professional', icon: 'fas fa-briefcase' },
    { id: 'executive', name: 'Executive', icon: 'fas fa-crown' },
    { id: 'minimal', name: 'Minimal', icon: 'fas fa-circle' }
  ];

  const textSizes = [
    { id: 'small', name: 'Small', value: 0.9 },
    { id: 'medium', name: 'Medium', value: 1 },
    { id: 'large', name: 'Large', value: 1.2 }
  ];

  const sections = [
    { id: 'summary', name: 'Summary', icon: 'fas fa-align-left' },
    { id: 'experience', name: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'skills', name: 'Skills', icon: 'fas fa-code' },
    { id: 'projects', name: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'certifications', name: 'Certifications', icon: 'fas fa-certificate' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNext = () => {
    if (activeTab === 'builder') {
      setActiveTab('preview');
    } else if (activeTab === 'preview') {
      setActiveTab('export');
    }
  };

  const handleBack = () => {
    if (activeTab === 'preview') {
      setActiveTab('builder');
    } else if (activeTab === 'export') {
      setActiveTab('preview');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleTextSizeSelect = (sizeId) => {
    setSelectedTextSize(sizeId);
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // PDF Download function
  const handlePDFDownload = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      const previewElement = fullPreviewRef.current;
      
      if (!previewElement) {
        throw new Error('Could not find resume content to export');
      }

      const resumeContent = previewElement.querySelector('.resume-preview') || 
                           previewElement.querySelector('.preview-content') ||
                           previewElement.firstChild;

      if (!resumeContent) {
        throw new Error('Could not find resume preview content');
      }

      const contentClone = resumeContent.cloneNode(true);

      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'pdf-export-container';
      pdfContainer.style.cssText = `
        padding: 40px;
        background: white;
        max-width: 800px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      `;

      const styles = document.createElement('style');
      styles.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #1e293b;
        }
        
        .resume-preview {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        
        .resume-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        
        .resume-header h1 {
          font-size: 42px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }
        
        .resume-header .title {
          font-size: 20px;
          color: #2563eb;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .contact-info {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #64748b;
        }
        
        .contact-info span {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .contact-info i {
          color: #2563eb;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 40px 0 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: #2563eb;
        }
        
        .summary-text {
          color: #475569;
          line-height: 1.8;
          font-size: 16px;
        }
        
        .experience-item {
          margin-bottom: 30px;
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .experience-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        
        .company {
          font-size: 16px;
          color: #2563eb;
          font-weight: 500;
        }
        
        .experience-date {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        
        .experience-description {
          margin: 15px 0 0;
          padding-left: 20px;
        }
        
        .experience-description li {
          margin-bottom: 8px;
          color: #475569;
          font-size: 15px;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        
        .skill-tag {
          background: #f1f5f9;
          color: #1e293b;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        
        .certification-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }
        
        .cert-icon {
          width: 36px;
          height: 36px;
          background: #2563eb;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }
        
        .cert-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }
        
        .cert-info p {
          font-size: 12px;
          color: #64748b;
        }
        
        .cert-date {
          font-size: 11px;
          color: #2563eb;
          font-weight: 500;
          margin-left: auto;
          white-space: nowrap;
        }
        
        button, .btn, .nav-btn, .export-btn, .print-btn, 
        .html-btn, .tab-flush {
          display: none !important;
        }
      `;

      pdfContainer.appendChild(styles);
      pdfContainer.appendChild(contentClone);

      if (html2pdf) {
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `${resumeData.personalInfo?.fullName || 'resume'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: false,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait' 
          }
        };
        
        await html2pdf().set(opt).from(pdfContainer).save();
      } else {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${resumeData.personalInfo?.fullName || 'Resume'}</title>
              <style>
                ${styles.textContent}
                body { 
                  padding: 40px; 
                  background: white;
                }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              ${contentClone.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert(`Failed to generate PDF: ${error.message}. Try using the Print option instead.`);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle DOC download (simulated)
  const handleDOCDownload = () => {
    alert('DOC download feature coming soon!');
  };

  // Handle Print
  const handlePrint = () => {
    const previewElement = fullPreviewRef.current;
    
    if (previewElement) {
      const resumeContent = previewElement.querySelector('.resume-preview') || 
                           previewElement.firstChild;
      
      if (resumeContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${resumeData.personalInfo?.fullName || 'Resume'}</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  padding: 40px;
                  background: white;
                }
                .resume-preview {
                  max-width: 800px;
                  margin: 0 auto;
                }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              ${resumeContent.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Handle Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resumeData.personalInfo?.fullName || 'My'} Resume`,
          text: 'Check out my resume!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share canceled');
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleExportPDF = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePDFDownload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'builder':
        return <ResumeForm onStepChange={setCurrentStep} />;
      case 'preview':
        return (
          <div className="preview-wrapper" ref={previewRef}>
            <ResumePreview />
          </div>
        );
      case 'export':
        return (
          <div className="export-container">
            <div className="export-content">
              {/* ATS Score Section */}
              <div className="ats-score-section">
                <div className="ats-score-number">92/100</div>
                <div className="ats-score-label">ATS Score</div>
                <div className="ats-score-badge">Strong resume</div>
              </div>

              {/* Improve with AI Section */}
              <div className="ai-improve-section">
                <h3>Improve with AI</h3>
                <p>Get personalized suggestions to enhance your resume</p>
                <button className="ai-button">
                  <i className="fas fa-magic"></i> Enhance with AI
                </button>
              </div>

              {/* Template Selection */}
              <div className="template-section">
                <h3>TEMPLATE</h3>
                <div className="template-grid">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <i className={template.icon}></i>
                      <span>{template.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Size and Zoom */}
              <div className="text-size-section">
                <h3>TEXT SIZE</h3>
                <div className="text-size-options">
                  {textSizes.map(size => (
                    <button
                      key={size.id}
                      className={`size-btn ${selectedTextSize === size.id ? 'active' : ''}`}
                      onClick={() => handleTextSizeSelect(size.id)}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                
                <div className="zoom-control">
                  <span>ZOOM</span>
                  <div className="zoom-buttons">
                    <button onClick={handleZoomOut}><i className="fas fa-minus"></i></button>
                    <span className="zoom-value">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={handleZoomIn}><i className="fas fa-plus"></i></button>
                  </div>
                </div>
              </div>

              {/* Sections Selection */}
              <div className="sections-section">
                <h3>All Sections</h3>
                <div className="sections-grid">
                  {sections.map(section => (
                    <div 
                      key={section.id}
                      className={`section-chip ${selectedSections[section.id] ? 'selected' : ''}`}
                      onClick={() => handleSectionToggle(section.id)}
                    >
                      <i className={section.icon}></i>
                      <span>{section.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Preview for Export */}
              <div style={{ display: 'none' }} ref={fullPreviewRef}>
                <ResumePreview />
              </div>

              {/* Mini Preview */}
              <div className="mini-preview-section">
                <h3>Preview</h3>
                <div className="mini-preview-container">
                  <div style={{ transform: `scale(${zoomLevel * 0.8})`, transformOrigin: 'top left' }}>
                    <ResumePreview />
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="download-options">
                <button 
                  className="download-btn pdf"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  <i className={`fas ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`}></i>
                  <span>PDF</span>
                </button>
                
                <button 
                  className="download-btn doc"
                  onClick={handleDOCDownload}
                >
                  <i className="fas fa-file-word"></i>
                  <span>DOC</span>
                </button>
                
                <button 
                  className="download-btn print"
                  onClick={handlePrint}
                >
                  <i className="fas fa-print"></i>
                  <span>Print</span>
                </button>
                
                <button 
                  className="download-btn share"
                  onClick={handleShare}
                >
                  <i className="fas fa-share-alt"></i>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <ResumeForm onStepChange={setCurrentStep} />;
    }
  };

  return (
    <div className="builder-page">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`builder-main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Compact Header */}
        <div className="builder-compact-header">
          <div className="header-left">
            <span className="header-title">Resume Builder</span>
            {resumeData.personalInfo?.fullName && (
              <span className="header-subtitle">{resumeData.personalInfo.fullName}'s Resume</span>
            )}
          </div>
          <div className="header-right">
            <div className="header-status">
              <span className="status-dot"></span>
              <span className="status-text">All changes saved</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="builder-tabs-flush">
          <div className="tabs-left">
            {tabs.slice(0, 2).map((tab) => (
              <button
                key={tab.id}
                className={`tab-flush ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                style={{ '--tab-color': tab.color }}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
          
          <div className="tabs-divider"></div>
          
          <div className="tabs-right">
            <button
              className={`tab-flush export-tab-flush ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => handleTabClick('export')}
            >
              <i className="fas fa-file-export"></i>
              <span>Export</span>
              <span className="tab-badge">NEW</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="builder-content-area">
          <div className="content-panel">
            {renderContent()}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="builder-bottom-nav-flush">
          <div className="nav-container-flush">
            <button 
              className={`nav-btn-flush back-btn-flush ${activeTab === 'builder' ? 'disabled' : ''}`}
              onClick={handleBack}
              disabled={activeTab === 'builder'}
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
            
            <div className="nav-progress-flush">
              <div className="progress-step-flush">
                <div className={`step-marker-flush ${activeTab === 'builder' ? 'active' : ''} ${activeTab === 'preview' || activeTab === 'export' ? 'completed' : ''}`}>
                  {activeTab === 'preview' || activeTab === 'export' ? <i className="fas fa-check"></i> : '1'}
                </div>
                <span className="step-label-flush">Form</span>
              </div>
              <div className="progress-connector-flush">
                <span className={`connector-line-flush ${activeTab === 'preview' || activeTab === 'export' ? 'active' : ''}`}></span>
              </div>
              <div className="progress-step-flush">
                <div className={`step-marker-flush ${activeTab === 'preview' ? 'active' : ''} ${activeTab === 'export' ? 'completed' : ''}`}>
                  {activeTab === 'export' ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className="step-label-flush">Preview</span>
              </div>
              <div className="progress-connector-flush">
                <span className={`connector-line-flush ${activeTab === 'export' ? 'active' : ''}`}></span>
              </div>
              <div className="progress-step-flush">
                <div className={`step-marker-flush ${activeTab === 'export' ? 'active' : ''}`}>
                  3
                </div>
                <span className="step-label-flush">Export</span>
              </div>
            </div>
            
            <button 
              className="nav-btn-flush next-btn-flush"
              onClick={handleNext}
              disabled={activeTab === 'export'}
            >
              <span>{activeTab === 'export' ? 'Complete' : 'Next'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;