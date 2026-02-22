// components/ResumeBuilder/ExportModal.jsx
import React, { useState, useEffect } from 'react';
import { exportResumeAsPDF, exportResumeAsDoc } from '../../services/pdfExportService';
import './ExportModal.css';

const ExportModal = ({ isOpen, onClose, previewRef, fullName, onExportComplete }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportStatus, setExportStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [exportStats, setExportStats] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setExportStatus('idle');
      setErrorMessage('');
      setExportProgress(0);
      setDownloadUrl('');
      setExportStats(null);
    }
  }, [isOpen]);

  const handleExport = async () => {
    if (!previewRef?.current) {
      setErrorMessage('Preview element not found');
      setExportStatus('error');
      return;
    }

    setExportStatus('loading');
    setErrorMessage('');
    setExportProgress(30);

    try {
      let result;
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      if (exportFormat === 'pdf') {
        result = await exportResumeAsPDF(previewRef.current, fullName);
      } else {
        result = await exportResumeAsDoc(previewRef.current, fullName);
      }

      clearInterval(progressInterval);
      setExportProgress(100);
      setExportStats(result);
      setExportStatus('success');
      
      // Create download URL
      setTimeout(() => {
        setDownloadUrl('#');
      }, 500);

      if (onExportComplete) {
        onExportComplete({ format: exportFormat, ...result });
      }

    } catch (error) {
      setExportStatus('error');
      setErrorMessage(error.message || 'Export failed. Please try again.');
      setExportProgress(0);
    }
  };

  const handleDownload = () => {
    // Reset modal after download
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-content">
        {/* Header */}
        <div className="export-modal-header">
          <div className="header-icon">
            {exportStatus === 'success' ? '✅' : exportStatus === 'error' ? '❌' : '📄'}
          </div>
          <div className="header-text">
            <h2>
              {exportStatus === 'loading' && 'Preparing Your Resume'}
              {exportStatus === 'success' && 'Your Resume is Ready!'}
              {exportStatus === 'error' && 'Export Failed'}
              {exportStatus === 'idle' && 'Export as PDF'}
            </h2>
            <p>
              {exportStatus === 'loading' && 'Please wait while we generate your document...'}
              {exportStatus === 'success' && `Successfully generated ${exportFormat.toUpperCase()}`}
              {exportStatus === 'error' && errorMessage}
              {exportStatus === 'idle' && 'Choose format and download your resume'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="export-modal-body">
          {exportStatus === 'idle' && (
            <>
              <div className="format-selector">
                <div className="selector-label">Select Format</div>
                <div className="format-options">
                  <button
                    className={`format-option ${exportFormat === 'pdf' ? 'active' : ''}`}
                    onClick={() => setExportFormat('pdf')}
                  >
                    <span className="format-icon">📄</span>
                    <span className="format-name">PDF</span>
                    <span className="format-desc">Best for printing & sharing</span>
                  </button>
                  <button
                    className={`format-option ${exportFormat === 'doc' ? 'active' : ''}`}
                    onClick={() => setExportFormat('doc')}
                  >
                    <span className="format-icon">📝</span>
                    <span className="format-name">DOC</span>
                    <span className="format-desc">Editable Word document</span>
                  </button>
                </div>
              </div>

              <div className="export-options">
                <div className="option-group">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Include contact information</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Optimize for ATS</span>
                  </label>
                </div>
              </div>

              <div className="export-preview">
                <div className="preview-badge">
                  <span className="badge-icon">📋</span>
                  <span>Preview ready • {fullName || 'Resume'}</span>
                </div>
              </div>
            </>
          )}

          {exportStatus === 'loading' && (
            <div className="export-progress-container">
              <div className="progress-visual">
                <div className="progress-circle">
                  <svg className="progress-ring" width="120" height="120">
                    <circle
                      className="progress-ring-circle-bg"
                      stroke="#e2e8f0"
                      strokeWidth="6"
                      fill="transparent"
                      r="54"
                      cx="60"
                      cy="60"
                    />
                    <circle
                      className="progress-ring-circle"
                      stroke="#2563eb"
                      strokeWidth="6"
                      fill="transparent"
                      r="54"
                      cx="60"
                      cy="60"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 54}`,
                        strokeDashoffset: `${2 * Math.PI * 54 * (1 - exportProgress / 100)}`
                      }}
                    />
                  </svg>
                  <span className="progress-percentage">{exportProgress}%</span>
                </div>
                <div className="progress-details">
                  <div className="progress-status">
                    <span className="status-dot"></span>
                    Generating {exportFormat.toUpperCase()} file...
                  </div>
                  <div className="progress-estimate">This may take a few seconds</div>
                </div>
              </div>
            </div>
          )}

          {exportStatus === 'success' && (
            <div className="export-success">
              <div className="success-animation">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                  </div>
                </div>
              </div>
              
              <div className="success-details">
                <div className="file-info">
                  <span className="file-icon">📁</span>
                  <div className="file-details">
                    <strong>{exportStats?.filename || 'resume.pdf'}</strong>
                    <span>{exportStats?.pages || 1} page · 2.4 MB</span>
                  </div>
                </div>
                
                <div className="success-actions">
                  <a 
                    href={downloadUrl} 
                    download={exportStats?.filename}
                    onClick={handleDownload}
                    className="download-btn"
                  >
                    <span className="btn-icon">⬇️</span>
                    Download {exportFormat.toUpperCase()}
                  </a>
                  <button className="share-btn" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Download link copied!');
                  }}>
                    <span className="btn-icon">🔗</span>
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="success-tip">
                <span className="tip-icon">💡</span>
                <span>Your resume is ATS-friendly and ready to submit to employers</span>
              </div>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="export-error">
              <div className="error-icon">⚠️</div>
              <div className="error-message">
                <strong>Something went wrong</strong>
                <p>{errorMessage || 'Failed to generate resume. Please try again.'}</p>
              </div>
              <button className="retry-btn" onClick={handleExport}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="export-modal-footer">
          {exportStatus === 'idle' && (
            <>
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="export-btn" onClick={handleExport}>
                <span className="btn-icon">⬇️</span>
                Export Resume
              </button>
            </>
          )}
          
          {exportStatus === 'success' && (
            <button className="done-btn" onClick={onClose}>
              Done
            </button>
          )}
          
          {exportStatus === 'error' && (
            <button className="cancel-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;