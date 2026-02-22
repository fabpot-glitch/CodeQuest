import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './CourseCertificate.css';

// ─── Edit Modal ────────────────────────────────────────────────────────────
const EditModal = ({ data, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: data.name || '',
    courseTitle: data.course?.title || '',
    instructor: data.course?.instructor || '',
    duration: data.course?.duration || '',
    grade: data.grade != null ? String(data.grade) : '',
    instructorTitle: data.course?.instructorTitle || '',
    certificateId: data.certificateId || '',
  });

  const [errors, setErrors] = useState({});

  const handle = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.courseTitle.trim()) newErrors.courseTitle = 'Course title is required';
    
    const grade = parseInt(form.grade, 10);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      newErrors.grade = 'Grade must be between 0 and 100';
    }
    
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const grade = parseInt(form.grade, 10);
    onSave({
      ...form,
      grade,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div 
        className="edit-modal" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <div className="edit-modal-header">
          <h2 id="edit-modal-title">Edit Certificate</h2>
          <button className="edit-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="edit-modal-body">
          <div className="edit-field">
            <label htmlFor="recipient-name">
              Recipient Name <span className="req">*</span>
            </label>
            <input
              id="recipient-name"
              type="text"
              value={form.name}
              onChange={handle('name')}
              placeholder="Enter full name"
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="edit-field">
            <label htmlFor="course-title">
              Course Title <span className="req">*</span>
            </label>
            <input
              id="course-title"
              type="text"
              value={form.courseTitle}
              onChange={handle('courseTitle')}
              placeholder="Enter course title"
              className={errors.courseTitle ? 'error' : ''}
            />
            {errors.courseTitle && <span className="error-message">{errors.courseTitle}</span>}
          </div>

          <div className="edit-field">
            <label htmlFor="instructor">Instructor Name</label>
            <input
              id="instructor"
              type="text"
              value={form.instructor}
              onChange={handle('instructor')}
              placeholder="Enter instructor name"
            />
          </div>

          <div className="edit-field">
            <label htmlFor="instructor-title">Instructor Title</label>
            <input
              id="instructor-title"
              type="text"
              value={form.instructorTitle}
              onChange={handle('instructorTitle')}
              placeholder="e.g., Senior Engineer @ Google"
            />
          </div>

          <div className="edit-row">
            <div className="edit-field">
              <label htmlFor="duration">Duration</label>
              <input
                id="duration"
                type="text"
                value={form.duration}
                onChange={handle('duration')}
                placeholder="e.g., 40 hours"
              />
            </div>
            <div className="edit-field">
              <label htmlFor="grade">
                Grade (0–100) <span className="req">*</span>
              </label>
              <input
                id="grade"
                type="number"
                min="0"
                max="100"
                step="1"
                value={form.grade}
                onChange={handle('grade')}
                placeholder="92"
                className={errors.grade ? 'error' : ''}
              />
              {errors.grade && <span className="error-message">{errors.grade}</span>}
            </div>
          </div>

          <div className="edit-field">
            <label htmlFor="certificate-id">Certificate ID (optional)</label>
            <input
              id="certificate-id"
              type="text"
              value={form.certificateId}
              onChange={handle('certificateId')}
              placeholder="Custom certificate ID"
            />
            <span className="field-hint">Leave empty to auto-generate</span>
          </div>
        </div>

        <div className="edit-modal-footer">
          <button className="edit-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="edit-save-btn" onClick={handleSave}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const CourseCertificate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [shareTooltip, setShareTooltip] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [canUndo, setCanUndo] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    course: null,
    completionDate: null,
    grade: null,
    certificateId: ''
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({ pdf: false, jpg: false, png: false });

  // Load initial data
  useEffect(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem(`certificate-${courseId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse saved certificate data');
      }
    }

    // Fallback to mock data
    setTimeout(() => {
      const mockCourse = {
        id: parseInt(courseId),
        title: 'Complete Data Structures & Algorithms',
        instructor: 'Dr. Sarah Johnson',
        instructorTitle: 'Senior Software Engineer @ Google',
        duration: '40 hours',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      };
      const mockUser = { name: 'John Doe', completionDate: new Date().toISOString(), grade: 92 };
      const certId = `CERT-${courseId}-${Date.now().toString(36).toUpperCase()}`;
      
      const initialData = {
        name: mockUser.name,
        course: mockCourse,
        completionDate: mockUser.completionDate,
        grade: mockUser.grade,
        certificateId: certId
      };
      
      setUserData(initialData);
      localStorage.setItem(`certificate-${courseId}`, JSON.stringify(initialData));
      setLoading(false);
    }, 1000);
  }, [courseId]);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    if (!loading && userData.course) {
      localStorage.setItem(`certificate-${courseId}`, JSON.stringify(userData));
    }
  }, [userData, courseId, loading]);

  // ── Edit handler with history ────────────────────────────────────────────
  const handleEditSave = (form) => {
    // Save current state to history before updating
    setEditHistory(prev => [...prev, userData]);
    setCanUndo(true);

    const updatedData = {
      ...userData,
      name: form.name,
      grade: form.grade,
      certificateId: form.certificateId || userData.certificateId,
      course: {
        ...userData.course,
        title: form.courseTitle,
        instructor: form.instructor,
        instructorTitle: form.instructorTitle,
        duration: form.duration,
      },
    };
    
    setUserData(updatedData);
    setShowEditModal(false);
    
    // Show success message (you can implement a toast notification here)
    console.log('Certificate updated successfully');
  };

  // ── Undo last edit ───────────────────────────────────────────────────────
  const handleUndo = () => {
    if (editHistory.length > 0) {
      const previousState = editHistory[editHistory.length - 1];
      setUserData(previousState);
      setEditHistory(prev => prev.slice(0, -1));
      setCanUndo(editHistory.length > 1);
    }
  };

  // ── Reset to original ────────────────────────────────────────────────────
  const handleReset = () => {
    if (window.confirm('Reset all changes to original certificate?')) {
      localStorage.removeItem(`certificate-${courseId}`);
      window.location.reload(); // Reload to get fresh mock data
    }
  };

  // ── Download handlers (unchanged) ────────────────────────────────────────
  const captureCanvas = () =>
    html2canvas(certificateRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      useCORS: true
    });

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading((p) => ({ ...p, pdf: true }));
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width * 0.75, canvas.height * 0.75]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
      pdf.save(`${userData.course.title} - Certificate.pdf`);
    } catch (e) {
      alert('Failed to generate certificate. Please try again.');
      console.error(e);
    }
    setDownloading((p) => ({ ...p, pdf: false }));
    setShowDownloadMenu(false);
  };

  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;
    setDownloading((p) => ({ ...p, jpg: true }));
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `${userData.course.title} - Certificate.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    } catch (e) {
      alert('Failed to generate certificate. Please try again.');
      console.error(e);
    }
    setDownloading((p) => ({ ...p, jpg: false }));
    setShowDownloadMenu(false);
  };

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    setDownloading((p) => ({ ...p, png: true }));
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `${userData.course.title} - Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('Failed to generate certificate. Please try again.');
      console.error(e);
    }
    setDownloading((p) => ({ ...p, png: false }));
    setShowDownloadMenu(false);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `I just completed "${userData.course?.title}" with a grade of ${userData.grade}% and earned my certificate! 🎓`;
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent('My Course Certificate')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShareTooltip('Link copied!');
      setTimeout(() => setShareTooltip(''), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
    setShowShareMenu(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  if (loading) {
    return (
      <div className="certificate-loading">
        <div className="loading-spinner"></div>
        <p>Generating your certificate...</p>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      {/* ── Action Bar ─────────────────────────────────────────────────────── */}
      <div className="certificate-actions-bar">
        <button className="back-btn" onClick={() => navigate(`/dashboard/courses/${courseId}/learn`)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Course
        </button>

        <div className="action-group">
          {/* Undo/Reset buttons - only show if edits were made */}
          {editHistory.length > 0 && (
            <>
              <button 
                className="action-btn" 
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo last edit"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9L1 6L4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15H11C13.2091 15 15 13.2091 15 11C15 8.79086 13.2091 7 11 7H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Undo
              </button>
              
              <button 
                className="action-btn" 
                onClick={handleReset}
                title="Reset to original"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9C2 5.13401 5.13401 2 9 2C11.89 2 14.35 3.79 15.37 6.32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 9C16 12.866 12.866 16 9 16C6.11 16 3.65 14.21 2.63 11.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 3L16 6L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 15L2 12L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reset
              </button>
            </>
          )}

          {/* ── Download Dropdown (unchanged) ── */}
          <div className="action-dropdown">
            <button className="action-btn primary" onClick={handleDownloadPDF} disabled={downloading.pdf}>
              {downloading.pdf ? (
                <><span className="spinner"></span>Downloading...</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1V12M9 12L12 9M9 12L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 12V15C16 15.5304 15.7893 16.0391 15.4142 16.4142C15.0391 16.7893 14.5304 17 14 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Download
                </>
              )}
            </button>
            <button className="action-dropdown-toggle" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showDownloadMenu && (
              <div className="dropdown-menu">
                <button onClick={handleDownloadPDF} disabled={downloading.pdf}>
                  <div className="menu-icon pdf-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 4C4 2.89543 4.89543 2 6 2H12L16 6V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V4Z" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1.5"/>
                      <path d="M12 2L16 6H12V2Z" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">PDF Document</span>
                    <span className="menu-subtitle">Best for sharing & printing</span>
                  </div>
                  {downloading.pdf && <span className="menu-spinner"></span>}
                </button>

                <button onClick={handleDownloadJPG} disabled={downloading.jpg}>
                  <div className="menu-icon jpg-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="2" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeWidth="1.5"/>
                      <circle cx="7" cy="7" r="1.5" fill="#10B981"/>
                      <circle cx="13" cy="13" r="1.5" fill="#10B981"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">JPG Image</span>
                    <span className="menu-subtitle">Small file size, web optimized</span>
                  </div>
                  {downloading.jpg && <span className="menu-spinner"></span>}
                </button>

                <button onClick={handleDownloadPNG} disabled={downloading.png}>
                  <div className="menu-icon png-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="2" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1.5"/>
                      <path d="M5 13L8 10L11 13L15 8" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">PNG Image</span>
                    <span className="menu-subtitle">High quality, transparent</span>
                  </div>
                  {downloading.png && <span className="menu-spinner"></span>}
                </button>
              </div>
            )}
          </div>

          {/* ── Share Dropdown (unchanged) ── */}
          <div className="action-dropdown">
            <button className="action-btn" onClick={() => setShowShareMenu(!showShareMenu)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 10L12 13M12 5L6 8M15 4C15 5.65685 13.6569 7 12 7C10.3431 7 9 5.65685 9 4C9 2.34315 10.3431 1 12 1C13.6569 1 15 2.34315 15 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9C9 10.6569 7.65685 12 6 12C4.34315 12 3 10.6569 3 9C3 7.34315 4.34315 6 6 6C7.65685 6 9 7.34315 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 14C15 15.6569 13.6569 17 12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share
            </button>

            {showShareMenu && (
              <div className="dropdown-menu share-menu">
                <button onClick={() => handleShare('linkedin')}>
                  <div className="menu-icon linkedin">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 6H2V16H4V6Z" fill="#0A66C2"/>
                      <path d="M3 4C3.82843 4 4.5 3.32843 4.5 2.5C4.5 1.67157 3.82843 1 3 1C2.17157 1 1.5 1.67157 1.5 2.5C1.5 3.32843 2.17157 4 3 4Z" fill="#0A66C2"/>
                      <path d="M7 6H9V8C9.4 7 10.5 6 12 6C15 6 16 8 16 11V16H14V11C14 9 13 8 12 8C11 8 10 9 10 11V16H8V6H7Z" fill="#0A66C2"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">LinkedIn</span>
                    <span className="menu-subtitle">Share on professional network</span>
                  </div>
                </button>

                <button onClick={() => handleShare('twitter')}>
                  <div className="menu-icon twitter">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M17 2.5C16.3 2.9 15.6 3.1 14.8 3.2C15.6 2.7 16.2 2 16.5 1.1C15.8 1.6 15 1.9 14.1 2.1C13.4 1.4 12.4 1 11.4 1C9.3 1 7.7 2.9 8.1 5C5.4 4.9 3 3.5 1.5 1.5C0.9 2.5 1.2 3.8 2.2 4.5C1.6 4.5 1.1 4.3 0.6 4C0.6 5.5 1.7 6.8 3.2 7.1C2.7 7.2 2.2 7.3 1.7 7.2C2.1 8.5 3.4 9.5 4.9 9.5C3.7 10.6 1.9 11.3 0 11C1.5 12 3.3 12.5 5.2 12.5C11.5 12.5 15 7.5 14.8 3.1C15.6 2.6 16.3 2 17 2.5Z" fill="#1DA1F2"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">Twitter</span>
                    <span className="menu-subtitle">Share with your followers</span>
                  </div>
                </button>

                <button onClick={() => handleShare('facebook')}>
                  <div className="menu-icon facebook">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M13 1H11C9.67392 1 8.40215 1.52678 7.46447 2.46447C6.52678 3.40215 6 4.67392 6 6V8H4V11H6V17H9V11H11L12 8H9V6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5H12V1H13Z" fill="#4267B2"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">Facebook</span>
                    <span className="menu-subtitle">Share with friends & family</span>
                  </div>
                </button>

                <button onClick={() => handleShare('whatsapp')}>
                  <div className="menu-icon whatsapp">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1C4.6 1 1 4.6 1 9C1 10.5 1.4 12 2.2 13.3L1.5 16.5L4.8 15.8C6.1 16.5 7.5 16.9 9 16.9C13.4 16.9 17 13.3 17 8.9C17 4.6 13.4 1 9 1ZM9 15.5C7.7 15.5 6.5 15.1 5.4 14.5L5.1 14.3L3.2 14.7L3.6 12.9L3.4 12.6C2.8 11.5 2.4 10.3 2.4 9C2.4 5.4 5.4 2.4 9 2.4C12.6 2.4 15.6 5.4 15.6 9C15.6 12.6 12.6 15.5 9 15.5Z" fill="#25D366"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">WhatsApp</span>
                    <span className="menu-subtitle">Share on messaging</span>
                  </div>
                </button>

                <button onClick={() => handleShare('email')}>
                  <div className="menu-icon email">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 3H15C16.1 3 17 3.9 17 5V13C17 14.1 16.1 15 15 15H3C1.9 15 1 14.1 1 13V5C1 3.9 1.9 3 3 3Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5L9 10L1 5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">Email</span>
                    <span className="menu-subtitle">Send via email</span>
                  </div>
                </button>

                <button onClick={() => handleShare('copy')} className="copy-link-btn">
                  <div className="menu-icon copy">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M12 3H5C3.89543 3 3 3.89543 3 5V12" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                      <rect x="6" y="6" width="9" height="9" rx="1.5" stroke="#64748B" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">Copy Link</span>
                    <span className="menu-subtitle">Copy certificate URL</span>
                  </div>
                  {shareTooltip && <span className="tooltip">{shareTooltip}</span>}
                </button>
              </div>
            )}
          </div>

          {/* ── Edit Button ── */}
          <button className="action-btn" onClick={() => setShowEditModal(true)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13 2L16 5L6 15H3V12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 4L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>

          {/* ── Print Button ── */}
          <button className="action-btn" onClick={() => window.print()}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 12H3C2.46957 12 1.96086 11.7893 1.58579 11.4142C1.21071 11.0391 1 10.5304 1 10V7C1 5.89543 1.89543 5 3 5H15C16.1046 5 17 5.89543 17 7V10C17 11.1046 16.1046 12 15 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="5" y="11" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* ── Certificate Canvas ──────────────────────────────────────────────── */}
      <div className="certificate-container" ref={certificateRef}>
        <div className="certificate-border">
          <div className="certificate-corner top-left"></div>
          <div className="certificate-corner top-right"></div>
          <div className="certificate-corner bottom-left"></div>
          <div className="certificate-corner bottom-right"></div>

          <div className="certificate-content">
            {/* Header */}
            <div className="certificate-header">
              <div className="logo-section">
                <div className="logo-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5L5 15L20 25L35 15L20 5Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2"/>
                    <path d="M5 25L20 35L35 25" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="logo-text">
                  <span className="logo-main">CodeQuest</span>
                  <span className="logo-sub">Academy</span>
                </div>
              </div>
              <div className="certificate-title">
                <h1>CERTIFICATE</h1>
                <h2>OF COMPLETION</h2>
              </div>
            </div>

            {/* Body */}
            <div className="certificate-body">
              <p className="presented-text">This is presented to</p>

              <div className="recipient-name-wrapper">
                <span className="recipient-name">{userData.name}</span>
              </div>

              <p className="for-text">for successfully completing the course</p>

              <div className="course-title-wrapper">
                <h3 className="course-title">{userData.course?.title}</h3>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">INSTRUCTOR</span>
                  <span className="detail-value">{userData.course?.instructor}</span>
                  {userData.course?.instructorTitle && (
                    <span className="detail-subtitle">{userData.course.instructorTitle}</span>
                  )}
                </div>
                <div className="detail-item">
                  <span className="detail-label">DURATION</span>
                  <span className="detail-value">{userData.course?.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">GRADE</span>
                  <span className="detail-value">{userData.grade}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">DATE</span>
                  <span className="detail-value">{formatDate(userData.completionDate)}</span>
                </div>
              </div>

              <div className="certificate-footer">
                <div className="signature-section">
                  <div className="signature-line"></div>
                  <div className="signature-info">
                    <span className="signature-name">{userData.course?.instructor}</span>
                    <span className="signature-title">Instructor</span>
                  </div>
                </div>

                <div className="gold-seal">
                  <div className="seal-inner">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="28" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4"/>
                      <circle cx="30" cy="30" r="22" fill="#FBBF24" stroke="#B45309" strokeWidth="1"/>
                      <text x="30" y="36" textAnchor="middle" fill="#B45309" fontSize="24" fontWeight="bold">✓</text>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="certificate-id">
                <span className="id-label">Certificate ID:</span>
                <span className="id-value">{userData.certificateId}</span>
              </div>

              <div className="verification-text">
                Verify this certificate at codequest.dev/verify/{userData.certificateId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      {showEditModal && (
        <EditModal
          data={userData}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default CourseCertificate;