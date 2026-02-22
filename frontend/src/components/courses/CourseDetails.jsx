import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseCurriculum from './CourseCurriculum';
import CourseReviews from './CourseReviews';
import CourseInstructor from './CourseInstructor';
import CourseCertificate from './CourseCertificate';
import './CourseDetails.css';

// ─────────────────────────────────────────────────────────────────────────────
// ALL MODALS ARE DEFINED OUTSIDE CourseDetails.
// Previously they were nested inside — this caused React to treat them as
// brand-new component types on every render, unmounting/remounting them and
// losing focus / glitching on every keystroke. Moving them outside fixes that.
// ─────────────────────────────────────────────────────────────────────────────

const CertificateModal = ({ certificate, course, studentName, onClose, onDownload }) => {
  if (!certificate || !course) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <CourseCertificate
          certificate={certificate}
          courseName={course.title}
          studentName={studentName || 'Student Name'}
          issueDate={new Date().toLocaleDateString()}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
};

const ProgressModal = ({ progress, totalLessons, completedLessons, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <div style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>Your Progress</h2>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 120, height: 120, margin: '0 auto 1rem', position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#667eea" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${(progress / 100) * 283}, 283`} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{completedLessons}</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Completed</div></div>
            <div><div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>{totalLessons}</div><div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total</div></div>
          </div>
        </div>
        <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: '2rem', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  </div>
);

const BookmarksModal = ({ bookmarks, courseCurriculum, onClose, onLessonClick, onRemove }) => {
  const icons = { video: '🎥', quiz: '📝', assignment: '📋', article: '📄', discussion: '💬', code: '💻', exercise: '🏋️', project: '🚀' };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Your Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p style={{ color: '#64748b' }}>No bookmarks yet. Click the bookmark icon on any lesson to save it.</p>
          ) : (
            <div className="bookmarks-list">
              {bookmarks.map((bm, i) => {
                let section = '';
                for (const s of courseCurriculum) { if (s.lessons.some(l => l.id === bm.id)) { section = s.section; break; } }
                return (
                  <div key={i} className="bookmark-item">
                    <div className="bookmark-info">
                      <span className="bookmark-icon">{icons[bm.type] || '📌'}</span>
                      <div><h4>{bm.title}</h4><p className="bookmark-meta">{section} • {bm.duration} min • {bm.type}</p></div>
                    </div>
                    <div className="bookmark-actions">
                      <button className="bookmark-action-btn" onClick={() => { onLessonClick(bm.id, bm.type); onClose(); }}>▶️ Resume</button>
                      <button className="bookmark-action-btn remove" onClick={() => onRemove(bm)}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// EnrollmentModal receives all controlled-input values and handlers as props.
// Because this component is defined at module scope (not inside CourseDetails),
// React reuses the same component instance across renders — no remount, no glitch.
const EnrollmentModal = ({
  course, enrollmentStep, enrollmentSuccess, isStepValid,
  localFullName, onFullNameChange,
  localEmail, onEmailChange,
  localPhone, onPhoneChange,
  localCountry, onCountryChange,
  localAgreeToTerms, onTermsChange,
  localPaymentMethod, onPaymentMethodChange,
  localCardNumber, onCardNumberChange,
  localCardName, onCardNameChange,
  localCardExpiry, onCardExpiryChange,
  localCardCvc, onCardCvcChange,
  onClose, onBack, onContinue, onSubmit, onStartLearning,
}) => {
  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="enrollment-modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {/* Gradient header */}
        <div className="enrollment-modal-header">
          <h2 className="enrollment-modal-title">Complete Your Enrollment</h2>
          <p className="enrollment-modal-subtitle">You're just a few steps away from starting your learning journey</p>
        </div>

        {/* Step progress */}
        <div className="enrollment-progress">
          <div className="enrollment-progress-steps">
            {[1, 2, 3].map(step => (
              <div key={step} className="enrollment-progress-step">
                <div className={`enrollment-progress-dot ${enrollmentStep >= step ? 'active' : ''}`}>
                  {step === 3 && enrollmentSuccess ? '✓' : step}
                </div>
                <div className={`enrollment-progress-label ${enrollmentStep >= step ? 'active' : ''}`}>
                  {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Confirmation'}
                </div>
                {step < 3 && <div className={`enrollment-progress-line ${enrollmentStep > step ? 'active' : ''}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="enrollment-modal-content">
          {enrollmentSuccess ? (
            /* ── Success ── */
            <div className="enrollment-success">
              <div className="success-animation">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="check-line check-tip" />
                    <span className="check-line check-long" />
                  </div>
                </div>
              </div>
              <h3 className="success-title">Enrollment Successful!</h3>
              <p className="success-message">You've successfully enrolled in <strong>{course.title}</strong></p>
              <div className="success-details-card">
                <div className="success-detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Amount Paid:</span>
                  <span className="detail-value price">${course.discountedPrice || course.price}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Access:</span>
                  <span className="detail-value lifetime">Full Lifetime Access</span>
                </div>
              </div>
              <div className="success-actions">
                <button onClick={onClose} className="success-btn-secondary">Close</button>
                <button onClick={onStartLearning} className="success-btn-primary">Start Learning Now →</button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Step 1: User Details ── */}
              {enrollmentStep === 1 && (
                <div className="enrollment-step">
                  <h3 className="step-heading">Your Information</h3>
                  <p className="step-description">Please provide your details to complete enrollment</p>
                  <div className="enrollment-form">

                    <div className="form-field">
                      <label className="form-label">Full Name <span className="required-star">*</span></label>
                      <input
                        type="text"
                        value={localFullName}
                        onChange={onFullNameChange}
                        placeholder="John Doe"
                        className="form-input"
                        autoComplete="name"
                      />
                      <span className="input-hint">Enter your full legal name</span>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Email Address <span className="required-star">*</span></label>
                      <input
                        type="email"
                        value={localEmail}
                        onChange={onEmailChange}
                        placeholder="john@example.com"
                        className="form-input"
                        autoComplete="email"
                      />
                      <span className="input-hint">We'll send your course access to this email</span>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        value={localPhone}
                        onChange={onPhoneChange}
                        placeholder="+1 234 567 8900"
                        className="form-input"
                        autoComplete="tel"
                      />
                      <span className="input-hint">For important updates about your course</span>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Country</label>
                      <div className="select-wrapper">
                        <select value={localCountry} onChange={onCountryChange} className="form-select">
                          <option value="">Select your country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="BR">Brazil</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="terms-container">
                      <label className="terms-checkbox-label">
                        <input type="checkbox" checked={localAgreeToTerms} onChange={onTermsChange} className="terms-checkbox-input" />
                        <span className="checkbox-custom" />
                        <span className="terms-text">
                          I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Payment ── */}
              {enrollmentStep === 2 && (
                <div className="enrollment-step">
                  <h3 className="step-heading">Payment Details</h3>
                  <p className="step-description">Choose your preferred payment method</p>

                  <div className="course-summary-card">
                    <div className="course-summary-info">
                      <h4 className="course-summary-title">{course.title}</h4>
                      <p className="course-summary-instructor">by {course.instructor.name}</p>
                    </div>
                    <div className="course-summary-price">
                      <span className="current-price">${course.discountedPrice || course.price}</span>
                      {course.discountedPrice && <span className="original-price">${course.price}</span>}
                    </div>
                  </div>

                  <div className="payment-methods-grid">
                    {[['card', '💳', 'Credit / Debit Card'], ['paypal', '🅿️', 'PayPal'], ['apple-pay', '🍎', 'Apple Pay']].map(([m, icon, label]) => (
                      <button key={m} onClick={() => onPaymentMethodChange(m)} className={`payment-method-card ${localPaymentMethod === m ? 'active' : ''}`}>
                        <span className="payment-method-icon">{icon}</span>
                        <span className="payment-method-name">{label}</span>
                      </button>
                    ))}
                  </div>

                  {localPaymentMethod === 'card' && (
                    <div className="card-details-form">
                      <div className="form-field">
                        <label className="form-label">Card Number <span className="required-star">*</span></label>
                        <input type="text" value={localCardNumber} onChange={onCardNumberChange} placeholder="1234 5678 9012 3456" maxLength="19" className="form-input card-input" autoComplete="cc-number" />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Cardholder Name <span className="required-star">*</span></label>
                        <input type="text" value={localCardName} onChange={onCardNameChange} placeholder="John Doe" className="form-input" autoComplete="cc-name" />
                      </div>
                      <div className="form-row-two">
                        <div className="form-field">
                          <label className="form-label">Expiry Date <span className="required-star">*</span></label>
                          <input type="text" value={localCardExpiry} onChange={onCardExpiryChange} placeholder="MM/YY" maxLength="5" className="form-input" autoComplete="cc-exp" />
                        </div>
                        <div className="form-field">
                          <label className="form-label">CVC <span className="required-star">*</span></label>
                          <input type="text" value={localCardCvc} onChange={onCardCvcChange} placeholder="123" maxLength="3" className="form-input" autoComplete="cc-csc" />
                        </div>
                      </div>
                      <div className="secure-payment-badge">
                        <span className="lock-icon">🔒</span>
                        <span className="secure-text">Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  )}

                  <div className="order-summary">
                    <h4 className="order-summary-title">Order Summary</h4>
                    <div className="order-summary-row"><span>Course Price</span><span>${course.price}</span></div>
                    {course.discountedPrice && (
                      <div className="order-summary-row discount"><span>Discount</span><span>-${(course.price - course.discountedPrice).toFixed(2)}</span></div>
                    )}
                    <div className="order-summary-divider" />
                    <div className="order-summary-total"><span>Total</span><span className="total-amount">${course.discountedPrice || course.price}</span></div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Processing ── */}
              {enrollmentStep === 3 && (
                <div className="processing-container">
                  <div className="processing-spinner" />
                  <h3 className="processing-title">Processing Your Enrollment</h3>
                  <p className="processing-text">Please wait while we secure your spot in the course...</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!enrollmentSuccess && enrollmentStep < 3 && (
          <div className="enrollment-modal-footer">
            <button onClick={enrollmentStep === 1 ? onClose : onBack} className="footer-btn secondary">
              {enrollmentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={enrollmentStep === 2 ? onSubmit : onContinue}
              disabled={!isStepValid}
              className={`footer-btn primary ${!isStepValid ? 'disabled' : ''}`}
            >
              {enrollmentStep === 2 ? 'Complete Enrollment' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // UI state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // Course state
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [expandedSections, setExpandedSections] = useState({ about: true, whatYoullLearn: true, prerequisites: false, includes: true, certificate: true });
  const [certificateData, setCertificateData] = useState(null);

  // Enrollment form state (lives in parent, passed as props so modal stays stable)
  const [localFullName, setLocalFullName] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [localCountry, setLocalCountry] = useState('');
  const [localAgreeToTerms, setLocalAgreeToTerms] = useState(false);
  const [localPaymentMethod, setLocalPaymentMethod] = useState('card');
  const [localCardNumber, setLocalCardNumber] = useState('');
  const [localCardName, setLocalCardName] = useState('');
  const [localCardExpiry, setLocalCardExpiry] = useState('');
  const [localCardCvc, setLocalCardCvc] = useState('');

  // ── Static data ────────────────────────────────────────────────────────────
  const instructor = {
    id: 101, name: 'Dr. Sarah Johnson', title: 'Senior Software Architect & Educator',
    avatar: '👩‍🏫', rating: 4.9, students: 45000, courses: 12,
    bio: 'Dr. Sarah Johnson is a Senior Software Architect with over 15 years of experience in building scalable systems at top tech companies including Google, Amazon, and Microsoft. She holds a Ph.D. in Computer Science from Stanford University and has taught over 45,000 students worldwide. Her expertise spans system design, machine learning, and technical interview preparation.',
    expertise: ['System Architecture', 'Machine Learning', 'Cloud Computing', 'Technical Interviews', 'Distributed Systems', 'Microservices'],
    education: ['Ph.D. in Computer Science, Stanford University', 'M.S. in Computer Science, MIT', 'B.S. Computer Science, Stanford University'],
    experience: [{ company: 'Google', role: 'Senior Software Architect', duration: '2018-present', description: 'Leading the design and implementation of scalable systems' }, { company: 'Amazon', role: 'Principal Engineer', duration: '2014-2018', description: 'Architected AWS services handling millions of requests' }],
    achievements: ['Published 15+ research papers', 'Keynote speaker at 20+ conferences', 'Author of "System Design Patterns"'],
    social: { linkedin: 'https://linkedin.com/in/sarahjohnson', twitter: 'https://twitter.com/sarahjohnson', github: 'https://github.com/sarahjohnson' }
  };

  const reviews = [
    { id: 1, user: { name: 'Michael Chen', avatar: '👨‍💻', level: 'Senior Developer' }, rating: 5, date: '2024-02-15', title: "Best system design course I've ever taken", content: 'This course completely transformed my understanding of system design. Dr. Johnson explains complex concepts in a way that\'s easy to understand.', helpful: 234, notHelpful: 12, verified: true, replies: [{ user: 'Dr. Sarah Johnson', avatar: '👩‍🏫', content: "Thank you Michael! I'm glad you found the course helpful.", date: '2024-02-16' }] },
    { id: 2, user: { name: 'Priya Patel', avatar: '👩‍💻', level: 'Tech Lead' }, rating: 5, date: '2024-02-10', title: 'Excellent preparation for system design interviews', content: 'I used this course to prepare for my senior engineer interviews at FAANG. Landed an offer at Google!', helpful: 189, notHelpful: 5, verified: true, replies: [] },
    { id: 3, user: { name: 'James Wilson', avatar: '👨‍🔧', level: 'Software Engineer' }, rating: 4, date: '2024-02-05', title: 'Great content, slightly advanced for beginners', content: "The course is excellent but moves fast. I'd recommend having some basic system design knowledge before starting.", helpful: 67, notHelpful: 8, verified: true, replies: [] }
  ];

  const certificateTemplate = {
    id: 'CERT-2024-001', issueDate: '2024-02-18', expiryDate: 'Lifetime',
    accreditedBy: 'International Association of Software Architects',
    skills: ['System Architecture', 'Microservices Design', 'Scalability Planning', 'Performance Optimization', 'Distributed Systems', 'Cloud Architecture'],
    verificationUrl: 'https://verify.education/cert/2024-001'
  };

  const courseCurriculum = [
    { section: 'Introduction to System Design', lessons: [{ id: 'l1', title: 'What is System Design?', type: 'video', duration: '15', free: true, difficulty: 'beginner' }, { id: 'l2', title: 'Key Principles of Scalable Systems', type: 'video', duration: '20', difficulty: 'beginner' }, { id: 'l3', title: 'Understanding Requirements', type: 'article', duration: '10', difficulty: 'beginner' }, { id: 'l4', title: 'Quiz: System Design Basics', type: 'quiz', duration: '15', difficulty: 'beginner' }] },
    { section: 'Load Balancing & Caching', lessons: [{ id: 'l5', title: 'Load Balancing Algorithms', type: 'video', duration: '25', difficulty: 'intermediate' }, { id: 'l6', title: 'Implementing Round Robin', type: 'code', duration: '30', difficulty: 'intermediate' }, { id: 'l7', title: 'Caching Strategies', type: 'video', duration: '20', difficulty: 'intermediate' }, { id: 'l8', title: 'Redis Implementation', type: 'assignment', duration: '45', difficulty: 'intermediate' }, { id: 'l9', title: 'Cache Invalidation Patterns', type: 'article', duration: '15', difficulty: 'intermediate' }] },
    { section: 'Database Design', lessons: [{ id: 'l10', title: 'SQL vs NoSQL', type: 'video', duration: '18', difficulty: 'intermediate' }, { id: 'l11', title: 'Database Sharding', type: 'video', duration: '22', difficulty: 'advanced' }, { id: 'l12', title: 'Replication Strategies', type: 'article', duration: '12', difficulty: 'advanced' }, { id: 'l13', title: 'CAP Theorem Explained', type: 'video', duration: '15', difficulty: 'advanced' }, { id: 'l14', title: 'Database Design Exercise', type: 'exercise', duration: '35', difficulty: 'advanced' }] },
    { section: 'Microservices Architecture', lessons: [{ id: 'l15', title: 'Monolith vs Microservices', type: 'video', duration: '20', difficulty: 'intermediate' }, { id: 'l16', title: 'Service Discovery', type: 'video', duration: '18', difficulty: 'advanced' }, { id: 'l17', title: 'API Gateway Pattern', type: 'article', duration: '12', difficulty: 'advanced' }, { id: 'l18', title: 'Inter-Service Communication', type: 'discussion', duration: '25', difficulty: 'advanced' }, { id: 'l19', title: 'Microservices Project', type: 'project', duration: '60', difficulty: 'advanced' }] },
    { section: 'Real-world Case Studies', lessons: [{ id: 'l20', title: 'Netflix Architecture', type: 'video', duration: '30', difficulty: 'advanced' }, { id: 'l21', title: 'Uber Design', type: 'video', duration: '25', difficulty: 'advanced' }, { id: 'l22', title: 'Twitter Timeline', type: 'article', duration: '15', difficulty: 'advanced' }, { id: 'l23', title: 'Final Assessment', type: 'quiz', duration: '45', difficulty: 'advanced' }] }
  ];

  const courseDetails = {
    id: 1, title: 'Coding Interview Prep',
    description: 'Ace your technical interviews with comprehensive coverage of algorithms, data structures, and problem-solving techniques. Includes mock interviews.',
    longDescription: "This comprehensive course is designed to help you master technical interviews at top tech companies. You'll learn essential algorithms, data structures, and problem-solving strategies through hands-on practice and mock interviews.",
    category: 'Interview Prep', level: 'All Levels', duration: '8 weeks', lessons: 36,
    students: 15600, rating: 4.9, reviews, instructor, price: 69.99, discountedPrice: 59.99, isFree: false,
    learningOutcomes: [
      { title: 'Master 150+ LeetCode problems', description: 'Solve real interview questions from top companies', icon: '💡' },
      { title: 'Understand complex algorithms', description: 'Deep dive into sorting, searching, dynamic programming', icon: '🔍' },
      { title: 'Practice mock interviews', description: 'Simulate real interview conditions with peers', icon: '🎯' },
      { title: 'Optimize solutions', description: 'Learn time and space complexity analysis', icon: '⚡' },
      { title: 'System design basics', description: 'Understand architecture and scalability', icon: '🏗️' }
    ],
    includes: [{ icon: '∞', text: 'Full lifetime access' }, { icon: '🎓', text: 'Certificate of completion' }, { icon: '📝', text: 'Interview cheat sheets' }, { icon: '🎥', text: 'Mock interview sessions' }, { icon: '📄', text: 'Resume review' }, { icon: '💬', text: '1-on-1 mentoring' }, { icon: '📱', text: 'Mobile access' }, { icon: '👥', text: 'Community access' }],
    prerequisites: ['Basic programming knowledge in any language', 'Familiarity with at least one programming language', 'Understanding of basic data structures', 'Willingness to practice consistently'],
    certificate: { title: 'Verified Certificate', description: 'Earn a verified certificate upon completion', features: ['Shareable on LinkedIn', 'Includes 6 industry-recognized skills', 'Verified by International Association', 'Lifetime access'], sample: certificateTemplate },
    tags: ['Bestseller', 'Interview Prep', 'Algorithms'], lastUpdated: '2024-01-20', language: 'English', quizzes: 15, assignments: 2, projects: 2
  };

  const allCourses = [
    courseDetails,
    { id: 2, title: 'Advanced System Design', students: 12500, rating: 4.9, price: 89.99, discountedPrice: 79.99, duration: '12 weeks', lessons: 48, level: 'Advanced', category: 'System Design', instructor, description: 'Master advanced system design concepts, scalability, and architecture patterns used by top tech companies.', learningOutcomes: [{ title: 'Design scalable systems', description: 'Handle millions of users', icon: '📊' }, { title: 'Master load balancing', description: 'Distribute traffic efficiently', icon: '⚖️' }], includes: [{ icon: '∞', text: 'Full lifetime access' }, { icon: '🎓', text: 'Certificate of completion' }], prerequisites: ['Basic system design knowledge', 'Programming experience'], certificate: { title: 'Verified Certificate', description: 'Earn a verified certificate', features: ['Shareable', 'Industry recognized'], sample: certificateTemplate }, tags: ['Bestseller', 'Advanced'], lastUpdated: '2024-02-01', language: 'English', quizzes: 12, assignments: 4, projects: 4 },
    { id: 3, title: 'Machine Learning Fundamentals', students: 8900, rating: 4.8, price: 79.99, discountedPrice: 69.99, duration: '10 weeks', lessons: 42, level: 'Intermediate', category: 'Machine Learning', instructor: { ...instructor, name: 'Dr. Emily Rodriguez', title: 'Data Science Lead', avatar: '👩‍🔬' }, description: 'Comprehensive introduction to machine learning algorithms and practical implementations with Python.', learningOutcomes: [{ title: 'Build neural networks', description: 'From scratch with Python', icon: '🧠' }, { title: 'Master ML algorithms', description: 'Regression, classification, clustering', icon: '📈' }], includes: [{ icon: '∞', text: 'Full lifetime access' }, { icon: '🎓', text: 'Certificate of completion' }, { icon: '🐍', text: 'Python code files' }], prerequisites: ['Python programming', 'Basic statistics'], certificate: { title: 'Verified Certificate', description: 'Earn a verified certificate', features: ['Shareable', 'Data Science certified'], sample: certificateTemplate }, tags: ['Popular', 'Python'], lastUpdated: '2024-01-15', language: 'English', quizzes: 10, assignments: 3, projects: 3 }
  ];

  useEffect(() => {
    setTimeout(() => {
      const foundCourse = allCourses.find(c => c.id === parseInt(courseId)) || allCourses[0];
      setCourse(foundCourse);
      setCertificateData({ ...certificateTemplate, courseName: foundCourse.title, studentName: 'Student Name', completionDate: new Date().toISOString().split('T')[0], skills: foundCourse.learningOutcomes.map(o => o.title) });
      setRecommendedCourses(allCourses.filter(c => c.id !== parseInt(courseId)).sort(() => 0.5 - Math.random()).slice(0, 3));
      setLoading(false);
      const myLearning = JSON.parse(localStorage.getItem('myLearning') || '[]');
      setIsEnrolled(myLearning.some(c => c.id === parseInt(courseId)));
      const wishlist = JSON.parse(localStorage.getItem('courseWishlist') || '[]');
      setInWishlist(wishlist.some(c => c.id === parseInt(courseId)));
      const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
      if (savedProgress) { const completed = JSON.parse(savedProgress).length; const total = courseCurriculum.flatMap(s => s.lessons).length; setCourseProgress((completed / total) * 100); }
      const savedBookmarks = localStorage.getItem(`course_${courseId}_bookmarks`);
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    }, 1000);
  }, [courseId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleSection = section => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const formatCardNumber = value => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) parts.push(v.substring(i, i + 4));
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = value => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
  };

  const isStepValid = () => {
    if (enrollmentStep === 1) return localFullName && localEmail && localEmail.includes('@') && localAgreeToTerms;
    if (enrollmentStep === 2) { if (localPaymentMethod === 'card') return localCardNumber.replace(/\s/g, '').length === 16 && localCardName && localCardExpiry.length === 5 && localCardCvc.length === 3; return true; }
    return true;
  };

  const handleEnrollNow = c => {
    setSelectedCourse(c);
    setLocalFullName(''); setLocalEmail(''); setLocalPhone(''); setLocalCountry('');
    setLocalAgreeToTerms(false); setLocalPaymentMethod('card');
    setLocalCardNumber(''); setLocalCardName(''); setLocalCardExpiry(''); setLocalCardCvc('');
    setEnrollmentStep(1); setEnrollmentSuccess(false);
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSubmit = () => {
    setEnrollmentStep(3);
    setTimeout(() => {
      setEnrollmentSuccess(true);
      const myLearning = JSON.parse(localStorage.getItem('myLearning') || '[]');
      myLearning.push({ ...selectedCourse, progress: 0, enrolledDate: new Date().toISOString(), enrollmentData: { fullName: localFullName, email: localEmail, phone: localPhone, country: localCountry, enrolledAt: new Date().toISOString() } });
      localStorage.setItem('myLearning', JSON.stringify(myLearning));
      setIsEnrolled(true);
    }, 2000);
  };

  const handleProgressUpdate = progress => {
    setCourseProgress(progress);
    const myLearning = JSON.parse(localStorage.getItem('myLearning') || '[]');
    localStorage.setItem('myLearning', JSON.stringify(myLearning.map(c => c.id === course.id ? { ...c, progress } : c)));
  };

  const handleLessonClick = (lessonId, type) => {
    const routes = { video: `/dashboard/courses/${courseId}/lessons/${lessonId}`, quiz: `/dashboard/courses/${courseId}/quiz/${lessonId}`, assignment: `/dashboard/courses/${courseId}/assignment/${lessonId}`, article: `/dashboard/courses/${courseId}/article/${lessonId}`, discussion: `/dashboard/courses/${courseId}/discussion/${lessonId}`, code: `/dashboard/courses/${courseId}/code/${lessonId}`, exercise: `/dashboard/courses/${courseId}/exercise/${lessonId}`, project: `/dashboard/courses/${courseId}/project/${lessonId}` };
    navigate(routes[type] || `/dashboard/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleToggleBookmark = bookmark => {
    const updated = bookmarks.filter(b => b.id !== bookmark.id);
    setBookmarks(updated);
    localStorage.setItem(`course_${courseId}_bookmarks`, JSON.stringify(updated));
  };

  const closeModal = () => {
    setShowCourseModal(false); setShowInstructorModal(false); setShowEnrollmentModal(false);
    setShowCertificateModal(false); setShowProgressModal(false);
    setEnrollmentStep(1); setEnrollmentSuccess(false); setSelectedCourse(null);
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('courseWishlist') || '[]');
    if (inWishlist) { localStorage.setItem('courseWishlist', JSON.stringify(wishlist.filter(c => c.id !== course.id))); setInWishlist(false); }
    else { wishlist.push(course); localStorage.setItem('courseWishlist', JSON.stringify(wishlist)); setInWishlist(true); }
  };

  const handleShare = platform => {
    const url = window.location.href;
    const text = `Check out this course: ${course?.title}`;
    const shareUrls = { twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}` };
    if (platform === 'copy') { navigator.clipboard.writeText(url); alert('Link copied to clipboard!'); }
    else window.open(shareUrls[platform], '_blank');
    setShowShareModal(false);
  };

  const handleViewCertificate = () => setShowCertificateModal(true);

  const handleGenerateCertificate = () => {
    setCertificateData({ ...certificateTemplate, courseName: course.title, studentName: localFullName || 'Student Name', completionDate: new Date().toISOString().split('T')[0], skills: course.learningOutcomes.map(o => o.title), certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}` });
    setShowCertificateModal(true);
  };

  const handleDownloadCertificate = () => alert('Certificate download started!');

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading course details...</p>
    </div>
  );

  if (!course) return (
    <div className="not-found">
      <h2>Course not found</h2>
      <button onClick={() => navigate('/courses')} className="back-button">Back to Courses</button>
    </div>
  );

  const totalLessons = courseCurriculum.flatMap(s => s.lessons).length;
  const completedLessons = JSON.parse(localStorage.getItem(`course_${courseId}_progress`) || '[]').length;

  return (
    <div className="course-details-container">
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="success-toast" onClick={() => setShowSuccessMessage(false)}>
          <div className="success-toast-icon">✅</div>
          <div className="success-toast-content">
            <h4 className="success-toast-title">Successfully enrolled!</h4>
            <p className="success-toast-text">You are now enrolled in <strong>{course?.title}</strong></p>
          </div>
          <button className="success-toast-close" onClick={() => setShowSuccessMessage(false)}>×</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigate('/courses')}>Courses</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-link" onClick={() => navigate(`/courses?category=${course.category}`)}>{course.category}</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{course.title}</span>
          </div>
          <h1 className="hero-title">{course.title}</h1>
          <p className="hero-description">{course.description}</p>
          <div className="hero-meta">
            <div className="hero-meta-item"><span className="hero-meta-label">Rating</span><span className="hero-meta-value">⭐ {course.rating} ({course.reviews?.length || 0} reviews)</span></div>
            <div className="hero-meta-item"><span className="hero-meta-label">Students</span><span className="hero-meta-value">👥 {course.students.toLocaleString()}</span></div>
            <div className="hero-meta-item"><span className="hero-meta-label">Duration</span><span className="hero-meta-value">⏱️ {course.duration}</span></div>
            <div className="hero-meta-item"><span className="hero-meta-label">Level</span><span className="hero-meta-value">{course.level}</span></div>
            <div className="hero-meta-item"><span className="hero-meta-label">Instructor</span><span className="hero-meta-value clickable" onClick={() => setShowInstructorModal(true)}>{course.instructor.name}</span></div>
          </div>
          <div className="hero-actions">
            <div className="hero-price">
              {course.isFree ? <span className="free-price-large">Free</span> : (<><span className="price-large">${course.discountedPrice || course.price}</span>{course.discountedPrice && <span className="original-price-large">${course.price}</span>}</>)}
            </div>
            {isEnrolled ? (
              <>
                <button className="enrolled-btn-large" disabled>✓ Enrolled</button>
                <button className="progress-btn" onClick={() => setShowProgressModal(true)}>📊 Progress ({Math.round(courseProgress)}%)</button>
                <button className="bookmarks-btn" onClick={() => setShowBookmarksModal(true)}>🔖 Bookmarks ({bookmarks.length})</button>
              </>
            ) : (
              <button className="enroll-btn-large" onClick={() => handleEnrollNow(course)}>Enroll Now</button>
            )}
            <button className={`wishlist-btn-large ${inWishlist ? 'active' : ''}`} onClick={handleAddToWishlist}>{inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}</button>
            <button className="share-btn-large" onClick={() => setShowShareModal(true)}>📤 Share</button>
          </div>
          <div className="hero-badges">{course.tags?.map(tag => <span key={tag} className="course-badge">{tag}</span>)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {['overview', 'curriculum', 'instructor', 'reviews', 'certificate', 'recommendations'].map(tab => (
          <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'reviews' ? `Reviews (${course.reviews?.length || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="overview-main">
              <section className="overview-section">
                <div className="section-header-clickable" onClick={() => toggleSection('about')}>
                  <h2 className="overview-title"><span>📚 About This Course</span><span className="expand-icon">{expandedSections.about ? '▼' : '▶'}</span></h2>
                </div>
                {expandedSections.about && (
                  <div className="section-content">
                    <p className="overview-text">{course.longDescription || course.description}</p>
                    <div className="course-stats-grid">
                      {[{ icon: '⏱️', value: course.duration, label: 'Duration' }, { icon: '📚', value: `${course.lessons} lessons`, label: 'Content' }, { icon: '📝', value: `${course.quizzes} quizzes`, label: 'Assessments' }, { icon: '🚀', value: `${course.projects} projects`, label: 'Hands-on' }].map(s => (
                        <div key={s.label} className="stat-card"><span className="stat-icon">{s.icon}</span><div className="stat-info"><span className="stat-value">{s.value}</span><span className="stat-label">{s.label}</span></div></div>
                      ))}
                    </div>
                    <div className="course-metadata">
                      <span className="metadata-item"><span className="metadata-icon">📅</span>Last updated: {new Date(course.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      <span className="metadata-item"><span className="metadata-icon">🌐</span>Language: {course.language}</span>
                    </div>
                  </div>
                )}
              </section>

              <section className="overview-section">
                <div className="section-header-clickable" onClick={() => toggleSection('whatYoullLearn')}>
                  <h2 className="overview-title"><span>🎯 What You'll Learn</span><span className="expand-icon">{expandedSections.whatYoullLearn ? '▼' : '▶'}</span></h2>
                </div>
                {expandedSections.whatYoullLearn && (
                  <div className="section-content">
                    <div className="learning-outcomes-grid-enhanced">
                      {course.learningOutcomes.map((outcome, i) => (
                        <div key={i} className="outcome-card">
                          <div className="outcome-icon-wrapper"><span className="outcome-icon-large">{outcome.icon}</span></div>
                          <div className="outcome-content"><h3 className="outcome-title">{outcome.title}</h3><p className="outcome-description">{outcome.description}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="overview-section">
                <div className="section-header-clickable" onClick={() => toggleSection('prerequisites')}>
                  <h2 className="overview-title"><span>📋 Prerequisites</span><span className="expand-icon">{expandedSections.prerequisites ? '▼' : '▶'}</span></h2>
                </div>
                {expandedSections.prerequisites && (
                  <div className="section-content">
                    <ul className="prereq-list-enhanced">
                      {course.prerequisites.map((prereq, i) => (
                        <li key={i} className="prereq-item-enhanced"><span className="prereq-bullet">✓</span><span className="prereq-text">{prereq}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>

            <div className="overview-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-header-clickable" onClick={() => toggleSection('includes')}>
                  <h3 className="sidebar-title"><span>📦 This Course Includes</span><span className="expand-icon">{expandedSections.includes ? '▼' : '▶'}</span></h3>
                </div>
                {expandedSections.includes && (
                  <div className="sidebar-content">
                    <ul className="includes-list-enhanced">
                      {course.includes.map((item, i) => (
                        <li key={i} className="includes-item-enhanced"><span className="includes-icon">{item.icon}</span><span className="includes-text">{item.text}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="sidebar-card certificate-card">
                <div className="sidebar-header-clickable" onClick={() => toggleSection('certificate')}>
                  <h3 className="sidebar-title"><span>🏆 Certificate</span><span className="expand-icon">{expandedSections.certificate ? '▼' : '▶'}</span></h3>
                </div>
                {expandedSections.certificate && (
                  <div className="sidebar-content">
                    <p className="certificate-description">{course.certificate.description}</p>
                    <div className="certificate-features">
                      {course.certificate.features.map((feature, i) => (
                        <div key={i} className="certificate-feature-item"><span className="feature-check">✓</span><span className="feature-text">{feature}</span></div>
                      ))}
                    </div>
                    <button onClick={handleViewCertificate} className="certificate-button"><span className="button-icon">🔍</span>View Certificate Sample</button>
                    <div className="certificate-preview-mini">
                      <div className="preview-seal">🏛️</div>
                      <div className="preview-text"><strong>{course.title}</strong><span>Certificate of Completion</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sidebar-card stats-mini-card">
                <div className="stats-mini-grid">
                  {[{ value: course.rating, label: 'Rating' }, { value: course.students.toLocaleString(), label: 'Students' }, { value: course.level, label: 'Level' }].map(s => (
                    <div key={s.label} className="stats-mini-item"><span className="stats-mini-value">{s.value}</span><span className="stats-mini-label">{s.label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <CourseCurriculum curriculum={courseCurriculum} courseId={courseId} isEnrolled={isEnrolled} onProgressUpdate={handleProgressUpdate} />
        )}
        {activeTab === 'instructor' && <CourseInstructor instructor={course.instructor} />}
        {activeTab === 'reviews' && <CourseReviews reviews={course.reviews} courseId={courseId} />}
        {activeTab === 'certificate' && (
          <div className="certificate-container">
            <CourseCertificate certificate={certificateData || certificateTemplate} courseName={course.title} studentName={localFullName || 'Your Name'} issueDate={new Date().toLocaleDateString()} onGenerate={handleGenerateCertificate} onDownload={handleDownloadCertificate} isSample={true} />
          </div>
        )}
        {activeTab === 'recommendations' && (
          <div className="recommendations-container">
            <h2 className="recommendations-title">You Might Also Like</h2>
            <div className="recommendations-grid">
              {recommendedCourses.map(recCourse => (
                <div key={recCourse.id} className="recommendation-card" onClick={() => navigate(`/courses/${recCourse.id}`)}>
                  <div className="recommendation-badge">{recCourse.tags[0]}</div>
                  <h3 className="recommendation-title">{recCourse.title}</h3>
                  <div className="recommendation-meta"><span>⭐ {recCourse.rating}</span><span>👥 {recCourse.students.toLocaleString()}</span></div>
                  <div className="recommendation-price">
                    <span className="rec-price">${recCourse.discountedPrice || recCourse.price}</span>
                    {recCourse.discountedPrice && <span className="rec-original-price">${recCourse.price}</span>}
                  </div>
                  <p className="recommendation-instructor">by {recCourse.instructor.name}</p>
                  <button className="view-details-button">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showCourseModal && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-content"><h2>{selectedCourse.title}</h2><p>{selectedCourse.description}</p></div>
          </div>
        </div>
      )}

      {showInstructorModal && <CourseInstructor instructor={instructor} onClose={closeModal} />}

      {/* EnrollmentModal: defined at module scope — no remount, no glitch */}
      {showEnrollmentModal && (
        <EnrollmentModal
          course={selectedCourse || course}
          enrollmentStep={enrollmentStep}
          enrollmentSuccess={enrollmentSuccess}
          isStepValid={isStepValid()}
          localFullName={localFullName}          onFullNameChange={e => setLocalFullName(e.target.value)}
          localEmail={localEmail}                onEmailChange={e => setLocalEmail(e.target.value)}
          localPhone={localPhone}                onPhoneChange={e => setLocalPhone(e.target.value)}
          localCountry={localCountry}            onCountryChange={e => setLocalCountry(e.target.value)}
          localAgreeToTerms={localAgreeToTerms}  onTermsChange={e => setLocalAgreeToTerms(e.target.checked)}
          localPaymentMethod={localPaymentMethod} onPaymentMethodChange={setLocalPaymentMethod}
          localCardNumber={localCardNumber}      onCardNumberChange={e => setLocalCardNumber(formatCardNumber(e.target.value))}
          localCardName={localCardName}          onCardNameChange={e => setLocalCardName(e.target.value)}
          localCardExpiry={localCardExpiry}      onCardExpiryChange={e => setLocalCardExpiry(formatExpiry(e.target.value))}
          localCardCvc={localCardCvc}            onCardCvcChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 3) setLocalCardCvc(v); }}
          onClose={closeModal}
          onBack={() => setEnrollmentStep(s => s - 1)}
          onContinue={() => setEnrollmentStep(s => s + 1)}
          onSubmit={handleEnrollmentSubmit}
          onStartLearning={() => { closeModal(); setActiveTab('curriculum'); }}
        />
      )}

      {showCertificateModal && (
        <CertificateModal certificate={certificateData || certificateTemplate} course={course} studentName={localFullName || 'Student Name'} onClose={closeModal} onDownload={handleDownloadCertificate} />
      )}

      {showProgressModal && (
        <ProgressModal progress={courseProgress} totalLessons={totalLessons} completedLessons={completedLessons} onClose={() => setShowProgressModal(false)} />
      )}

      {showBookmarksModal && (
        <BookmarksModal bookmarks={bookmarks} courseCurriculum={courseCurriculum} onClose={() => setShowBookmarksModal(false)} onLessonClick={handleLessonClick} onRemove={handleToggleBookmark} />
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setShowShareModal(false)}>×</button>
            <h2 className="share-modal-title">Share This Course</h2>
            <div className="share-options">
              {[['twitter', '🐦', 'Twitter'], ['facebook', '📘', 'Facebook'], ['linkedin', '💼', 'LinkedIn'], ['email', '📧', 'Email'], ['copy', '🔗', 'Copy Link']].map(([p, icon, label]) => (
                <button key={p} className="share-option" onClick={() => handleShare(p)}>
                  <span className="share-icon">{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;