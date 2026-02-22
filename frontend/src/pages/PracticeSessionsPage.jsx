import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './PracticeSessionsPage.css';

const PracticeSessionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  
  // State Management
  const [activeView, setActiveView] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkedSessions, setBookmarkedSessions] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [compareSessions, setCompareSessions] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSession, setShareSession] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    sessionId: null,
    date: null,
    time: null,
    preparation: [],
    notes: '',
    agreement: false
  });
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    searchTime: 0,
    matchedFields: {}
  });

  // Image loading states for each session
  const [imageStates, setImageStates] = useState({});
  const [imageRefs, setImageRefs] = useState({});

  // Filters state
  const [filters, setFilters] = useState({
    difficulty: [],
    duration: [],
    price: ['free', 'paid'],
    availability: 'all',
    languages: [],
    interviewers: [],
    tags: [],
    rating: 0,
    dateRange: { start: '', end: '' }
  });

  // Fallback images array for variety
  const fallbackImages = [
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  ];

  // Mock data for sessions (enhanced)
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'Technical Interview Masterclass',
      type: 'technical',
      category: 'Engineering',
      subCategory: 'Software Development',
      difficulty: 'Hard',
      duration: '90 min',
      price: 49.99,
      isFree: false,
      rating: 4.8,
      reviews: 234,
      students: 1200,
      interviewer: {
        id: 101,
        name: 'Sarah Johnson',
        role: 'Senior Software Engineer @ Google',
        avatar: '👩‍💼',
        experience: '10+ years',
        rating: 4.9,
        totalSessions: 456,
        languages: ['English', 'Spanish'],
        expertise: ['Algorithms', 'System Design', 'Python'],
        availability: ['Mon', 'Wed', 'Fri']
      },
      topics: ['Algorithms', 'System Design', 'Data Structures'],
      description: 'Master technical interviews with comprehensive practice sessions covering algorithms, system design, and problem-solving strategies.',
      longDescription: 'This intensive masterclass is designed to help you ace technical interviews at top tech companies. You will work on real interview questions, receive personalized feedback, and learn proven strategies from experienced interviewers.',
      curriculum: [
        'Week 1: Data Structures Deep Dive',
        'Week 2: Algorithm Optimization',
        'Week 3: System Design Fundamentals',
        'Week 4: Mock Interviews & Feedback'
      ],
      prerequisites: ['Basic programming knowledge', 'Familiarity with at least one programming language'],
      nextSession: '2024-02-15T10:00:00',
      availableSeats: 15,
      totalSeats: 30,
      spotsLeft: 3,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Popular', 'Bestseller'],
      languages: ['JavaScript', 'Python', 'Java'],
      format: 'Live Online',
      includes: ['Recording', 'Slides', 'Practice Problems', 'Certificate'],
      schedule: [
        { date: '2024-02-15', slots: ['10:00', '14:00', '18:00'] },
        { date: '2024-02-16', slots: ['11:00', '15:00', '19:00'] },
        { date: '2024-02-17', slots: ['09:00', '13:00', '17:00'] }
      ],
      searchKeywords: ['algorithms', 'coding', 'tech', 'google', 'software engineer']
    },
    {
      id: 2,
      title: 'Behavioral Interview Workshop',
      type: 'behavioral',
      category: 'Soft Skills',
      subCategory: 'Leadership',
      difficulty: 'Medium',
      duration: '60 min',
      price: 0,
      isFree: true,
      rating: 4.9,
      reviews: 189,
      students: 950,
      interviewer: {
        id: 102,
        name: 'Mike Chen',
        role: 'HR Director @ Amazon',
        avatar: '👨‍💼',
        experience: '15+ years',
        rating: 4.8,
        totalSessions: 312,
        languages: ['English', 'Mandarin'],
        expertise: ['Leadership', 'STAR Method', 'Communication'],
        availability: ['Tue', 'Thu', 'Sat']
      },
      topics: ['STAR Method', 'Leadership', 'Communication'],
      description: 'Learn to ace behavioral interviews using the STAR method and real-world scenarios.',
      longDescription: 'This workshop focuses on mastering behavioral interviews through practical exercises and personalized feedback. Learn how to structure your answers, highlight your achievements, and make a lasting impression.',
      curriculum: [
        'Module 1: Understanding Behavioral Interviews',
        'Module 2: STAR Method Mastery',
        'Module 3: Common Questions & Answers',
        'Module 4: Mock Interview Practice'
      ],
      prerequisites: ['No prior experience required'],
      nextSession: '2024-02-16T14:00:00',
      availableSeats: 8,
      totalSeats: 20,
      spotsLeft: 5,
      image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Free', 'Workshop'],
      languages: ['English'],
      format: 'Live Online',
      includes: ['Worksheet', 'Sample Answers', 'Recording'],
      schedule: [
        { date: '2024-02-16', slots: ['14:00', '16:00', '18:00'] },
        { date: '2024-02-17', slots: ['10:00', '12:00', '15:00'] }
      ],
      searchKeywords: ['behavioral', 'hr', 'star method', 'amazon', 'leadership']
    },
    {
      id: 3,
      title: 'System Design Deep Dive',
      type: 'system-design',
      category: 'Engineering',
      subCategory: 'Architecture',
      difficulty: 'Hard',
      duration: '120 min',
      price: 79.99,
      isFree: false,
      rating: 4.9,
      reviews: 156,
      students: 750,
      interviewer: {
        id: 103,
        name: 'Alex Rivera',
        role: 'Staff Engineer @ Netflix',
        avatar: '👨‍🔬',
        experience: '12+ years',
        rating: 4.9,
        totalSessions: 234,
        languages: ['English', 'Spanish'],
        expertise: ['Scalability', 'Microservices', 'Cloud Architecture'],
        availability: ['Mon', 'Wed', 'Fri']
      },
      topics: ['Scalability', 'Microservices', 'Database Design'],
      description: 'Design large-scale systems used by millions of users with expert guidance.',
      longDescription: 'Learn to design scalable, reliable, and efficient systems from a staff engineer at Netflix. This course covers real-world architecture patterns and includes hands-on design exercises.',
      curriculum: [
        'Part 1: Requirements Gathering',
        'Part 2: High-Level Design',
        'Part 3: Deep Dive Components',
        'Part 4: Scaling & Optimization'
      ],
      prerequisites: ['Understanding of basic system concepts', 'Some coding experience'],
      nextSession: '2024-02-17T15:00:00',
      availableSeats: 5,
      totalSeats: 15,
      spotsLeft: 2,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Advanced', 'Popular'],
      languages: ['English'],
      format: 'Live Online',
      includes: ['Diagrams', 'Case Studies', 'Recording', 'Slides'],
      schedule: [
        { date: '2024-02-17', slots: ['15:00', '18:00'] },
        { date: '2024-02-18', slots: ['14:00', '17:00'] }
      ],
      searchKeywords: ['system design', 'architecture', 'netflix', 'scalability', 'microservices']
    },
    {
      id: 4,
      title: 'Frontend Interview Prep',
      type: 'frontend',
      category: 'Engineering',
      subCategory: 'Frontend',
      difficulty: 'Medium',
      duration: '75 min',
      price: 39.99,
      isFree: false,
      rating: 4.7,
      reviews: 142,
      students: 680,
      interviewer: {
        id: 104,
        name: 'Emily Rodriguez',
        role: 'Lead Frontend Engineer @ Meta',
        avatar: '👩‍💻',
        experience: '8+ years',
        rating: 4.8,
        totalSessions: 189,
        languages: ['English', 'French'],
        expertise: ['React', 'JavaScript', 'CSS', 'Performance'],
        availability: ['Tue', 'Thu', 'Sat']
      },
      topics: ['React', 'JavaScript', 'CSS', 'Performance'],
      description: 'Master frontend interviews with focus on React, modern JavaScript, and web performance.',
      longDescription: 'Comprehensive preparation for frontend engineering interviews covering modern frameworks, browser APIs, and performance optimization techniques.',
      curriculum: [
        'Section 1: JavaScript Fundamentals',
        'Section 2: React Deep Dive',
        'Section 3: CSS & Layouts',
        'Section 4: Performance Optimization'
      ],
      prerequisites: ['Experience with React', 'JavaScript proficiency'],
      nextSession: '2024-02-18T13:00:00',
      availableSeats: 12,
      totalSeats: 25,
      spotsLeft: 4,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Frontend'],
      languages: ['JavaScript', 'TypeScript'],
      format: 'Live Online',
      includes: ['Code Examples', 'Exercises', 'Recording'],
      schedule: [
        { date: '2024-02-18', slots: ['13:00', '16:00', '19:00'] },
        { date: '2024-02-19', slots: ['10:00', '14:00'] }
      ],
      searchKeywords: ['frontend', 'react', 'javascript', 'css', 'meta', 'ui']
    },
    {
      id: 5,
      title: 'Data Science Interview Bootcamp',
      type: 'data-science',
      category: 'Data',
      subCategory: 'Machine Learning',
      difficulty: 'Hard',
      duration: '90 min',
      price: 59.99,
      isFree: false,
      rating: 4.8,
      reviews: 98,
      students: 420,
      interviewer: {
        id: 105,
        name: 'David Kim',
        role: 'Data Science Lead @ Microsoft',
        avatar: '👨‍💻',
        experience: '10+ years',
        rating: 4.9,
        totalSessions: 156,
        languages: ['English', 'Korean'],
        expertise: ['Python', 'ML', 'Statistics', 'SQL'],
        availability: ['Mon', 'Wed', 'Fri']
      },
      topics: ['Python', 'ML Algorithms', 'Statistics', 'SQL'],
      description: 'Intensive bootcamp covering data science interview questions and case studies.',
      longDescription: 'Prepare for data science roles with comprehensive coverage of machine learning, statistical analysis, and real-world case studies.',
      curriculum: [
        'Day 1: Statistics & Probability',
        'Day 2: Machine Learning Algorithms',
        'Day 3: Python Coding',
        'Day 4: Case Studies'
      ],
      prerequisites: ['Python knowledge', 'Basic statistics'],
      nextSession: '2024-02-19T09:00:00',
      availableSeats: 8,
      totalSeats: 20,
      spotsLeft: 6,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Bootcamp'],
      languages: ['Python', 'R', 'SQL'],
      format: 'Live Online',
      includes: ['Notebooks', 'Datasets', 'Recording'],
      schedule: [
        { date: '2024-02-19', slots: ['09:00', '13:00', '17:00'] },
        { date: '2024-02-20', slots: ['10:00', '14:00'] }
      ],
      searchKeywords: ['data science', 'machine learning', 'python', 'microsoft', 'analytics']
    },
    {
      id: 6,
      title: 'Product Management Interview Prep',
      type: 'product',
      category: 'Product',
      subCategory: 'Strategy',
      difficulty: 'Medium',
      duration: '60 min',
      price: 0,
      isFree: true,
      rating: 4.9,
      reviews: 167,
      students: 890,
      interviewer: {
        id: 106,
        name: 'Lisa Wang',
        role: 'Product Director @ Google',
        avatar: '👩‍💼',
        experience: '12+ years',
        rating: 4.9,
        totalSessions: 278,
        languages: ['English', 'Mandarin'],
        expertise: ['Product Strategy', 'Metrics', 'User Research'],
        availability: ['Tue', 'Thu', 'Sat']
      },
      topics: ['Product Strategy', 'Metrics', 'Case Studies', 'User Research'],
      description: 'Comprehensive preparation for product management interviews with real case studies.',
      longDescription: 'Learn to tackle product management interviews with confidence. This workshop covers product sense, strategy, execution, and leadership scenarios.',
      curriculum: [
        'Session 1: Product Sense',
        'Session 2: Strategy & Metrics',
        'Session 3: Execution',
        'Session 4: Leadership'
      ],
      prerequisites: ['Interest in product management'],
      nextSession: '2024-02-20T16:00:00',
      availableSeats: 15,
      totalSeats: 30,
      spotsLeft: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      tags: ['Free', 'Popular'],
      languages: ['English'],
      format: 'Live Online',
      includes: ['Templates', 'Case Studies', 'Recording'],
      schedule: [
        { date: '2024-02-20', slots: ['16:00', '18:00'] },
        { date: '2024-02-21', slots: ['11:00', '14:00', '17:00'] }
      ],
      searchKeywords: ['product management', 'pm', 'strategy', 'google', 'product']
    }
  ]);

  // Handle image load and portrait detection
  const handleImageLoad = (sessionId, imgElement) => {
    if (imgElement) {
      const isPortrait = imgElement.naturalHeight > imgElement.naturalWidth;
      setImageStates(prev => ({
        ...prev,
        [sessionId]: {
          loaded: true,
          portrait: isPortrait,
          error: false
        }
      }));
    }
  };

  const handleImageError = (sessionId) => {
    setImageStates(prev => ({
      ...prev,
      [sessionId]: {
        loaded: false,
        portrait: false,
        error: true
      }
    }));
  };

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Categories with icons and counts
  const categories = useMemo(() => [
    { id: 'all', name: 'All Sessions', icon: '📚', count: sessions.length },
    { id: 'technical', name: 'Technical', icon: '💻', count: sessions.filter(s => s.type === 'technical').length },
    { id: 'behavioral', name: 'Behavioral', icon: '🎯', count: sessions.filter(s => s.type === 'behavioral').length },
    { id: 'system-design', name: 'System Design', icon: '🏗️', count: sessions.filter(s => s.type === 'system-design').length },
    { id: 'frontend', name: 'Frontend', icon: '🎨', count: sessions.filter(s => s.type === 'frontend').length },
    { id: 'data-science', name: 'Data Science', icon: '📊', count: sessions.filter(s => s.type === 'data-science').length },
    { id: 'product', name: 'Product', icon: '📱', count: sessions.filter(s => s.type === 'product').length }
  ], [sessions]);

  // Filter options
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const durations = ['< 30 min', '30-60 min', '60-90 min', '90+ min'];
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'SQL', 'R', 'Go'];
  const allInterviewers = useMemo(() => 
    [...new Set(sessions.map(s => s.interviewer.name))], [sessions]
  );
  const allTags = useMemo(() => 
    [...new Set(sessions.flatMap(s => s.tags))], [sessions]
  );

  // Enhanced search function with relevance scoring
  const searchSessions = useCallback((query) => {
    const startTime = performance.now();
    
    if (!query.trim()) {
      setSearchSuggestions([]);
      return sessions;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    
    const results = sessions.map(session => {
      let score = 0;
      const matchedFields = {
        title: false,
        description: false,
        interviewer: false,
        topics: [],
        tags: [],
        keywords: []
      };

      // Search in title (highest weight)
      if (session.title.toLowerCase().includes(query.toLowerCase())) {
        score += 10;
        matchedFields.title = true;
      }

      // Search in description
      if (session.description.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
        matchedFields.description = true;
      }

      // Search in long description
      if (session.longDescription?.toLowerCase().includes(query.toLowerCase())) {
        score += 3;
      }

      // Search in interviewer name
      if (session.interviewer.name.toLowerCase().includes(query.toLowerCase())) {
        score += 8;
        matchedFields.interviewer = true;
      }

      // Search in topics
      session.topics.forEach(topic => {
        if (topic.toLowerCase().includes(query.toLowerCase())) {
          score += 4;
          matchedFields.topics.push(topic);
        }
      });

      // Search in tags
      session.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          score += 3;
          matchedFields.tags.push(tag);
        }
      });

      // Search in search keywords
      session.searchKeywords?.forEach(keyword => {
        if (keyword.includes(query.toLowerCase())) {
          score += 2;
          matchedFields.keywords.push(keyword);
        }
      });

      // Search in languages
      session.languages.forEach(lang => {
        if (lang.toLowerCase().includes(query.toLowerCase())) {
          score += 2;
        }
      });

      // Search in interviewer expertise
      session.interviewer.expertise.forEach(skill => {
        if (skill.toLowerCase().includes(query.toLowerCase())) {
          score += 3;
        }
      });

      // Boost score for exact matches
      if (session.title.toLowerCase() === query.toLowerCase()) {
        score += 20;
      }

      return { ...session, searchScore: score, matchedFields };
    })
    .filter(session => session.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);

    const endTime = performance.now();
    setSearchStats({
      totalResults: results.length,
      searchTime: endTime - startTime,
      matchedFields: results[0]?.matchedFields || {}
    });

    // Generate search suggestions
    if (query.length > 1) {
      const suggestions = [];
      
      // Add matching session titles
      results.slice(0, 3).forEach(r => {
        if (!suggestions.includes(r.title)) {
          suggestions.push(r.title);
        }
      });

      // Add matching topics
      sessions.forEach(s => {
        s.topics.forEach(topic => {
          if (topic.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(topic)) {
            suggestions.push(topic);
          }
        });
      });

      // Add matching interviewer names
      sessions.forEach(s => {
        if (s.interviewer.name.toLowerCase().includes(query.toLowerCase()) && 
            !suggestions.includes(s.interviewer.name)) {
          suggestions.push(s.interviewer.name);
        }
      });

      // Add matching tags
      sessions.forEach(s => {
        s.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(tag)) {
            suggestions.push(tag);
          }
        });
      });

      setSearchSuggestions(suggestions.slice(0, 8));
    }

    return results;
  }, [sessions]);

  // Filter sessions based on all filters and search
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Apply search first
    if (searchQuery) {
      filtered = searchSessions(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(session => session.type === selectedCategory);
    }

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(session => filters.difficulty.includes(session.difficulty));
    }

    // Apply price filter
    if (filters.price.length === 1) {
      if (filters.price[0] === 'free') {
        filtered = filtered.filter(session => session.isFree);
      } else if (filters.price[0] === 'paid') {
        filtered = filtered.filter(session => !session.isFree);
      }
    }

    // Apply price range filter
    filtered = filtered.filter(session => 
      session.price >= priceRange.min && session.price <= priceRange.max
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(session => session.rating >= filters.rating);
    }

    // Apply languages filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(session =>
        session.languages.some(lang => filters.languages.includes(lang))
      );
    }

    // Apply interviewers filter
    if (filters.interviewers.length > 0) {
      filtered = filtered.filter(session =>
        filters.interviewers.includes(session.interviewer.name)
      );
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(session =>
        session.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.nextSession);
        if (filters.dateRange.start && sessionDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && sessionDate > new Date(filters.dateRange.end)) {
          return false;
        }
        return true;
      });
    }

    return filtered;
  }, [sessions, selectedCategory, searchQuery, filters, priceRange, searchSessions]);

  // Sort sessions
  const sortedSessions = useMemo(() => {
    return [...filteredSessions].sort((a, b) => {
      switch(sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.nextSession) - new Date(a.nextSession);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'relevance':
          if (searchQuery) {
            return (b.searchScore || 0) - (a.searchScore || 0);
          }
          return 0;
        default:
          return 0;
      }
    });
  }, [filteredSessions, sortBy, searchQuery]);

  // Pagination
  const paginatedSessions = useMemo(() => {
    const start = (page - 1) * 6;
    const end = start + 6;
    return sortedSessions.slice(0, end);
  }, [sortedSessions, page]);

  // Check if has more
  useEffect(() => {
    setHasMore(paginatedSessions.length < sortedSessions.length);
  }, [paginatedSessions.length, sortedSessions.length]);

  // Save search to history
  const saveSearchToHistory = useCallback((query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  }, [searchHistory]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchSuggestions(value.length > 0);
    setPage(1);
  }, []);

  // Handle search submit
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery);
      setShowSearchSuggestions(false);
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  }, [searchQuery, saveSearchToHistory, recentSearches]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    saveSearchToHistory(suggestion);
    setShowSearchSuggestions(false);
    // Focus back on input after selection
    searchInputRef.current?.focus();
  }, [saveSearchToHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
    setPage(1);
    searchInputRef.current?.focus();
  }, []);

  // Load bookmarked sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedSessions');
    if (saved) {
      setBookmarkedSessions(JSON.parse(saved));
    }
    
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }
  }, []);

  // Handlers
  const handleQuickView = useCallback((session) => {
    setSelectedSession(session);
    setShowQuickView(true);
    
    // Add to recently viewed
    const updated = [session, ...recentlyViewed.filter(s => s.id !== session.id)].slice(0, 5);
    setRecentlyViewed(updated);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }, [recentlyViewed]);

  const handleBookSession = useCallback((sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    setSelectedSession(session);
    setBookingData({ ...bookingData, sessionId });
    setShowBookingModal(true);
    setBookingStep(1);
  }, [sessions, bookingData]);

  const handleBookmark = useCallback((session) => {
    setBookmarkedSessions(prev => {
      const isBookmarked = prev.some(s => s.id === session.id);
      let updated;
      if (isBookmarked) {
        updated = prev.filter(s => s.id !== session.id);
      } else {
        updated = [...prev, session];
      }
      localStorage.setItem('bookmarkedSessions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleCompare = useCallback((session) => {
    setCompareSessions(prev => {
      if (prev.some(s => s.id === session.id)) {
        return prev.filter(s => s.id !== session.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 sessions at a time');
        return prev;
      }
      return [...prev, session];
    });
  }, []);

  const handleShare = useCallback((session) => {
    setShareSession(session);
    setShowShareModal(true);
  }, []);

  const handleReport = useCallback((session) => {
    setSelectedSession(session);
    setShowReportModal(true);
  }, []);

  const handleFeedback = useCallback((session) => {
    setSelectedSession(session);
    setShowFeedbackModal(true);
  }, []);

  const toggleFilter = useCallback((type, value) => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      return { ...prev, [type]: current };
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      difficulty: [],
      duration: [],
      price: ['free', 'paid'],
      availability: 'all',
      languages: [],
      interviewers: [],
      tags: [],
      rating: 0,
      dateRange: { start: '', end: '' }
    });
    setPriceRange({ min: 0, max: 200 });
    setSearchQuery('');
    setSelectedCategory('all');
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const handleBookingNext = useCallback(() => {
    setBookingStep(prev => prev + 1);
  }, []);

  const handleBookingBack = useCallback(() => {
    setBookingStep(prev => prev - 1);
  }, []);

  const handleBookingConfirm = useCallback(() => {
    // API call to confirm booking
    console.log('Booking confirmed:', bookingData);
    setShowBookingModal(false);
    setBookingStep(1);
    setBookingData({
      sessionId: null,
      date: null,
      time: null,
      preparation: [],
      notes: '',
      agreement: false
    });
    // Show success message
    alert('Session booked successfully! Check your email for details.');
  }, [bookingData]);

  const handleDateSelect = useCallback((date, time) => {
    setBookingData(prev => ({ ...prev, date, time }));
  }, []);

  const handlePreparationToggle = useCallback((item) => {
    setBookingData(prev => ({
      ...prev,
      preparation: prev.preparation.includes(item)
        ? prev.preparation.filter(i => i !== item)
        : [...prev.preparation, item]
    }));
  }, []);

  // Get time slots for selected date
  const getTimeSlots = useCallback((date) => {
    if (!selectedSession) return [];
    const schedule = selectedSession.schedule.find(s => s.date === date);
    return schedule ? schedule.slots : [];
  }, [selectedSession]);

  return (
    <div className="practice-sessions-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1>Practice Sessions</h1>
          <p>Enhance your interview skills with expert-led practice sessions</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{sessions.length}</span>
            <span className="stat-label">Sessions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Availability</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">150+</span>
            <span className="stat-label">Interviewers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">4.9</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <span className="search-icon">🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search sessions by title, topic, interviewer, skills, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            className="search-input"
            autoComplete="off"
          />
          {searchQuery && (
            <button type="button" className="clear-search" onClick={clearSearch}>
              ×
            </button>
          )}
          
          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">🔍</span>
                  <span className="suggestion-text">{suggestion}</span>
                </div>
              ))}
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && searchQuery.length === 0 && (
                <div className="recent-searches">
                  <div className="recent-header">Recent Searches</div>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="suggestion-item recent"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <span className="suggestion-icon">🕒</span>
                      <span className="suggestion-text">{search}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        <div className="filter-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${activeView === 'grid' ? 'active' : ''}`}
              onClick={() => setActiveView('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
              aria-label="List view"
              title="List view"
            >
              ☰
            </button>
          </div>

          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>⚙️</span>
            Filters
            {(Object.values(filters).flat().length > 2 || 
              filters.rating > 0 || 
              priceRange.min > 0 || 
              priceRange.max < 200) && (
              <span className="filter-badge">
                {Object.values(filters).flat().length + 
                 (filters.rating > 0 ? 1 : 0) + 
                 (priceRange.min > 0 || priceRange.max < 200 ? 1 : 0)}
              </span>
            )}
          </button>

          {compareSessions.length > 0 && (
            <button
              className="compare-btn"
              onClick={() => setShowComparison(true)}
            >
              🔄 Compare ({compareSessions.length})
            </button>
          )}

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            {searchQuery && <option value="relevance">Relevance</option>}
          </select>
        </div>
      </div>

      {/* Search Stats */}
      {searchQuery && (
        <div className="search-stats">
          <span>
            Found <strong>{filteredSessions.length}</strong> results for "<strong>{searchQuery}</strong>"
            {searchStats.searchTime > 0 && ` in ${searchStats.searchTime.toFixed(0)}ms`}
          </span>
          {filteredSessions.length > 0 && (
            <button className="clear-search-btn" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Categories */}
      <div className="categories-section">
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Advanced Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            {/* Difficulty Filter */}
            <div className="filter-group">
              <h4>Difficulty</h4>
              <div className="filter-options">
                {difficultyLevels.map(level => (
                  <label key={level} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(level)}
                      onChange={() => toggleFilter('difficulty', level)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="filter-group">
              <h4>Duration</h4>
              <div className="filter-options">
                {durations.map(duration => (
                  <label key={duration} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(duration)}
                      onChange={() => toggleFilter('duration', duration)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{duration}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4>Price</h4>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.price.includes('free')}
                    onChange={() => toggleFilter('price', 'free')}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="filter-label">Free</span>
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.price.includes('paid')}
                    onChange={() => toggleFilter('price', 'paid')}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="filter-label">Paid</span>
                </label>
              </div>
              
              {/* Price Range Slider */}
              <div className="price-range">
                <span>Price Range: ${priceRange.min} - ${priceRange.max}</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-filter">
                {[4, 4.5, 4.8].map(rating => (
                  <button
                    key={rating}
                    className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, rating })}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Filter */}
            <div className="filter-group">
              <h4>Languages</h4>
              <div className="filter-options scrollable">
                {languages.map(lang => (
                  <label key={lang} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleFilter('languages', lang)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interviewers Filter */}
            <div className="filter-group">
              <h4>Interviewers</h4>
              <div className="filter-options scrollable">
                {allInterviewers.map(name => (
                  <label key={name} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.interviewers.includes(name)}
                      onChange={() => toggleFilter('interviewers', name)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="filter-group">
              <h4>Tags</h4>
              <div className="filter-options scrollable">
                {allTags.map(tag => (
                  <label key={tag} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleFilter('tags', tag)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="filter-label">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="filter-group">
              <h4>Date Range</h4>
              <div className="date-range">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value }
                  })}
                  className="date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value }
                  })}
                  className="date-input"
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.difficulty.length > 0 || filters.languages.length > 0 || 
            filters.interviewers.length > 0 || filters.tags.length > 0 ||
            filters.rating > 0 || priceRange.min > 0 || priceRange.max < 200) && (
            <div className="active-filters">
              <span className="active-filters-label">Active Filters:</span>
              <div className="active-filter-tags">
                {filters.difficulty.map(d => (
                  <span key={d} className="filter-tag">
                    {d}
                    <button onClick={() => toggleFilter('difficulty', d)}>×</button>
                  </span>
                ))}
                {filters.languages.map(l => (
                  <span key={l} className="filter-tag">
                    {l}
                    <button onClick={() => toggleFilter('languages', l)}>×</button>
                  </span>
                ))}
                {filters.interviewers.map(i => (
                  <span key={i} className="filter-tag">
                    {i}
                    <button onClick={() => toggleFilter('interviewers', i)}>×</button>
                  </span>
                ))}
                {filters.tags.map(t => (
                  <span key={t} className="filter-tag">
                    {t}
                    <button onClick={() => toggleFilter('tags', t)}>×</button>
                  </span>
                ))}
                {filters.rating > 0 && (
                  <span className="filter-tag">
                    {filters.rating}+ ⭐
                    <button onClick={() => setFilters({ ...filters, rating: 0 })}>×</button>
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < 200) && (
                  <span className="filter-tag">
                    ${priceRange.min} - ${priceRange.max}
                    <button onClick={() => setPriceRange({ min: 0, max: 200 })}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && !searchQuery && selectedCategory === 'all' && Object.values(filters).flat().length <= 2 && (
        <div className="recently-viewed">
          <h3>Recently Viewed</h3>
          <div className="recently-viewed-scroll">
            {recentlyViewed.map(session => (
              <div
                key={session.id}
                className="recent-item"
                onClick={() => handleQuickView(session)}
              >
                <img src={session.image} alt={session.title} />
                <div className="recent-info">
                  <h4>{session.title}</h4>
                  <p>{session.interviewer.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        <span className="results-count">
          Showing <strong>{paginatedSessions.length}</strong> of <strong>{sortedSessions.length}</strong> {sortedSessions.length === 1 ? 'session' : 'sessions'}
        </span>
        {searchQuery && (
          <span className="search-query">
            for "<strong>{searchQuery}</strong>"
          </span>
        )}
        {filteredSessions.length === 0 && (
          <button className="clear-search-btn" onClick={clearFilters}>
            Clear all filters
          </button>
        )}
      </div>

      {/* Sessions Grid/List */}
      {loading ? (
        <div className="sessions-loading">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="session-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {sortedSessions.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No sessions found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`sessions-container ${activeView === 'grid' ? 'grid-view' : 'list-view'}`}>
              {paginatedSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  activeView={activeView}
                  bookmarkedSessions={bookmarkedSessions}
                  compareSessions={compareSessions}
                  imageStates={imageStates}
                  onImageLoad={handleImageLoad}
                  onImageError={handleImageError}
                  onQuickView={handleQuickView}
                  onBookmark={handleBookmark}
                  onCompare={handleCompare}
                  onShare={handleShare}
                  onBookSession={handleBookSession}
                  fallbackImages={fallbackImages}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Load More Button */}
      {hasMore && sortedSessions.length > 0 && (
        <div className="load-more">
          <button className="load-more-btn" onClick={loadMore}>
            Load More Sessions
          </button>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          <h2>Get Interview Tips & Updates</h2>
          <p>Subscribe to our newsletter for the latest interview strategies and session announcements</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
          <p className="privacy-note">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="stat-item">
          <span className="stat-value">{sessions.reduce((acc, s) => acc + s.students, 0).toLocaleString()}+</span>
          <span className="stat-label">Total Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{sessions.length * 3}+</span>
          <span className="stat-label">Monthly Sessions</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">98%</span>
          <span className="stat-label">Satisfaction Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>

      {/* Modals - Quick View, Booking, Share, Report, Feedback, Comparison */}
      {/* ... (modal code would go here - kept brief for brevity) ... */}
    </div>
  );
};

// SessionCard Component - Extracted for better organization with image fixes
const SessionCard = ({
  session,
  activeView,
  bookmarkedSessions,
  compareSessions,
  imageStates,
  onImageLoad,
  onImageError,
  onQuickView,
  onBookmark,
  onCompare,
  onShare,
  onBookSession,
  fallbackImages
}) => {
  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // Use a deterministic fallback based on session id
  const fallbackImage = fallbackImages[session.id % fallbackImages.length];

  useEffect(() => {
    if (imgRef.current && imageLoaded && !imageError) {
      const img = imgRef.current;
      const portrait = img.naturalHeight > img.naturalWidth;
      setIsPortrait(portrait);
      onImageLoad(session.id, img);
    }
  }, [imageLoaded, imageError, session.id, onImageLoad]);

  const handleLocalImageLoad = () => {
    setImageLoaded(true);
  };

  const handleLocalImageError = () => {
    setImageError(true);
    onImageError(session.id);
  };

  return (
    <div
      className={`session-card ${activeView === 'list' ? 'list-card' : ''} ${
        bookmarkedSessions.some(s => s.id === session.id) ? 'bookmarked' : ''
      }`}
      onClick={() => onQuickView(session)}
    >
      <div className={`session-image ${isPortrait ? 'portrait' : 'landscape'} ${imageError ? 'error' : ''}`}>
        <img
          ref={imgRef}
          src={imageError ? fallbackImage : session.image}
          alt={session.title}
          onLoad={handleLocalImageLoad}
          onError={handleLocalImageError}
          loading="lazy"
        />
        
        {/* Badge Container */}
        <div className="badge-container">
          <div className="left-badges">
            <span className="session-type-badge">{session.type}</span>
            {session.tags && session.tags.includes('Popular') && (
              <span className="popular-badge">🔥 Popular</span>
            )}
          </div>
          <div className="right-badges">
            {session.isFree && <span className="free-badge">FREE</span>}
          </div>
        </div>
        
        {/* Spots Warning */}
        {session.spotsLeft <= 3 && (
          <span className="spots-warning">{session.spotsLeft} spots!</span>
        )}
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className={`quick-action-btn bookmark-btn ${
              bookmarkedSessions.some(s => s.id === session.id) ? 'active' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(session);
            }}
            title={bookmarkedSessions.some(s => s.id === session.id) ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarkedSessions.some(s => s.id === session.id) ? '★' : '☆'}
          </button>
          <button
            className="quick-action-btn compare-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCompare(session);
            }}
            title={compareSessions.some(s => s.id === session.id) ? 'Remove from compare' : 'Add to compare'}
          >
            🔄
          </button>
          <button
            className="quick-action-btn share-btn"
            onClick={(e) => {
              e.stopPropagation();
              onShare(session);
            }}
            title="Share"
          >
            📤
          </button>
        </div>

        {/* Search Match Badge */}
        {session.searchScore > 0 && (
          <div className="search-match-badge">
            Match: {session.searchScore}
          </div>
        )}
      </div>

      <div className="session-content">
        {/* Meta Row */}
        <div className="session-meta-row">
          <div className="category-info">
            <span className="category">{session.category}</span>
            <span>·</span>
            <span className="subcategory">{session.subCategory}</span>
          </div>
          <span className={`difficulty-badge ${session.difficulty.toLowerCase()}`}>
            {session.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="session-title">{session.title}</h3>

        {/* Matched Fields */}
        {session.matchedFields && (
          <div className="matched-fields">
            {session.matchedFields.title && <span className="match-tag">Title</span>}
            {session.matchedFields.interviewer && <span className="match-tag">Interviewer</span>}
            {session.matchedFields.topics.slice(0, 2).map(t => (
              <span key={t} className="match-tag">{t}</span>
            ))}
          </div>
        )}

        {/* Interviewer Info */}
        <div className="interviewer-info">
          <div className="interviewer-avatar">
            {session.interviewer.avatar}
          </div>
          <div className="interviewer-details">
            <div className="interviewer-name">{session.interviewer.name}</div>
            <div className="interviewer-role">{session.interviewer.role}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="session-footer">
          <div className="price-section">
            {session.isFree ? (
              <span className="free-price">Free</span>
            ) : (
              <span className="price">${session.price}</span>
            )}
          </div>
          <button 
            className="book-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onBookSession(session.id);
            }}
          >
            Book Now →
          </button>
        </div>

        {/* List View Expand */}
        {activeView === 'list' && (
          <div className="session-details-expand">
            <div className="includes-section">
              <span className="label">Includes:</span>
              <div className="includes-tags">
                {session.includes.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="include-tag">{item}</span>
                ))}
              </div>
            </div>
            <div className="next-session">
              <span className="label">Next:</span>
              <span className="value">
                {new Date(session.nextSession).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeSessionsPage;