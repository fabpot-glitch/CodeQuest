import React, { useState } from 'react';
import './CourseDetails.css';

const CourseInstructor = ({ instructor }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [enrollmentData, setEnrollmentData] = useState({
    course: null,
    paymentMethod: 'card',
    cardDetails: {
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    },
    userDetails: {
      fullName: '',
      email: '',
      phone: '',
      country: ''
    },
    agreeToTerms: false
  });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  
  // Local state for enrollment form (moved outside modal)
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
  
  // Sample other courses by instructor
  const otherCourses = [
    {
      id: 1,
      title: 'Advanced System Design',
      students: 12500,
      rating: 4.9,
      price: 89.99,
      discountedPrice: 79.99,
      duration: '12 weeks',
      lessons: 48,
      level: 'Advanced',
      description: 'Master advanced system design concepts, scalability, and architecture patterns used by top tech companies like Netflix, Uber, and Twitter.',
      learningOutcomes: [
        'Design scalable systems handling millions of users',
        'Master load balancing, caching, and database sharding',
        'Implement microservices architecture',
        'Optimize system performance and reliability',
        'Learn real-world system design patterns'
      ],
      curriculum: [
        { week: 1, topic: 'Introduction to System Design', duration: '2 hours' },
        { week: 2, topic: 'Load Balancing & Caching', duration: '3 hours' },
        { week: 3, topic: 'Database Design & Sharding', duration: '3 hours' },
        { week: 4, topic: 'Microservices Architecture', duration: '2.5 hours' },
        { week: 5, topic: 'Message Queues & Kafka', duration: '2.5 hours' },
        { week: 6, topic: 'Real-world Case Studies', duration: '3 hours' }
      ],
      includes: ['Full lifetime access', 'Certificate of completion', 'Downloadable resources', 'Mobile access', 'Assignments'],
      prerequisites: ['Basic system design knowledge', 'Programming experience', 'Understanding of databases']
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      students: 8900,
      rating: 4.8,
      price: 79.99,
      discountedPrice: 69.99,
      duration: '10 weeks',
      lessons: 42,
      level: 'Intermediate',
      description: 'Comprehensive introduction to machine learning algorithms, neural networks, and practical implementations with Python.',
      learningOutcomes: [
        'Build and train neural networks from scratch',
        'Implement regression and classification algorithms',
        'Work with real-world datasets',
        'Deploy ML models to production',
        'Understand deep learning fundamentals'
      ],
      curriculum: [
        { week: 1, topic: 'Python for ML', duration: '3 hours' },
        { week: 2, topic: 'Data Preprocessing', duration: '2.5 hours' },
        { week: 3, topic: 'Linear Regression', duration: '2.5 hours' },
        { week: 4, topic: 'Classification Algorithms', duration: '3 hours' },
        { week: 5, topic: 'Neural Networks', duration: '3.5 hours' },
        { week: 6, topic: 'Model Deployment', duration: '2 hours' }
      ],
      includes: ['Full lifetime access', 'Certificate of completion', 'Python code files', 'Dataset downloads', '1-on-1 support'],
      prerequisites: ['Python programming', 'Basic statistics', 'Linear algebra fundamentals']
    },
    {
      id: 3,
      title: 'Coding Interview Prep',
      students: 15600,
      rating: 4.9,
      price: 69.99,
      discountedPrice: 59.99,
      duration: '8 weeks',
      lessons: 36,
      level: 'All Levels',
      description: 'Comprehensive preparation for technical interviews at top tech companies. Covers algorithms, data structures, and problem-solving strategies.',
      learningOutcomes: [
        'Master 150+ LeetCode problems',
        'Ace technical interviews at FAANG companies',
        'Understand complex algorithms and data structures',
        'Optimize solutions for time and space complexity',
        'Practice mock interviews with real questions'
      ],
      curriculum: [
        { week: 1, topic: 'Arrays & Strings', duration: '3 hours' },
        { week: 2, topic: 'Linked Lists & Stacks', duration: '2.5 hours' },
        { week: 3, topic: 'Trees & Graphs', duration: '3.5 hours' },
        { week: 4, topic: 'Dynamic Programming', duration: '4 hours' },
        { week: 5, topic: 'System Design Interviews', duration: '3 hours' },
        { week: 6, topic: 'Mock Interviews', duration: '2 hours' }
      ],
      includes: ['Full lifetime access', 'Certificate of completion', 'Interview cheat sheets', 'Mock interview sessions', 'Resume review'],
      prerequisites: ['Basic programming knowledge', 'Familiarity with at least one programming language']
    }
  ];

  const truncatedBio = instructor.bio?.length > 300 
    ? instructor.bio.substring(0, 300) + '...' 
    : instructor.bio;

  // Handle View Details
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  // Handle View Instructor Details
  const handleViewInstructorDetails = () => {
    setShowInstructorModal(true);
  };

  // Handle Enroll Now
  const handleEnrollNow = (course) => {
    setSelectedCourse(course);
    
    // Reset local form state
    setLocalFullName('');
    setLocalEmail('');
    setLocalPhone('');
    setLocalCountry('');
    setLocalAgreeToTerms(false);
    setLocalPaymentMethod('card');
    setLocalCardNumber('');
    setLocalCardName('');
    setLocalCardExpiry('');
    setLocalCardCvc('');
    
    setEnrollmentData({
      ...enrollmentData,
      course: course,
      userDetails: {
        fullName: '',
        email: '',
        phone: '',
        country: ''
      },
      cardDetails: {
        number: '',
        name: '',
        expiry: '',
        cvc: ''
      },
      paymentMethod: 'card',
      agreeToTerms: false
    });
    
    setShowEnrollmentModal(true);
    setEnrollmentStep(1);
    setEnrollmentSuccess(false);
  };

  // Handle Enrollment Submit
  const handleEnrollmentSubmit = () => {
    setEnrollmentStep(3);
    setTimeout(() => {
      setEnrollmentSuccess(true);
    }, 2000);
  };

  // Close Modal
  const closeModal = () => {
    setShowCourseModal(false);
    setShowInstructorModal(false);
    setShowEnrollmentModal(false);
    setEnrollmentStep(1);
    setEnrollmentSuccess(false);
    setSelectedCourse(null);
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Check if step is valid
  const isStepValid = () => {
    if (enrollmentStep === 1) {
      return localFullName && 
             localEmail && 
             localEmail.includes('@') &&
             localAgreeToTerms;
    }
    if (enrollmentStep === 2) {
      if (localPaymentMethod === 'card') {
        return localCardNumber.replace(/\s/g, '').length === 16 &&
               localCardName &&
               localCardExpiry.length === 5 &&
               localCardCvc.length === 3;
      }
      return true;
    }
    return true;
  };

  // Form handlers
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setLocalFullName(value);
    setEnrollmentData(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        fullName: value
      }
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setLocalEmail(value);
    setEnrollmentData(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        email: value
      }
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setLocalPhone(value);
    setEnrollmentData(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        phone: value
      }
    }));
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setLocalCountry(value);
    setEnrollmentData(prev => ({
      ...prev,
      userDetails: {
        ...prev.userDetails,
        country: value
      }
    }));
  };

  const handleTermsChange = (e) => {
    const checked = e.target.checked;
    setLocalAgreeToTerms(checked);
    setEnrollmentData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setLocalPaymentMethod(method);
    setEnrollmentData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    const raw = formatted.replace(/\s/g, '');
    setLocalCardNumber(formatted);
    setEnrollmentData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        number: raw
      }
    }));
  };

  const handleCardNameChange = (e) => {
    const value = e.target.value;
    setLocalCardName(value);
    setEnrollmentData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        name: value
      }
    }));
  };

  const handleCardExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setLocalCardExpiry(formatted);
    setEnrollmentData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        expiry: formatted
      }
    }));
  };

  const handleCardCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setLocalCardCvc(value);
      setEnrollmentData(prev => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          cvc: value
        }
      }));
    }
  };

  // Course Details Modal Component
  const CourseDetailsModal = ({ course, onClose }) => {
    if (!course) return null;

    return (
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
          
          {/* Close Button */}
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>

          {/* Modal Content */}
          <div style={{ padding: '2rem' }}>
            {/* Header with Gradient */}
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>{course.title}</h2>
              <p style={modalDescriptionStyle}>{course.description}</p>
              
              {/* Quick Stats */}
              <div style={modalStatsStyle}>
                <span style={modalStatItemStyle}>⭐ {course.rating} Rating</span>
                <span style={modalStatItemStyle}>👥 {course.students.toLocaleString()} Students</span>
                <span style={modalStatItemStyle}>📊 {course.level}</span>
                <span style={modalStatItemStyle}>⏱️ {course.duration}</span>
              </div>
            </div>

            {/* Course Details Grid */}
            <div style={detailsGridStyle}>
              {[
                { icon: '📚', label: 'Lessons', value: course.lessons },
                { icon: '🎯', label: 'Projects', value: '4' },
                { icon: '📝', label: 'Quizzes', value: '12' },
                { icon: '🏆', label: 'Certificate', value: 'Included' },
              ].map((item, index) => (
                <div key={index} style={detailCardStyle}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                  <div style={detailValueStyle}>{item.value}</div>
                  <div style={detailLabelStyle}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* What You'll Learn */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>
                <span style={titleAccentStyle}></span>
                What You'll Learn
              </h3>
              <div style={learningGridStyle}>
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} style={learningItemStyle}>
                    <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✓</span>
                    <span style={learningTextStyle}>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>
                <span style={titleAccentStyle}></span>
                Prerequisites
              </h3>
              <ul style={prereqListStyle}>
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} style={prereqItemStyle}>
                    <span style={{ color: '#f59e0b' }}>📌</span>
                    <span style={prereqTextStyle}>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum Preview */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>
                <span style={titleAccentStyle}></span>
                Course Curriculum
              </h3>
              <div style={curriculumListStyle}>
                {course.curriculum.map((item, index) => (
                  <div key={index} style={curriculumItemStyle}>
                    <div style={curriculumLeftStyle}>
                      <span style={weekBadgeStyle}>{item.week}</span>
                      <span style={topicStyle}>{item.topic}</span>
                    </div>
                    <span style={durationStyle}>{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Includes */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>
                <span style={titleAccentStyle}></span>
                This Course Includes
              </h3>
              <div style={includesGridStyle}>
                {course.includes.map((item, index) => (
                  <div key={index} style={includesItemStyle}>
                    <span style={{ color: '#667eea' }}>✓</span>
                    <span style={includesTextStyle}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={modalActionStyle}>
              <button
                onClick={() => {
                  onClose();
                  handleEnrollNow(course);
                }}
                style={enrollButtonStyle}
              >
                Enroll Now ${course.discountedPrice || course.price}
              </button>
              <button
                onClick={() => alert('Added to wishlist!')}
                style={wishlistButtonStyle}
              >
                Add to Wishlist ♡
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Instructor Details Modal Component
  const InstructorDetailsModal = ({ instructor, onClose }) => {
    return (
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={{...modalContainerStyle, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
          
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>

          <div style={{ padding: '2rem' }}>
            {/* Header with Avatar */}
            <div style={instructorHeaderStyle}>
              <div style={instructorAvatarStyle}>
                {instructor.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={instructorNameStyle}>{instructor.name}</h2>
                <p style={instructorTitleStyle}>{instructor.title}</p>
                
                {/* Extended Stats */}
                <div style={instructorStatsStyle}>
                  <span style={instructorStatItemStyle}>
                    <span>⭐</span> {instructor.rating} Instructor Rating
                  </span>
                  <span style={instructorStatItemStyle}>
                    <span>👥</span> {instructor.students?.toLocaleString()} Students
                  </span>
                  <span style={instructorStatItemStyle}>
                    <span>📚</span> {instructor.courses} Courses
                  </span>
                </div>
              </div>
            </div>

            {/* Full Bio */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Full Biography</h3>
              <p style={bioTextStyle}>{instructor.bio}</p>
            </div>

            {/* Achievements Timeline */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Career Achievements</h3>
              <div style={timelineStyle}>
                {[
                  { year: '2023', achievement: 'Launched 3 bestselling courses with over 15,000 students' },
                  { year: '2022', achievement: 'Received "Top Instructor" award for excellence in teaching' },
                  { year: '2021', achievement: 'Published research paper on advanced system architectures' },
                  { year: '2020', achievement: 'Developed curriculum for 5 professional certification programs' }
                ].map((item, index) => (
                  <div key={index} style={timelineItemStyle}>
                    <div style={timelineYearStyle}>{item.year}</div>
                    <div style={timelineAchievementStyle}>{item.achievement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise Section */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Expertise</h3>
              <div style={expertiseGridStyle}>
                {instructor.expertise?.map((skill, index) => (
                  <span key={index} style={expertiseBadgeStyle}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div style={socialLinksStyle}>
              {instructor.social?.linkedin && (
                <a href={instructor.social.linkedin} target="_blank" rel="noopener noreferrer" style={socialLinkStyle('#0077b5')}>
                  in
                </a>
              )}
              {instructor.social?.twitter && (
                <a href={instructor.social.twitter} target="_blank" rel="noopener noreferrer" style={socialLinkStyle('#1da1f2')}>
                  𝕏
                </a>
              )}
              {instructor.social?.github && (
                <a href={instructor.social.github} target="_blank" rel="noopener noreferrer" style={socialLinkStyle('#333')}>
                  ⌨️
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enrollment Modal Component
  const EnrollmentModal = ({ course, onClose }) => {
    if (!course) return null;

    return (
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={{...modalContainerStyle, maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
          
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>

          {/* Progress Bar */}
          <div style={progressBarStyle}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={progressStepStyle}>
                <div style={{
                  ...progressDotStyle,
                  background: enrollmentStep >= step ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e2e8f0'
                }}>
                  {step === 3 && enrollmentSuccess ? '✓' : step}
                </div>
                <div style={{
                  ...progressLabelStyle,
                  color: enrollmentStep >= step ? '#667eea' : '#94a3b8'
                }}>
                  {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Confirmation'}
                </div>
                {step < 3 && (
                  <div style={{
                    ...progressLineStyle,
                    background: enrollmentStep > step ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e2e8f0'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Modal Content */}
          <div style={{ padding: '2rem' }}>
            {enrollmentSuccess ? (
              // Success State
              <div style={successStyle}>
                <div style={successIconStyle}>
                  ✓
                </div>
                <h3 style={successTitleStyle}>Enrollment Successful!</h3>
                <p style={successTextStyle}>
                  You've successfully enrolled in {course.title}
                </p>
                <div style={successDetailsStyle}>
                  <div style={successDetailItemStyle}>
                    <span style={{ color: '#64748b' }}>Order ID:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div style={successDetailItemStyle}>
                    <span style={{ color: '#64748b' }}>Amount Paid:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>${course.discountedPrice || course.price}</span>
                  </div>
                  <div style={successDetailItemStyle}>
                    <span style={{ color: '#64748b' }}>Access:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>Full Lifetime</span>
                  </div>
                </div>
                <div style={successActionsStyle}>
                  <button onClick={onClose} style={successCloseButtonStyle}>
                    Close
                  </button>
                  <button onClick={() => window.open('/my-courses', '_blank')} style={successMyCoursesButtonStyle}>
                    Go to My Courses →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: User Details */}
                {enrollmentStep === 1 && (
                  <div>
                    <h3 style={stepTitleStyle}>Your Information</h3>
                    <p style={stepSubtitleStyle}>
                      Please provide your details to complete enrollment
                    </p>

                    <div style={formStyle}>
                      {/* Full Name Input */}
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input
                          type="text"
                          value={localFullName}
                          onChange={handleFullNameChange}
                          placeholder="John Doe"
                          style={stableInputStyle}
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label style={labelStyle}>Email Address *</label>
                        <input
                          type="email"
                          value={localEmail}
                          onChange={handleEmailChange}
                          placeholder="john@example.com"
                          style={stableInputStyle}
                        />
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label style={labelStyle}>Phone Number</label>
                        <input
                          type="tel"
                          value={localPhone}
                          onChange={handlePhoneChange}
                          placeholder="+1 234 567 8900"
                          style={stableInputStyle}
                        />
                      </div>

                      {/* Country Select */}
                      <div>
                        <label style={labelStyle}>Country</label>
                        <select
                          value={localCountry}
                          onChange={handleCountryChange}
                          style={stableSelectStyle}
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                        </select>
                      </div>

                      {/* Terms Checkbox */}
                      <div style={termsStyle}>
                        <input
                          type="checkbox"
                          id="terms"
                          checked={localAgreeToTerms}
                          onChange={handleTermsChange}
                          style={checkboxStyle}
                        />
                        <label htmlFor="terms" style={termsLabelStyle}>
                          I agree to the{' '}
                          <a href="#" style={termsLinkStyle}>
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" style={termsLinkStyle}>
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Details */}
                {enrollmentStep === 2 && (
                  <div>
                    <h3 style={stepTitleStyle}>Payment Details</h3>
                    <p style={stepSubtitleStyle}>
                      Choose your payment method
                    </p>

                    {/* Payment Method Selection */}
                    <div style={paymentMethodStyle}>
                      {['card', 'paypal', 'apple-pay'].map((method) => (
                        <button
                          key={method}
                          onClick={() => handlePaymentMethodChange(method)}
                          style={{
                            ...paymentMethodButtonStyle,
                            background: localPaymentMethod === method ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
                            border: localPaymentMethod === method ? 'none' : '2px solid #e2e8f0',
                            color: localPaymentMethod === method ? 'white' : '#64748b'
                          }}
                        >
                          <span>
                            {method === 'card' && '💳'}
                            {method === 'paypal' && '🅿️'}
                            {method === 'apple-pay' && '🍎'}
                          </span>
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Card Details Form */}
                    {localPaymentMethod === 'card' && (
                      <div style={cardFormStyle}>
                        <div>
                          <label style={labelStyle}>Card Number *</label>
                          <input
                            type="text"
                            value={localCardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            style={stableInputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Cardholder Name *</label>
                          <input
                            type="text"
                            value={localCardName}
                            onChange={handleCardNameChange}
                            placeholder="John Doe"
                            style={stableInputStyle}
                          />
                        </div>

                        <div style={cardDetailsRowStyle}>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Expiry Date *</label>
                            <input
                              type="text"
                              value={localCardExpiry}
                              onChange={handleCardExpiryChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              style={stableInputStyle}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={labelStyle}>CVC *</label>
                            <input
                              type="text"
                              value={localCardCvc}
                              onChange={handleCardCvcChange}
                              placeholder="123"
                              maxLength="3"
                              style={stableInputStyle}
                            />
                          </div>
                        </div>

                        <div style={securePaymentStyle}>
                          <span style={{ fontSize: '1.1rem' }}>🔒</span>
                          Your payment information is encrypted and secure
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div style={paymentSummaryStyle}>
                      <h4 style={summaryTitleStyle}>Order Summary</h4>
                      
                      <div style={summaryRowStyle}>
                        <span style={{ color: '#64748b' }}>Course Price</span>
                        <span style={{ fontWeight: '500', color: '#1e293b' }}>${course.price}</span>
                      </div>
                      
                      {course.discountedPrice && (
                        <div style={{...summaryRowStyle, color: '#10b981'}}>
                          <span>Discount</span>
                          <span>-${(course.price - course.discountedPrice).toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div style={summaryDividerStyle} />
                      
                      <div style={summaryTotalStyle}>
                        <span style={{ color: '#1e293b' }}>Total</span>
                        <span style={{ color: '#2563eb' }}>${course.discountedPrice || course.price}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Processing */}
                {enrollmentStep === 3 && !enrollmentSuccess && (
                  <div style={processingStyle}>
                    <div style={spinnerStyle} />
                    <h3 style={processingTitleStyle}>Processing Your Enrollment</h3>
                    <p style={processingTextStyle}>
                      Please wait while we secure your spot in the course...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Buttons */}
          {!enrollmentSuccess && enrollmentStep < 3 && (
            <div style={modalFooterStyle}>
              <button
                onClick={enrollmentStep === 1 ? onClose : () => setEnrollmentStep(enrollmentStep - 1)}
                style={backButtonStyle}
              >
                {enrollmentStep === 1 ? 'Cancel' : 'Back'}
              </button>
              
              <button
                onClick={enrollmentStep === 2 ? handleEnrollmentSubmit : () => setEnrollmentStep(enrollmentStep + 1)}
                disabled={!isStepValid()}
                style={{
                  ...continueButtonStyle,
                  background: isStepValid() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#cbd5e1',
                  cursor: isStepValid() ? 'pointer' : 'not-allowed'
                }}
              >
                {enrollmentStep === 2 ? 'Complete Enrollment' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // STABLE STYLES
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    animation: 'fadeIn 0.3s ease'
  };

  const modalContainerStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    animation: 'slideUp 0.3s ease',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: 'none',
    background: '#f1f5f9',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'all 0.2s ease',
    zIndex: 10
  };

  const modalHeaderStyle = {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    margin: '-2rem -2rem 2rem -2rem',
    padding: '3rem 2rem',
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '1.5rem',
    color: 'white'
  };

  const modalTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  };

  const modalDescriptionStyle = {
    fontSize: '1rem',
    opacity: 0.9,
    marginBottom: '1rem',
    maxWidth: '600px'
  };

  const modalStatsStyle = {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginTop: '1rem'
  };

  const modalStatItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const detailCardStyle = {
    background: '#f8fafc',
    padding: '1rem',
    borderRadius: '1rem',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  };

  const detailValueStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b'
  };

  const detailLabelStyle = {
    fontSize: '0.85rem',
    color: '#64748b'
  };

  const sectionStyle = {
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const titleAccentStyle = {
    width: '4px',
    height: '20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '2px'
  };

  const learningGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem'
  };

  const learningItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  };

  const learningTextStyle = {
    fontSize: '0.95rem',
    color: '#475569'
  };

  const prereqListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const prereqItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
    border: '1px solid #e2e8f0'
  };

  const prereqTextStyle = {
    color: '#475569'
  };

  const curriculumListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const curriculumItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  };

  const curriculumLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const weekBadgeStyle = {
    width: '1.5rem',
    height: '1.5rem',
    background: 'linear-gradient(135deg, #667eea20, #764ba220)',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#667eea'
  };

  const topicStyle = {
    color: '#1e293b',
    fontWeight: '500'
  };

  const durationStyle = {
    color: '#64748b',
    fontSize: '0.9rem'
  };

  const includesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem'
  };

  const includesItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    background: '#f8fafc',
    borderRadius: '0.5rem'
  };

  const includesTextStyle = {
    fontSize: '0.9rem',
    color: '#475569'
  };

  const modalActionStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  };

  const enrollButtonStyle = {
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '3rem',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)',
    flex: 1,
    maxWidth: '300px'
  };

  const wishlistButtonStyle = {
    padding: '1rem 2rem',
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '3rem',
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const instructorHeaderStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap'
  };

  const instructorAvatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    color: 'white',
    boxShadow: '0 15px 30px -10px rgba(102, 126, 234, 0.4)',
    border: '4px solid white',
    flexShrink: 0
  };

  const instructorNameStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  };

  const instructorTitleStyle = {
    fontSize: '1.1rem',
    color: '#667eea',
    fontWeight: '500',
    marginBottom: '1rem'
  };

  const instructorStatsStyle = {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  };

  const instructorStatItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const bioTextStyle = {
    color: '#475569',
    lineHeight: '1.8',
    fontSize: '1rem'
  };

  const timelineStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const timelineItemStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  };

  const timelineYearStyle = {
    minWidth: '60px',
    fontWeight: '700',
    color: '#667eea'
  };

  const timelineAchievementStyle = {
    color: '#475569'
  };

  const expertiseGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem'
  };

  const expertiseBadgeStyle = {
    padding: '0.5rem 1.2rem',
    background: 'linear-gradient(135deg, #667eea10, #764ba210)',
    border: '1px solid #e2e8f0',
    borderRadius: '2rem',
    fontSize: '0.9rem',
    color: '#1e293b',
    fontWeight: '500'
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem'
  };

  const socialLinkStyle = (color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.2rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  });

  const progressBarStyle = {
    padding: '2rem 2rem 1rem 2rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const progressStepStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  };

  const progressDotStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    zIndex: 2,
    transition: 'all 0.3s ease'
  };

  const progressLabelStyle = {
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    fontWeight: '600'
  };

  const progressLineStyle = {
    position: 'absolute',
    top: '1rem',
    left: '50%',
    width: '100%',
    height: '2px',
    zIndex: 1,
    transform: 'translateX(0)'
  };

  const stepTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  };

  const stepSubtitleStyle = {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '1.5rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '0.5rem'
  };

  // STABLE INPUT STYLE - No hover effects, no transitions
  const stableInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    transition: 'none'
  };

  // STABLE SELECT STYLE - No hover effects, no transitions
  const stableSelectStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    background: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'none'
  };

  const termsStyle = {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  };

  const checkboxStyle = {
    width: '1.2rem',
    height: '1.2rem',
    cursor: 'pointer'
  };

  const termsLabelStyle = {
    color: '#475569',
    fontSize: '0.95rem'
  };

  const termsLinkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const paymentMethodStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  };

  const paymentMethodButtonStyle = {
    flex: 1,
    minWidth: '100px',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  const cardFormStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const cardDetailsRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  const securePaymentStyle = {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const paymentSummaryStyle = {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0'
  };

  const summaryTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem'
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  };

  const summaryDividerStyle = {
    height: '1px',
    background: '#e2e8f0',
    margin: '1rem 0'
  };

  const summaryTotalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    fontWeight: '700'
  };

  const processingStyle = {
    textAlign: 'center',
    padding: '3rem 0'
  };

  const spinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    animation: 'spin 1s linear infinite'
  };

  const processingTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  };

  const processingTextStyle = {
    color: '#64748b'
  };

  const successStyle = {
    textAlign: 'center',
    padding: '2rem 0'
  };

  const successIconStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2.5rem',
    color: 'white',
    animation: 'scaleIn 0.5s ease'
  };

  const successTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  };

  const successTextStyle = {
    color: '#64748b',
    marginBottom: '1.5rem'
  };

  const successDetailsStyle = {
    background: '#f8fafc',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #e2e8f0'
  };

  const successDetailItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  };

  const successActionsStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  };

  const successCloseButtonStyle = {
    padding: '0.75rem 1.5rem',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '2rem',
    color: '#475569',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer'
  };

  const successMyCoursesButtonStyle = {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '2rem',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)'
  };

  const modalFooterStyle = {
    padding: '1.5rem 2rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem'
  };

  const backButtonStyle = {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '2rem',
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer'
  };

  const continueButtonStyle = {
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '2rem',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600'
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      {/* View Full Instructor Details Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '2rem'
      }}>
        <button
          onClick={handleViewInstructorDetails}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: '2rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.4)'
          }}
        >
          <span>📋</span>
          View Full Instructor Details
        </button>
      </div>

      {/* Instructor Card */}
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Instructor Header */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            color: 'white',
            boxShadow: '0 15px 30px -10px rgba(102, 126, 234, 0.4)',
            border: '4px solid white',
            flexShrink: 0
          }}>
            {instructor.avatar}
          </div>

          {/* Instructor Info */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              {instructor.name}
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: '#667eea',
              fontWeight: '500',
              marginBottom: '1rem'
            }}>
              {instructor.title}
            </p>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              maxWidth: '400px'
            }}>
              {[
                { label: 'Rating', value: `⭐ ${instructor.rating}`, color: '#fbbf24' },
                { label: 'Students', value: instructor.students?.toLocaleString(), color: '#3b82f6' },
                { label: 'Courses', value: instructor.courses, color: '#10b981' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: '#f8fafc',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              width: '4px',
              height: '20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '2px'
            }}></span>
            About the Instructor
          </h3>
          <p style={{
            color: '#475569',
            lineHeight: '1.8',
            fontSize: '1rem'
          }}>
            {showFullBio ? instructor.bio : truncatedBio}
          </p>
          {instructor.bio?.length > 300 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              {showFullBio ? 'Show Less ↑' : 'Read More ↓'}
            </button>
          )}
        </div>

        {/* More Courses Section */}
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1.5rem'
          }}>
            More Courses by {instructor.name}
          </h3>
          
          {/* Course Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {otherCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Course Title */}
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  {course.title}
                </h4>

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  color: '#fbbf24'
                }}>
                  <span>⭐</span>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>{course.rating}</span>
                </div>

                {/* Duration & Lessons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#64748b',
                  fontSize: '0.95rem'
                }}>
                  <span>📚</span>
                  <span>{course.duration} • {course.lessons} lessons</span>
                </div>

                {/* Students */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  color: '#64748b',
                  fontSize: '0.95rem'
                }}>
                  <span>👥</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>

                {/* Pricing */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#2563eb'
                  }}>
                    ${course.discountedPrice}
                  </span>
                  <span style={{
                    fontSize: '1rem',
                    color: '#94a3b8',
                    textDecoration: 'line-through'
                  }}>
                    ${course.price}
                  </span>
                </div>

                {/* Save Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '2rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '1.25rem'
                }}>
                  <span>🎉</span>
                  Save ${(course.price - course.discountedPrice).toFixed(0)}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <button
                    onClick={() => handleViewDetails(course)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1rem',
                      background: 'transparent',
                      border: '2px solid #667eea',
                      borderRadius: '2rem',
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleEnrollNow(course)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1rem',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '2rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCourseModal && (
        <CourseDetailsModal 
          course={selectedCourse} 
          onClose={closeModal} 
        />
      )}
      
      {showInstructorModal && (
        <InstructorDetailsModal 
          instructor={instructor} 
          onClose={closeModal} 
        />
      )}

      {showEnrollmentModal && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={closeModal}
        />
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CourseInstructor;