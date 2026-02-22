import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PracticeSessionsDashboard.css';

const PracticeSessionsDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [durationFilter, setDurationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ free: false, under50: false });
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  
  // Modal states
  const [showInterviewerModal, setShowInterviewerModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [showAllBookingsModal, setShowAllBookingsModal] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [interviewerApplications, setInterviewerApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [calendarView, setCalendarView] = useState(false);
  
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    upcoming: 0
  });

  // Form states
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    goals: '',
    preparationLevel: 'beginner',
    questions: '',
    agreeToTerms: false
  });

  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    feedback: '',
    interviewerRating: 0,
    wouldRecommend: true,
    comments: ''
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });

  const [interviewerForm, setInterviewerForm] = useState({
    name: '',
    email: '',
    expertise: '',
    experience: '',
    company: '',
    role: '',
    bio: '',
    linkedin: '',
    github: ''
  });

  const [sessionForm, setSessionForm] = useState({
    title: '',
    type: 'technical',
    category: 'Engineering',
    subCategory: 'Software Development',
    difficulty: 'Medium',
    duration: 60,
    date: '',
    time: '',
    totalSpots: 10,
    price: 0,
    tags: '',
    description: '',
    languages: ['English']
  });

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setSessions(mockSessions);
      setUserBookings(mockUserBookings);
      setPastBookings(mockPastBookings);
      updateBookingStats();
      setLoading(false);
    }, 1000);
  }, []);

  const mockSessions = [
    {
      id: 1,
      title: 'Technical Interview Practice',
      type: 'technical',
      category: 'Engineering',
      subCategory: 'Software Development',
      difficulty: 'Medium',
      duration: 60,
      interviewer: 'Sarah Johnson',
      interviewerRole: 'Senior Software Engineer',
      interviewerCompany: 'Google',
      date: '2024-01-25',
      time: '14:00',
      spotsLeft: 3,
      totalSpots: 10,
      price: 0,
      rating: 4.8,
      reviews: 124,
      tags: ['Algorithms', 'Data Structures', 'Coding'],
      bookedCount: 7,
      languages: ['English'],
      includesFeedback: true,
      includesRecording: true,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Practice technical interviews with a senior engineer from Google.',
      prerequisites: ['Basic coding knowledge'],
      learningOutcomes: ['Master technical interviews', 'Improve problem-solving skills']
    },
    {
      id: 2,
      title: 'Behavioral Interview Workshop',
      type: 'behavioral',
      category: 'Soft Skills',
      subCategory: 'Leadership',
      difficulty: 'Easy',
      duration: 45,
      interviewer: 'Mike Chen',
      interviewerRole: 'HR Director',
      interviewerCompany: 'Amazon',
      date: '2024-01-26',
      time: '11:00',
      spotsLeft: 5,
      totalSpots: 8,
      price: 0,
      rating: 4.9,
      reviews: 89,
      tags: ['Leadership', 'STAR Method', 'Communication'],
      bookedCount: 3,
      languages: ['English', 'Spanish'],
      includesFeedback: true,
      includesRecording: false,
      image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Master behavioral interviews with an experienced HR director.'
    },
    {
      id: 3,
      title: 'System Design Masterclass',
      type: 'system-design',
      category: 'Engineering',
      subCategory: 'Architecture',
      difficulty: 'Hard',
      duration: 90,
      interviewer: 'Alex Rivera',
      interviewerRole: 'Staff Engineer',
      interviewerCompany: 'Netflix',
      date: '2024-01-27',
      time: '15:00',
      spotsLeft: 2,
      totalSpots: 6,
      price: 49,
      rating: 4.9,
      reviews: 56,
      tags: ['Scalability', 'Microservices', 'Architecture'],
      bookedCount: 4,
      languages: ['English'],
      includesFeedback: true,
      includesRecording: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Learn system design principles from a Netflix staff engineer.'
    },
    {
      id: 4,
      title: 'Frontend Interview Prep',
      type: 'frontend',
      category: 'Engineering',
      subCategory: 'Frontend',
      difficulty: 'Medium',
      duration: 75,
      interviewer: 'Emily Rodriguez',
      interviewerRole: 'Lead Frontend Engineer',
      interviewerCompany: 'Meta',
      date: '2024-01-28',
      time: '13:00',
      spotsLeft: 4,
      totalSpots: 8,
      price: 0,
      rating: 4.7,
      reviews: 92,
      tags: ['React', 'JavaScript', 'CSS'],
      bookedCount: 4,
      languages: ['English'],
      includesFeedback: true,
      includesRecording: true,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Prepare for frontend interviews with a Meta lead engineer.'
    },
    {
      id: 5,
      title: 'Data Science Interview',
      type: 'data-science',
      category: 'Data',
      subCategory: 'Machine Learning',
      difficulty: 'Hard',
      duration: 60,
      interviewer: 'David Kim',
      interviewerRole: 'Data Science Lead',
      interviewerCompany: 'Microsoft',
      date: '2024-01-29',
      time: '10:00',
      spotsLeft: 6,
      totalSpots: 12,
      price: 39,
      rating: 4.8,
      reviews: 67,
      tags: ['Python', 'ML', 'Statistics'],
      bookedCount: 6,
      languages: ['English', 'Korean'],
      includesFeedback: true,
      includesRecording: false,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Practice data science interviews with a Microsoft lead.'
    },
    {
      id: 6,
      title: 'Product Management Interview',
      type: 'product',
      category: 'Product',
      subCategory: 'Strategy',
      difficulty: 'Medium',
      duration: 60,
      interviewer: 'Lisa Wang',
      interviewerRole: 'Product Director',
      interviewerCompany: 'Google',
      date: '2024-01-30',
      time: '16:00',
      spotsLeft: 3,
      totalSpots: 8,
      price: 0,
      rating: 4.9,
      reviews: 78,
      tags: ['Product Strategy', 'Metrics', 'Case Studies'],
      bookedCount: 5,
      languages: ['English', 'Mandarin'],
      includesFeedback: true,
      includesRecording: true,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Master product management interviews with a Google director.'
    }
  ];

  const mockUserBookings = [
    {
      id: 101,
      sessionId: 1,
      title: 'Technical Interview Practice',
      interviewer: 'Sarah Johnson',
      interviewerCompany: 'Google',
      date: '2024-01-25',
      time: '14:00',
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      preparationLevel: 'intermediate',
      goals: 'Practice coding interviews'
    },
    {
      id: 102,
      sessionId: 3,
      title: 'System Design Masterclass',
      interviewer: 'Alex Rivera',
      interviewerCompany: 'Netflix',
      date: '2024-01-27',
      time: '15:00',
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/klm-nopq-rst',
      preparationLevel: 'advanced',
      goals: 'Master system design'
    },
    {
      id: 103,
      sessionId: 5,
      title: 'Data Science Interview',
      interviewer: 'David Kim',
      interviewerCompany: 'Microsoft',
      date: '2024-01-29',
      time: '10:00',
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/uvw-xyz-123',
      preparationLevel: 'intermediate',
      goals: 'Practice ML algorithms'
    }
  ];

  const mockPastBookings = [
    {
      id: 201,
      sessionId: 2,
      title: 'Behavioral Interview Workshop',
      interviewer: 'Mike Chen',
      interviewerCompany: 'Amazon',
      date: '2024-01-15',
      time: '11:00',
      status: 'completed'
    },
    {
      id: 202,
      sessionId: 4,
      title: 'Frontend Interview Prep',
      interviewer: 'Emily Rodriguez',
      interviewerCompany: 'Meta',
      date: '2024-01-18',
      time: '13:00',
      status: 'completed'
    }
  ];

  const categories = [
    { id: 'engineering', name: 'Engineering', icon: '💻', count: 24 },
    { id: 'product', name: 'Product', icon: '📱', count: 12 },
    { id: 'data', name: 'Data', icon: '📊', count: 8 },
    { id: 'soft-skills', name: 'Soft Skills', icon: '🗣️', count: 16 },
    { id: 'leadership', name: 'Leadership', icon: '⭐', count: 10 },
    { id: 'design', name: 'Design', icon: '🎨', count: 6 }
  ];

  const sessionTypes = [
    { id: 'all', name: 'All Sessions', icon: '📋' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'behavioral', name: 'Behavioral', icon: '💬' },
    { id: 'system-design', name: 'System Design', icon: '🏗️' },
    { id: 'frontend', name: 'Frontend', icon: '🖥️' },
    { id: 'data-science', name: 'Data Science', icon: '📈' },
    { id: 'product', name: 'Product', icon: '🎯' }
  ];

  const popularTopics = [
    { 
      id: 1, 
      name: 'System Design', 
      icon: '🏗️', 
      count: 24, 
      description: 'Learn to design scalable systems from industry experts', 
      resources: [
        { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'GitHub' },
        { name: 'Grokking System Design', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', type: 'Course' },
        { name: 'System Design Interview', url: 'https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119', type: 'Book' }
      ],
      sessions: [1, 3]
    },
    { 
      id: 2, 
      name: 'Behavioral', 
      icon: '💬', 
      count: 18, 
      description: 'Master behavioral interviews with proven frameworks', 
      resources: [
        { name: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method', type: 'Article' },
        { name: 'Common Questions', url: 'https://www.indeed.com/career-advice/interviewing/top-behavioral-interview-questions', type: 'Guide' },
        { name: 'Mock Interviews', url: 'https://www.pramp.com', type: 'Platform' }
      ],
      sessions: [2]
    },
    { 
      id: 3, 
      name: 'Data Structures', 
      icon: '📊', 
      count: 32, 
      description: 'Practice algorithms and data structures for coding interviews', 
      resources: [
        { name: 'LeetCode Patterns', url: 'https://leetcode.com/discuss/general-discussion/4572125/leetcode-patterns', type: 'Platform' },
        { name: 'AlgoExpert', url: 'https://www.algoexpert.io', type: 'Course' },
        { name: 'Cracking the Coding Interview', url: 'https://www.crackingthecodinginterview.com', type: 'Book' }
      ],
      sessions: [1, 4]
    }
  ];

  // Helper functions
  const updateBookingStats = () => {
    setBookingStats({
      total: userBookings.length + pastBookings.length,
      completed: pastBookings.filter(b => b.status === 'completed').length,
      cancelled: pastBookings.filter(b => b.status === 'cancelled').length,
      upcoming: userBookings.length
    });
  };

  const showSuccessMessageFunc = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const sessionDate = new Date(dateString);
    const diffTime = sessionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Filter handlers
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
    setFilter('all');
    setSortBy('date');
    setDurationFilter('');
    setPriceFilter({ free: false, under50: false });
  };

  // CTA Section Handlers
  const handleApplyAsInterviewer = () => {
    setShowInterviewerModal(true);
  };

  const handleInterviewerSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!interviewerForm.name || !interviewerForm.email || !interviewerForm.expertise || 
        !interviewerForm.experience || !interviewerForm.company || !interviewerForm.role || !interviewerForm.bio) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new application
    const newApplication = {
      id: Date.now(),
      ...interviewerForm,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      reviewed: false
    };

    setInterviewerApplications([...interviewerApplications, newApplication]);
    
    // Reset form
    setInterviewerForm({
      name: '',
      email: '',
      expertise: '',
      experience: '',
      company: '',
      role: '',
      bio: '',
      linkedin: '',
      github: ''
    });

    setShowInterviewerModal(false);
    showSuccessMessageFunc('Application submitted successfully! We will review it and get back to you soon.');
  };

  const handleAddSession = () => {
    setShowAddSessionModal(true);
  };

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!sessionForm.title || !sessionForm.date || !sessionForm.time || !sessionForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new session
    const newSession = {
      id: sessions.length + 1,
      ...sessionForm,
      interviewer: 'You', // Will be replaced with actual user name
      interviewerRole: 'Interviewer',
      interviewerCompany: 'Your Company',
      spotsLeft: sessionForm.totalSpots,
      rating: 0,
      reviews: 0,
      bookedCount: 0,
      tags: sessionForm.tags.split(',').map(tag => tag.trim()),
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      includesFeedback: true,
      includesRecording: true
    };

    setSessions([...sessions, newSession]);
    
    // Reset form
    setSessionForm({
      title: '',
      type: 'technical',
      category: 'Engineering',
      subCategory: 'Software Development',
      difficulty: 'Medium',
      duration: 60,
      date: '',
      time: '',
      totalSpots: 10,
      price: 0,
      tags: '',
      description: '',
      languages: ['English']
    });

    setShowAddSessionModal(false);
    showSuccessMessageFunc('Session added successfully! It will be reviewed before publishing.');
  };

  // Topic Modal Handlers
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowTopicModal(true);
  };

  const handleViewAllTopicSessions = () => {
    // Set filter to show sessions related to this topic
    setFilter(selectedTopic.name.toLowerCase());
    setShowTopicModal(false);
    
    // Scroll to sessions section
    document.querySelector('.content-header').scrollIntoView({ behavior: 'smooth' });
  };

  const handleResourceClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  // Booking handlers
  const handleBookNow = (session) => {
    setSelectedSession(session);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      sessionId: selectedSession.id,
      title: selectedSession.title,
      interviewer: selectedSession.interviewer,
      interviewerCompany: selectedSession.interviewerCompany,
      date: selectedSession.date,
      time: selectedSession.time,
      status: 'upcoming',
      meetingLink: `https://meet.google.com/abc-${selectedSession.id}-xyz`,
      ...bookingForm,
      bookingDate: new Date().toISOString()
    };
    
    setUserBookings([...userBookings, newBooking]);
    
    // Update spots
    const updatedSessions = sessions.map(s => 
      s.id === selectedSession.id 
        ? { ...s, spotsLeft: s.spotsLeft - 1, bookedCount: s.bookedCount + 1 }
        : s
    );
    setSessions(updatedSessions);
    
    setShowBookingModal(false);
    setBookingForm({
      name: '', email: '', phone: '', experience: '', goals: '',
      preparationLevel: 'beginner', questions: '', agreeToTerms: false
    });
    
    showSuccessMessageFunc(`Successfully booked ${selectedSession.title}!`);
    updateBookingStats();
  };

  const handleJoinSession = (booking) => {
    window.open(booking.meetingLink, '_blank');
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    const updatedBookings = userBookings.filter(b => b.id !== selectedBooking.id);
    setUserBookings(updatedBookings);
    
    const cancelledBooking = { ...selectedBooking, status: 'cancelled' };
    setPastBookings([...pastBookings, cancelledBooking]);
    
    const updatedSessions = sessions.map(s => 
      s.id === selectedBooking.sessionId 
        ? { ...s, spotsLeft: s.spotsLeft + 1, bookedCount: s.bookedCount - 1 }
        : s
    );
    setSessions(updatedSessions);
    
    setShowCancelConfirmModal(false);
    showSuccessMessageFunc('Booking cancelled successfully.');
    updateBookingStats();
  };

  const handleRescheduleClick = (booking) => {
    setSelectedBooking(booking);
    setRescheduleForm({
      newDate: booking.date,
      newTime: booking.time,
      reason: ''
    });
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    const updatedBookings = userBookings.map(b => 
      b.id === selectedBooking.id 
        ? { ...b, date: rescheduleForm.newDate, time: rescheduleForm.newTime }
        : b
    );
    setUserBookings(updatedBookings);
    setShowRescheduleModal(false);
    showSuccessMessageFunc('Session rescheduled successfully!');
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowSessionDetailsModal(true);
  };

  const handleViewAllBookings = () => {
    setShowAllBookingsModal(true);
  };

  // Filter logic
  const filteredSessions = sessions.filter(session => {
    if (searchTerm && !session.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    if (selectedCategories.length > 0) {
      const categoryMap = {
        'engineering': 'Engineering', 'product': 'Product', 'data': 'Data',
        'soft-skills': 'Soft Skills', 'leadership': 'Leadership', 'design': 'Design'
      };
      if (!selectedCategories.some(cat => session.category === categoryMap[cat])) return false;
    }
    
    if (dateRange.start && new Date(session.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(session.date) > new Date(dateRange.end)) return false;
    if (filter !== 'all' && session.type !== filter) return false;
    
    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch(sortBy) {
      case 'date': return new Date(a.date) - new Date(b.date);
      case 'rating': return b.rating - a.rating;
      case 'spots': return a.spotsLeft - b.spotsLeft;
      default: return 0;
    }
  });

  return (
    <div className="practice-sessions-dashboard">
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="success-toast">
          <span className="success-icon">✓</span>
          <span className="success-message">{successMessage}</span>
          <button className="success-close" onClick={() => setShowSuccessMessage(false)}>×</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Practice Makes Perfect</h1>
          <p>Book mock interviews with industry experts and get real-time feedback</p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{sessions.length}+</span>
              <span className="hero-stat-label">Active Sessions</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{new Set(sessions.map(s => s.interviewer)).size}+</span>
              <span className="hero-stat-label">Expert Interviewers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        <div className="hero-search">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>⚙️</span>
            Filters
            {(selectedCategories.length > 0 || dateRange.start || dateRange.end || filter !== 'all') && (
              <span className="filter-badge">
                {selectedCategories.length + (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0) + (filter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-pill ${selectedCategories.includes(category.id) ? 'active' : ''}`}
            onClick={() => handleCategoryToggle(category.id)}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span className="category-count">{category.count}</span>
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filter Sessions</h3>
            <button className="clear-filters" onClick={handleClearFilters}>Clear all filters</button>
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Session Type</label>
              <div className="type-grid">
                {sessionTypes.map(type => (
                  <button
                    key={type.id}
                    className={`type-btn ${filter === type.id ? 'active' : ''}`}
                    onClick={() => setFilter(type.id)}
                  >
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  placeholder="From"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="To"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Duration</label>
              <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
                <option value="">Any duration</option>
                <option value="30">&lt; 30 min</option>
                <option value="60">30-60 min</option>
                <option value="90">60-90 min</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price</label>
              <div className="price-options">
                <label>
                  <input 
                    type="checkbox" 
                    checked={priceFilter.free}
                    onChange={(e) => setPriceFilter({ ...priceFilter, free: e.target.checked })}
                  /> 
                  Free only
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={priceFilter.under50}
                    onChange={(e) => setPriceFilter({ ...priceFilter, under50: e.target.checked })}
                  /> 
                  Under $50
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Header */}
      <div className="content-header">
        <div className="results-info">
          <h2>Available Sessions</h2>
          <span>{sortedSessions.length} sessions found</span>
        </div>

        <div className="content-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by: Date</option>
            <option value="rating">Sort by: Rating</option>
            <option value="spots">Sort by: Spots left</option>
          </select>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >⊞ Grid</button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >☰ List</button>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="skeleton-grid">
          {[1,2,3,4,5,6].map(n => <div key={n} className="skeleton-card" />)}
        </div>
      ) : (
        <>
          {sortedSessions.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No sessions found</h3>
              <p>Try adjusting your filters</p>
              <button onClick={handleClearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className={`sessions-${viewMode}`}>
              {sortedSessions.map(session => (
                <div key={session.id} className={`session-card ${viewMode}`}>
                  <div className="session-card-image">
                    <img src={session.image} alt={session.title} />
                    <div className={`session-badge ${session.type}`}>{session.type}</div>
                    {session.price === 0 && <div className="free-badge-top">Free</div>}
                    {session.spotsLeft <= 3 && (
                      <div className="spots-warning">🔥 {session.spotsLeft} spots!</div>
                    )}
                  </div>

                  <div className="session-card-content">
                    <div className="session-header">
                      <div className="session-meta">
                        <span>{session.category}</span>
                        <span>•</span>
                        <span>{session.subCategory}</span>
                      </div>
                      <div className={`difficulty ${session.difficulty.toLowerCase()}`}>
                        {session.difficulty}
                      </div>
                    </div>

                    <h3 onClick={() => handleViewDetails(session)}>{session.title}</h3>

                    <div className="interviewer-info">
                      <div className="interviewer-avatar">{getInitials(session.interviewer)}</div>
                      <div>
                        <div>{session.interviewer}</div>
                        <small>{session.interviewerRole}</small>
                      </div>
                    </div>

                    <div className="session-features">
                      <span>⏱️ {formatDuration(session.duration)}</span>
                      <span>📅 {formatDate(session.date)} at {session.time}</span>
                      <span>🌐 {session.languages.join(', ')}</span>
                    </div>

                    <div className="session-tags">
                      {session.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>

                    <div className="session-footer">
                      <div className="session-stats">
                        <span>⭐ {session.rating} ({session.reviews})</span>
                        <span>{session.spotsLeft}/{session.totalSpots} spots</span>
                      </div>

                      <button 
                        className="book-btn"
                        onClick={() => handleBookNow(session)}
                        disabled={session.spotsLeft === 0}
                      >
                        {session.spotsLeft === 0 ? 'Full' : 'Book Now'} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Your Sessions Section */}
      {!loading && (userBookings.length > 0 || pastBookings.length > 0) && (
        <div className="your-sessions">
          <div className="section-header">
            <div>
              <h2>Your Sessions</h2>
              <div className="booking-stats">
                <span className="stat-item">
                  <span className="stat-value">{bookingStats.upcoming}</span>
                  <span>Upcoming</span>
                </span>
                <span className="stat-item">
                  <span className="stat-value">{bookingStats.completed}</span>
                  <span>Completed</span>
                </span>
                <span className="stat-item">
                  <span className="stat-value">{bookingStats.total}</span>
                  <span>Total</span>
                </span>
              </div>
            </div>
            <div className="section-actions">
              <button 
                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({userBookings.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past ({pastBookings.length})
              </button>
              <button className="view-link" onClick={handleViewAllBookings}>
                View all →
              </button>
            </div>
          </div>

          {/* Upcoming Bookings */}
          {activeTab === 'upcoming' && (
            <div className="booking-cards">
              {userBookings.slice(0, 3).map(booking => {
                const daysUntil = getDaysUntil(booking.date);
                return (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-time">
                      <span className="booking-date">{formatDate(booking.date)}</span>
                      <span className="booking-time-detail">{booking.time}</span>
                      {daysUntil <= 1 && (
                        <span className="booking-urgent">
                          {daysUntil === 0 ? 'Today' : 'Tomorrow'}
                        </span>
                      )}
                    </div>
                    <div className="booking-details">
                      <h4>{booking.title}</h4>
                      <p>with {booking.interviewer}</p>
                      {booking.preparationLevel && (
                        <span className="meta-tag">Level: {booking.preparationLevel}</span>
                      )}
                    </div>
                    <div className="booking-actions">
                      {daysUntil <= 0 && (
                        <button className="booking-action join" onClick={() => handleJoinSession(booking)}>
                          Join
                        </button>
                      )}
                      <button className="booking-action" onClick={() => handleRescheduleClick(booking)}>
                        Reschedule
                      </button>
                      <button className="booking-action cancel" onClick={() => handleCancelClick(booking)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past Bookings */}
          {activeTab === 'past' && (
            <div className="past-bookings">
              {pastBookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="past-booking-card">
                  <div className="past-booking-time">
                    <span>{formatDate(booking.date)}</span>
                    <span>{booking.time}</span>
                  </div>
                  <div className="past-booking-details">
                    <h4>{booking.title}</h4>
                    <p>with {booking.interviewer}</p>
                    <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <button className="booking-action" onClick={() => {
                    const session = sessions.find(s => s.id === booking.sessionId);
                    if (session) handleViewDetails(session);
                  }}>
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Topics */}
      <div className="popular-topics">
        <h2>Popular Interview Topics</h2>
        <div className="topics-grid">
          {popularTopics.map(topic => (
            <div key={topic.id} className="topic-card" onClick={() => handleTopicClick(topic)}>
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-name">{topic.name}</span>
              <span className="topic-count">{topic.count} sessions</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Want to become an interviewer?</h2>
          <p>Share your expertise and help others succeed in their interviews</p>
          {interviewerApplications.length > 0 && (
            <div className="application-status">
              <span>{interviewerApplications.length} application(s) pending</span>
            </div>
          )}
        </div>
        <div className="cta-actions">
          <button className="cta-btn primary" onClick={handleApplyAsInterviewer}>
            Apply as Interviewer →
          </button>
          <button className="cta-btn secondary" onClick={handleAddSession}>
            Add Session +
          </button>
        </div>
      </div>

      {/* Interviewer Application Modal */}
      {showInterviewerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowInterviewerModal(false)}>×</button>
            <h2>Apply as Interviewer</h2>
            <p className="modal-subtitle">Share your expertise and help others succeed</p>
            
            <form onSubmit={handleInterviewerSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={interviewerForm.name}
                  onChange={(e) => setInterviewerForm({...interviewerForm, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={interviewerForm.email}
                  onChange={(e) => setInterviewerForm({...interviewerForm, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expertise *</label>
                  <select
                    required
                    value={interviewerForm.expertise}
                    onChange={(e) => setInterviewerForm({...interviewerForm, expertise: e.target.value})}
                  >
                    <option value="">Select expertise</option>
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="system-design">System Design</option>
                    <option value="frontend">Frontend</option>
                    <option value="data-science">Data Science</option>
                    <option value="product">Product Management</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience (years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={interviewerForm.experience}
                    onChange={(e) => setInterviewerForm({...interviewerForm, experience: e.target.value})}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Company *</label>
                  <input
                    type="text"
                    required
                    value={interviewerForm.company}
                    onChange={(e) => setInterviewerForm({...interviewerForm, company: e.target.value})}
                    placeholder="Google, Microsoft, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Current Role *</label>
                  <input
                    type="text"
                    required
                    value={interviewerForm.role}
                    onChange={(e) => setInterviewerForm({...interviewerForm, role: e.target.value})}
                    placeholder="Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio / Introduction *</label>
                <textarea
                  required
                  value={interviewerForm.bio}
                  onChange={(e) => setInterviewerForm({...interviewerForm, bio: e.target.value})}
                  placeholder="Tell us about your experience and why you want to be an interviewer..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>LinkedIn Profile (Optional)</label>
                  <input
                    type="url"
                    value={interviewerForm.linkedin}
                    onChange={(e) => setInterviewerForm({...interviewerForm, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Profile (Optional)</label>
                  <input
                    type="url"
                    value={interviewerForm.github}
                    onChange={(e) => setInterviewerForm({...interviewerForm, github: e.target.value})}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowAddSessionModal(false)}>×</button>
            <h2>Add New Session</h2>
            <p className="modal-subtitle">Create a new mock interview session</p>
            
            <form onSubmit={handleSessionSubmit}>
              <div className="form-group">
                <label>Session Title *</label>
                <input
                  type="text"
                  required
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                  placeholder="e.g., Advanced System Design Interview"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    required
                    value={sessionForm.type}
                    onChange={(e) => setSessionForm({...sessionForm, type: e.target.value})}
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="system-design">System Design</option>
                    <option value="frontend">Frontend</option>
                    <option value="data-science">Data Science</option>
                    <option value="product">Product</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty *</label>
                  <select
                    required
                    value={sessionForm.difficulty}
                    onChange={(e) => setSessionForm({...sessionForm, difficulty: e.target.value})}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.category}
                    onChange={(e) => setSessionForm({...sessionForm, category: e.target.value})}
                    placeholder="e.g., Engineering"
                  />
                </div>

                <div className="form-group">
                  <label>Sub Category *</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.subCategory}
                    onChange={(e) => setSessionForm({...sessionForm, subCategory: e.target.value})}
                    placeholder="e.g., Software Development"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({...sessionForm, duration: parseInt(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Total Spots *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={sessionForm.totalSpots}
                    onChange={(e) => setSessionForm({...sessionForm, totalSpots: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    required
                    value={sessionForm.time}
                    onChange={(e) => setSessionForm({...sessionForm, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={sessionForm.price}
                    onChange={(e) => setSessionForm({...sessionForm, price: parseInt(e.target.value)})}
                  />
                </div>

                <div className="form-group">
                  <label>Languages *</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.languages.join(', ')}
                    onChange={(e) => setSessionForm({...sessionForm, languages: e.target.value.split(',').map(l => l.trim())})}
                    placeholder="English, Spanish, etc."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={sessionForm.tags}
                  onChange={(e) => setSessionForm({...sessionForm, tags: e.target.value})}
                  placeholder="React, JavaScript, Algorithms"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
                  placeholder="Describe what participants will learn..."
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-btn">Add Session</button>
            </form>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && selectedTopic && (
        <div className="modal-overlay">
          <div className="modal topic-modal">
            <button className="modal-close" onClick={() => setShowTopicModal(false)}>×</button>
            
            <div className="topic-header">
              <span className="topic-icon-large">{selectedTopic.icon}</span>
              <div>
                <h2>{selectedTopic.name}</h2>
                <p className="topic-count">{selectedTopic.count} sessions available</p>
              </div>
            </div>

            <div className="topic-description">
              <p>{selectedTopic.description}</p>
            </div>

            <div className="topic-resources">
              <h3>📚 Recommended Resources</h3>
              <div className="resources-list">
                {selectedTopic.resources.map((resource, index) => (
                  <div 
                    key={index} 
                    className="resource-item"
                    onClick={() => handleResourceClick(resource.url)}
                  >
                    <span className="resource-type">{resource.type}</span>
                    <span className="resource-name">{resource.name}</span>
                    <span className="resource-link">→</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="topic-sessions">
              <h3>🎯 Related Sessions</h3>
              <div className="related-sessions-list">
                {sessions
                  .filter(s => s.tags.some(tag => 
                    tag.toLowerCase().includes(selectedTopic.name.toLowerCase())
                  ))
                  .slice(0, 3)
                  .map(session => (
                    <div 
                      key={session.id} 
                      className="related-session-item"
                      onClick={() => {
                        setShowTopicModal(false);
                        handleViewDetails(session);
                      }}
                    >
                      <div className="related-session-info">
                        <h4>{session.title}</h4>
                        <p>with {session.interviewer}</p>
                      </div>
                      <div className="related-session-meta">
                        <span className="spots">{session.spotsLeft} spots</span>
                        <span className="price">
                          {session.price === 0 ? 'Free' : `$${session.price}`}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button 
              className="view-all-btn"
              onClick={handleViewAllTopicSessions}
            >
              View All {selectedTopic.name} Sessions →
            </button>
          </div>
        </div>
      )}

      {/* View All Bookings Modal */}
      {showAllBookingsModal && (
        <div className="modal-overlay">
          <div className="modal all-bookings-modal">
            <button className="modal-close" onClick={() => setShowAllBookingsModal(false)}>×</button>
            <h2>All Your Sessions</h2>
            
            <div className="all-bookings-tabs">
              <button 
                className={activeTab === 'upcoming' ? 'active' : ''}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({userBookings.length})
              </button>
              <button 
                className={activeTab === 'past' ? 'active' : ''}
                onClick={() => setActiveTab('past')}
              >
                Past ({pastBookings.length})
              </button>
            </div>

            <div className="all-bookings-list">
              {activeTab === 'upcoming' && userBookings.map(booking => (
                <div key={booking.id} className="all-booking-item">
                  <div className="all-booking-info">
                    <span className="booking-date">{formatDate(booking.date)} at {booking.time}</span>
                    <h4>{booking.title}</h4>
                    <p>with {booking.interviewer} • {booking.interviewerCompany}</p>
                    {booking.preparationLevel && (
                      <span className="meta-tag">Level: {booking.preparationLevel}</span>
                    )}
                  </div>
                  <div className="all-booking-actions">
                    {getDaysUntil(booking.date) <= 0 && (
                      <button className="booking-action join" onClick={() => handleJoinSession(booking)}>
                        Join
                      </button>
                    )}
                    <button className="booking-action" onClick={() => handleRescheduleClick(booking)}>
                      Reschedule
                    </button>
                    <button className="booking-action cancel" onClick={() => handleCancelClick(booking)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))}

              {activeTab === 'past' && pastBookings.map(booking => (
                <div key={booking.id} className="all-booking-item">
                  <div className="all-booking-info">
                    <span className="booking-date">{formatDate(booking.date)} at {booking.time}</span>
                    <h4>{booking.title}</h4>
                    <p>with {booking.interviewer} • {booking.interviewerCompany}</p>
                    <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <button className="booking-action" onClick={() => {
                    const session = sessions.find(s => s.id === booking.sessionId);
                    if (session) handleViewDetails(session);
                  }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedSession && (
        <div className="modal-overlay">
          <div className="modal booking-modal">
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            <h2>Book Session</h2>
            
            <div className="booking-summary">
              <img src={selectedSession.image} alt={selectedSession.title} />
              <div className="booking-summary-info">
                <h3>{selectedSession.title}</h3>
                <p className="interviewer">with {selectedSession.interviewer}</p>
                <p className="datetime">📅 {formatDate(selectedSession.date)} at {selectedSession.time}</p>
                <p className="duration">⏱️ {formatDuration(selectedSession.duration)}</p>
                {selectedSession.price === 0 ? 
                  <span className="free-badge-large">Free</span> : 
                  <span className="price-large">${selectedSession.price}</span>
                }
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label>Experience Level *</label>
                <select
                  required
                  value={bookingForm.preparationLevel}
                  onChange={(e) => setBookingForm({...bookingForm, preparationLevel: e.target.value})}
                >
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                </select>
              </div>

              <div className="form-group">
                <label>What are your goals for this session? *</label>
                <textarea
                  required
                  value={bookingForm.goals}
                  onChange={(e) => setBookingForm({...bookingForm, goals: e.target.value})}
                  placeholder="Tell us what you want to focus on..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Specific questions or topics to cover (Optional)</label>
                <textarea
                  value={bookingForm.questions}
                  onChange={(e) => setBookingForm({...bookingForm, questions: e.target.value})}
                  placeholder="Any specific questions you'd like to discuss?"
                  rows="2"
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  checked={bookingForm.agreeToTerms}
                  onChange={(e) => setBookingForm({...bookingForm, agreeToTerms: e.target.checked})}
                />
                I agree to the Terms of Service and Privacy Policy
              </label>

              <button type="submit" className="submit-btn">Confirm Booking</button>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h2>Cancel Booking</h2>
            <p>Are you sure you want to cancel this session?</p>
            
            <div className="confirm-details">
              <p><strong>Session:</strong> {selectedBooking.title}</p>
              <p><strong>Date:</strong> {formatDate(selectedBooking.date)} at {selectedBooking.time}</p>
              <p><strong>Interviewer:</strong> {selectedBooking.interviewer}</p>
            </div>

            <p className="warning-text">This action cannot be undone.</p>

            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowCancelConfirmModal(false)}>
                No, Keep It
              </button>
              <button className="confirm-btn" onClick={handleConfirmCancel}>
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowRescheduleModal(false)}>×</button>
            <h2>Reschedule Session</h2>
            
            <div className="current-session-info">
              <p><strong>Current:</strong> {formatDate(selectedBooking.date)} at {selectedBooking.time}</p>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>New Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleForm.newDate}
                    onChange={(e) => setRescheduleForm({...rescheduleForm, newDate: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>New Time *</label>
                  <input
                    type="time"
                    required
                    value={rescheduleForm.newTime}
                    onChange={(e) => setRescheduleForm({...rescheduleForm, newTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for rescheduling (Optional)</label>
                <textarea
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, reason: e.target.value})}
                  placeholder="Let us know why you need to reschedule..."
                  rows="3"
                />
              </div>

              <button type="submit" className="submit-btn">Confirm Reschedule</button>
            </form>
          </div>
        </div>
      )}

      {/* Session Details Modal */}
      {showSessionDetailsModal && selectedSession && (
        <div className="modal-overlay">
          <div className="modal details-modal">
            <button className="modal-close" onClick={() => setShowSessionDetailsModal(false)}>×</button>
            <h2>{selectedSession.title}</h2>
            
            <div className="details-content">
              <img src={selectedSession.image} alt={selectedSession.title} className="details-image" />
              
              <div className="details-info">
                <div className="details-interviewer">
                  <div className="interviewer-avatar-large">
                    {getInitials(selectedSession.interviewer)}
                  </div>
                  <div>
                    <h3>{selectedSession.interviewer}</h3>
                    <p>{selectedSession.interviewerRole} at {selectedSession.interviewerCompany}</p>
                  </div>
                </div>

                <div className="details-meta">
                  <span>⏱️ {formatDuration(selectedSession.duration)}</span>
                  <span>📅 {formatDate(selectedSession.date)} at {selectedSession.time}</span>
                  <span>🌐 {selectedSession.languages.join(', ')}</span>
                </div>

                <div className="details-section">
                  <h4>About this session</h4>
                  <p>{selectedSession.description}</p>
                </div>

                {selectedSession.prerequisites && selectedSession.prerequisites.length > 0 && (
                  <div className="details-section">
                    <h4>Prerequisites</h4>
                    <ul>
                      {selectedSession.prerequisites.map((req, i) => (
                        <li key={i}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSession.learningOutcomes && selectedSession.learningOutcomes.length > 0 && (
                  <div className="details-section">
                    <h4>What you'll learn</h4>
                    <ul>
                      {selectedSession.learningOutcomes.map((outcome, i) => (
                        <li key={i}>✓ {outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="details-tags">
                  {selectedSession.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="details-footer">
                  <div className="rating">
                    <span>⭐ {selectedSession.rating}</span>
                    <span>({selectedSession.reviews} reviews)</span>
                  </div>
                  <div className={`spots-left ${selectedSession.spotsLeft <= 3 ? 'warning' : ''}`}>
                    {selectedSession.spotsLeft} spots left
                  </div>
                </div>

                <button 
                  className="book-btn details-book-btn"
                  onClick={() => {
                    setShowSessionDetailsModal(false);
                    handleBookNow(selectedSession);
                  }}
                  disabled={selectedSession.spotsLeft === 0}
                >
                  {selectedSession.spotsLeft === 0 ? 'Fully Booked' : 'Book This Session'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSessionsDashboard;