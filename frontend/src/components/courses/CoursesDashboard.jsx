import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSearch from './CourseSearch';
import CourseFilters from './CourseFilters';
import CourseRecommendations from './CourseRecommendations';
import MyLearning from './MyLearning';
import './CoursesDashboard.css';

const CoursesDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
    price: 'all',
    language: 'all',
    rating: 0,
    sortBy: 'popular'
  });
  const [myLearning, setMyLearning] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data - In real app, this would come from an API
  useEffect(() => {
    setTimeout(() => {
      const mockCourses = [
        {
          id: 1,
          title: 'Complete Data Structures & Algorithms',
          description: 'Master coding interviews with comprehensive DSA course',
          longDescription: 'This course covers everything from basic data structures to advanced algorithms. You will learn arrays, linked lists, trees, graphs, dynamic programming, and much more with hands-on coding exercises.',
          category: 'Computer Science',
          subCategory: 'Algorithms',
          level: 'Intermediate',
          duration: '40 hours',
          lessons: 120,
          quizzes: 25,
          assignments: 10,
          price: 89.99,
          isFree: false,
          rating: 4.8,
          reviews: 1250,
          students: 15000,
          language: 'English',
          prerequisites: ['Basic programming knowledge', 'Familiarity with any programming language'],
          learningOutcomes: [
            'Master all major data structures',
            'Solve complex algorithmic problems',
            'Ace technical interviews at top companies',
            'Understand time and space complexity'
          ],
          curriculum: [
            {
              section: 'Arrays & Strings',
              lessons: [
                { id: 1, title: 'Array Basics', duration: '15 min', type: 'video', free: true },
                { id: 2, title: 'Two Pointer Technique', duration: '25 min', type: 'video' },
                { id: 3, title: 'Sliding Window', duration: '30 min', type: 'video' },
                { id: 4, title: 'Array Practice Problems', duration: '45 min', type: 'assignment' }
              ]
            },
            {
              section: 'Linked Lists',
              lessons: [
                { id: 5, title: 'Singly Linked Lists', duration: '20 min', type: 'video', free: true },
                { id: 6, title: 'Doubly Linked Lists', duration: '20 min', type: 'video' },
                { id: 7, title: 'Cycle Detection', duration: '25 min', type: 'video' },
                { id: 8, title: 'Linked List Problems', duration: '40 min', type: 'assignment' }
              ]
            },
            {
              section: 'Trees & Graphs',
              lessons: [
                { id: 9, title: 'Binary Trees', duration: '30 min', type: 'video' },
                { id: 10, title: 'Binary Search Trees', duration: '35 min', type: 'video' },
                { id: 11, title: 'Graph Traversals', duration: '40 min', type: 'video' },
                { id: 12, title: 'Tree & Graph Problems', duration: '50 min', type: 'assignment' }
              ]
            }
          ],
          instructor: {
            id: 101,
            name: 'Dr. Sarah Johnson',
            title: 'Senior Software Engineer @ Google',
            avatar: '👩‍💼',
            bio: 'PhD in Computer Science with 10+ years of experience. Has conducted 1000+ technical interviews.',
            rating: 4.9,
            students: 45000,
            courses: 5,
            expertise: ['Algorithms', 'System Design', 'Machine Learning']
          },
          includes: ['Full lifetime access', 'Certificate of completion', 'Downloadable resources', 'Coding exercises'],
          image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          tags: ['Bestseller', 'Highest Rated'],
          lastUpdated: '2024-01-15',
          language: 'English',
          subtitles: ['English', 'Spanish', 'French'],
          certificate: true,
          projects: 5,
          articles: 30,
          downloadableResources: 25
        },
        {
          id: 2,
          title: 'System Design Masterclass',
          description: 'Learn to design scalable systems used by millions',
          longDescription: 'This comprehensive course covers system design fundamentals, architecture patterns, and real-world case studies from companies like Netflix, Uber, and Twitter.',
          category: 'Computer Science',
          subCategory: 'System Design',
          level: 'Advanced',
          duration: '35 hours',
          lessons: 85,
          quizzes: 15,
          assignments: 8,
          price: 129.99,
          isFree: false,
          rating: 4.9,
          reviews: 890,
          students: 12000,
          language: 'English',
          prerequisites: ['Basic understanding of distributed systems', 'Some coding experience'],
          learningOutcomes: [
            'Design scalable and reliable systems',
            'Understand microservices architecture',
            'Learn from real-world case studies',
            'Prepare for system design interviews'
          ],
          curriculum: [
            {
              section: 'System Design Basics',
              lessons: [
                { id: 1, title: 'Introduction to System Design', duration: '20 min', type: 'video', free: true },
                { id: 2, title: 'Load Balancing', duration: '30 min', type: 'video' },
                { id: 3, title: 'Caching Strategies', duration: '35 min', type: 'video' }
              ]
            },
            {
              section: 'Architecture Patterns',
              lessons: [
                { id: 4, title: 'Microservices', duration: '40 min', type: 'video' },
                { id: 5, title: 'Event-Driven Architecture', duration: '35 min', type: 'video' },
                { id: 6, title: 'Database Scaling', duration: '45 min', type: 'video' }
              ]
            }
          ],
          instructor: {
            id: 102,
            name: 'Alex Rivera',
            title: 'Staff Engineer @ Netflix',
            avatar: '👨‍🔬',
            bio: 'Staff Engineer at Netflix with expertise in distributed systems and cloud architecture.',
            rating: 4.9,
            students: 35000,
            courses: 3,
            expertise: ['System Design', 'Microservices', 'Cloud Computing']
          },
          includes: ['Full lifetime access', 'Certificate', 'Architecture diagrams', 'Case studies'],
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          tags: ['Advanced', 'Popular'],
          lastUpdated: '2024-01-10',
          language: 'English',
          subtitles: ['English', 'Japanese', 'Korean'],
          certificate: true,
          projects: 3,
          articles: 20,
          downloadableResources: 15
        },
        {
          id: 3,
          title: 'Complete Web Development Bootcamp',
          description: 'Become a full-stack developer with HTML, CSS, JavaScript, React, Node.js',
          longDescription: 'This comprehensive bootcamp covers frontend and backend development. You will build real-world projects and learn industry best practices.',
          category: 'Web Development',
          subCategory: 'Full Stack',
          level: 'Beginner',
          duration: '60 hours',
          lessons: 200,
          quizzes: 40,
          assignments: 20,
          price: 0,
          isFree: true,
          rating: 4.7,
          reviews: 2500,
          students: 50000,
          language: 'English',
          prerequisites: ['No prior experience needed'],
          learningOutcomes: [
            'Build responsive websites with HTML/CSS',
            'Master JavaScript and modern frameworks',
            'Create backend APIs with Node.js',
            'Deploy full-stack applications'
          ],
          curriculum: [
            {
              section: 'Frontend Fundamentals',
              lessons: [
                { id: 1, title: 'HTML5 Basics', duration: '30 min', type: 'video', free: true },
                { id: 2, title: 'CSS3 Styling', duration: '45 min', type: 'video' },
                { id: 3, title: 'JavaScript Essentials', duration: '60 min', type: 'video' }
              ]
            },
            {
              section: 'React Development',
              lessons: [
                { id: 4, title: 'React Components', duration: '50 min', type: 'video' },
                { id: 5, title: 'State Management', duration: '55 min', type: 'video' },
                { id: 6, title: 'React Router', duration: '40 min', type: 'video' }
              ]
            }
          ],
          instructor: {
            id: 103,
            name: 'Emily Rodriguez',
            title: 'Lead Developer @ Meta',
            avatar: '👩‍💻',
            bio: 'Lead Frontend Engineer with expertise in React and modern web technologies.',
            rating: 4.8,
            students: 60000,
            courses: 4,
            expertise: ['React', 'JavaScript', 'Node.js']
          },
          includes: ['Full lifetime access', 'Certificate', 'Projects portfolio', 'Coding challenges'],
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          tags: ['Free', 'Bestseller'],
          lastUpdated: '2024-01-20',
          language: 'English',
          subtitles: ['English', 'Spanish', 'Hindi'],
          certificate: true,
          projects: 8,
          articles: 50,
          downloadableResources: 40
        },
        {
          id: 4,
          title: 'Python for Data Science',
          description: 'Learn Python, NumPy, Pandas, Matplotlib, and Machine Learning',
          longDescription: 'This course is your complete guide to data science with Python. You will learn data analysis, visualization, and machine learning with hands-on projects.',
          category: 'Data Science',
          subCategory: 'Python',
          level: 'Intermediate',
          duration: '45 hours',
          lessons: 150,
          quizzes: 30,
          assignments: 15,
          price: 79.99,
          isFree: false,
          rating: 4.8,
          reviews: 1800,
          students: 25000,
          language: 'English',
          prerequisites: ['Basic Python knowledge'],
          learningOutcomes: [
            'Master Python for data analysis',
            'Create stunning visualizations',
            'Build machine learning models',
            'Work with real datasets'
          ],
          curriculum: [
            {
              section: 'Python Basics',
              lessons: [
                { id: 1, title: 'Python Fundamentals', duration: '40 min', type: 'video', free: true },
                { id: 2, title: 'NumPy Arrays', duration: '45 min', type: 'video' },
                { id: 3, title: 'Pandas DataFrames', duration: '50 min', type: 'video' }
              ]
            },
            {
              section: 'Data Visualization',
              lessons: [
                { id: 4, title: 'Matplotlib Basics', duration: '35 min', type: 'video' },
                { id: 5, title: 'Seaborn Library', duration: '40 min', type: 'video' },
                { id: 6, title: 'Interactive Plots', duration: '30 min', type: 'video' }
              ]
            }
          ],
          instructor: {
            id: 104,
            name: 'David Kim',
            title: 'Data Science Lead @ Microsoft',
            avatar: '👨‍💻',
            bio: 'Data Science Lead with expertise in machine learning and statistical analysis.',
            rating: 4.8,
            students: 40000,
            courses: 6,
            expertise: ['Python', 'Machine Learning', 'Statistics']
          },
          includes: ['Full lifetime access', 'Certificate', 'Jupyter notebooks', 'Datasets'],
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          tags: ['Data Science', 'Popular'],
          lastUpdated: '2024-01-05',
          language: 'English',
          subtitles: ['English', 'Chinese', 'Portuguese'],
          certificate: true,
          projects: 6,
          articles: 35,
          downloadableResources: 30
        },
        {
          id: 5,
          title: 'Product Management Certification',
          description: 'Master product strategy, roadmap, and execution',
          longDescription: 'Learn to build successful products from ideation to launch. This course covers product strategy, user research, metrics, and agile methodologies.',
          category: 'Product',
          subCategory: 'Product Management',
          level: 'Intermediate',
          duration: '30 hours',
          lessons: 90,
          quizzes: 20,
          assignments: 10,
          price: 69.99,
          isFree: false,
          rating: 4.7,
          reviews: 950,
          students: 12000,
          language: 'English',
          prerequisites: ['Interest in product management'],
          learningOutcomes: [
            'Create product roadmaps',
            'Conduct user research',
            'Define product metrics',
            'Lead cross-functional teams'
          ],
          curriculum: [
            {
              section: 'Product Strategy',
              lessons: [
                { id: 1, title: 'Product Lifecycle', duration: '25 min', type: 'video', free: true },
                { id: 2, title: 'Market Research', duration: '30 min', type: 'video' },
                { id: 3, title: 'Competitive Analysis', duration: '35 min', type: 'video' }
              ]
            },
            {
              section: 'Product Execution',
              lessons: [
                { id: 4, title: 'Agile Methodologies', duration: '40 min', type: 'video' },
                { id: 5, title: 'User Stories', duration: '25 min', type: 'video' },
                { id: 6, title: 'Product Launch', duration: '30 min', type: 'video' }
              ]
            }
          ],
          instructor: {
            id: 105,
            name: 'Lisa Wang',
            title: 'Product Director @ Google',
            avatar: '👩‍💼',
            bio: 'Product Director with 12+ years of experience launching successful products.',
            rating: 4.9,
            students: 30000,
            courses: 4,
            expertise: ['Product Strategy', 'User Research', 'Analytics']
          },
          includes: ['Full lifetime access', 'Certificate', 'Templates', 'Case studies'],
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          tags: ['Product', 'Certification'],
          lastUpdated: '2024-01-12',
          language: 'English',
          subtitles: ['English', 'Spanish', 'French'],
          certificate: true,
          projects: 4,
          articles: 25,
          downloadableResources: 20
        }
      ];

      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      
      // Load my learning from localStorage
      const savedLearning = localStorage.getItem('myLearning');
      if (savedLearning) {
        setMyLearning(JSON.parse(savedLearning));
      }
      
      const savedWishlist = localStorage.getItem('courseWishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      
      const savedProgress = localStorage.getItem('courseProgress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('myLearning', JSON.stringify(myLearning));
    localStorage.setItem('courseWishlist', JSON.stringify(wishlist));
    localStorage.setItem('courseProgress', JSON.stringify(userProgress));
  }, [myLearning, wishlist, userProgress]);

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Price filter
    if (filters.price !== 'all') {
      if (filters.price === 'free') {
        filtered = filtered.filter(course => course.isFree);
      } else if (filters.price === 'paid') {
        filtered = filtered.filter(course => !course.isFree);
      }
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(course => course.rating >= filters.rating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch(filters.sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchQuery, filters]);

  const handleEnroll = (course) => {
    if (!myLearning.some(c => c.id === course.id)) {
      setMyLearning([...myLearning, { ...course, progress: 0, enrolledDate: new Date().toISOString() }]);
      // Show success message
      alert(`Successfully enrolled in ${course.title}!`);
    }
  };

  const handleAddToWishlist = (course) => {
    if (!wishlist.some(c => c.id === course.id)) {
      setWishlist([...wishlist, course]);
      alert(`${course.title} added to wishlist!`);
    } else {
      setWishlist(wishlist.filter(c => c.id !== course.id));
      alert(`${course.title} removed from wishlist!`);
    }
  };

  const handleContinueLearning = (courseId) => {
    navigate(`/dashboard/courses/${courseId}/learn`);
  };

  const handleViewDetails = (courseId) => {
    navigate(`/dashboard/courses/${courseId}`);
    
    // Add to recently viewed
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const updated = [course, ...recentlyViewed.filter(c => c.id !== courseId)].slice(0, 6);
      setRecentlyViewed(updated);
      localStorage.setItem('recentlyViewedCourses', JSON.stringify(updated));
    }
  };

  const getProgress = (courseId) => {
    return userProgress[courseId] || 0;
  };

  const tabs = [
    { id: 'browse', label: 'Browse Courses', icon: '📚' },
    { id: 'my-learning', label: 'My Learning', icon: '🎓' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'recommended', label: 'Recommended', icon: '⭐' }
  ];

  return (
    <div className="courses-dashboard">
      {/* Header */}
      <div className="courses-header">
        <div className="header-content">
          <h1>
            <span className="header-icon">📚</span>
            Courses
          </h1>
          <p>Expand your knowledge with expert-led courses</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{courses.length}+</span>
            <span className="stat-label">Courses</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{courses.reduce((acc, c) => acc + c.students, 0).toLocaleString()}+</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">4.8</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{myLearning.length}</span>
            <span className="stat-label">Enrolled</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="courses-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Search and Filters */}
          <CourseSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {showFilters && (
            <CourseFilters
              filters={filters}
              onFilterChange={setFilters}
              categories={[...new Set(courses.map(c => c.category))]}
              levels={[...new Set(courses.map(c => c.level))]}
            />
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && !searchQuery && filters.category === 'all' && (
            <div className="recently-viewed">
              <h3>Recently Viewed</h3>
              <div className="recently-viewed-scroll">
                {recentlyViewed.map(course => (
                  <div
                    key={course.id}
                    className="recent-course-card"
                    onClick={() => handleViewDetails(course.id)}
                  >
                    <img src={course.image} alt={course.title} />
                    <div className="recent-course-info">
                      <h4>{course.title}</h4>
                      <p>{course.instructor.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Grid */}
          <div className={`courses-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="course-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredCourses.map(course => (
                <div key={course.id} className={`course-card ${viewMode}`}>
                  <div className="course-image" onClick={() => handleViewDetails(course.id)}>
                    <img src={course.image} alt={course.title} />
                    {course.isFree && <span className="free-badge">Free</span>}
                    {course.tags.includes('Bestseller') && (
                      <span className="bestseller-badge">Best Seller</span>
                    )}
                    <div className="course-overlay">
                      <button
                        className="overlay-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(course.id);
                        }}
                      >
                        Quick View
                      </button>
                      <button
                        className="overlay-btn wishlist-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(course);
                        }}
                      >
                        {wishlist.some(c => c.id === course.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>

                  <div className="course-content">
                    <div className="course-meta">
                      <span className="course-category">{course.category}</span>
                      <span className="course-level">{course.level}</span>
                    </div>
                    
                    <h3 className="course-title" onClick={() => handleViewDetails(course.id)}>
                      {course.title}
                    </h3>
                    
                    <p className="course-description">{course.description}</p>
                    
                    <div className="course-instructor">
                      <span className="instructor-avatar">{course.instructor.avatar}</span>
                      <span className="instructor-name">{course.instructor.name}</span>
                    </div>
                    
                    <div className="course-stats">
                      <span className="rating">⭐ {course.rating}</span>
                      <span className="students">👥 {course.students.toLocaleString()}</span>
                      <span className="duration">⏱️ {course.duration}</span>
                    </div>
                    
                    <div className="course-footer">
                      <div className="course-price">
                        {course.isFree ? (
                          <span className="free-price">Free</span>
                        ) : (
                          <span className="price">${course.price}</span>
                        )}
                      </div>
                      <button
                        className="enroll-btn"
                        onClick={() => handleEnroll(course)}
                        disabled={myLearning.some(c => c.id === course.id)}
                      >
                        {myLearning.some(c => c.id === course.id) ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredCourses.length === 0 && !loading && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters</p>
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: 'all',
                    level: 'all',
                    duration: 'all',
                    price: 'all',
                    language: 'all',
                    rating: 0,
                    sortBy: 'popular'
                  });
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* My Learning Tab */}
      {activeTab === 'my-learning' && (
        <MyLearning
          courses={myLearning}
          onContinue={handleContinueLearning}
          getProgress={getProgress}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="wishlist-container">
          <h2>Your Wishlist</h2>
          {wishlist.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <h3>Your wishlist is empty</h3>
              <p>Save courses you're interested in for later</p>
              <button
                className="browse-btn"
                onClick={() => setActiveTab('browse')}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map(course => (
                <div key={course.id} className="wishlist-card">
                  <img src={course.image} alt={course.title} />
                  <div className="wishlist-content">
                    <h3>{course.title}</h3>
                    <p>{course.instructor.name}</p>
                    <div className="wishlist-footer">
                      <span className="price">{course.isFree ? 'Free' : `$${course.price}`}</span>
                      <div className="wishlist-actions">
                        <button
                          className="enroll-btn small"
                          onClick={() => handleEnroll(course)}
                        >
                          Enroll
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => handleAddToWishlist(course)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommended' && (
        <CourseRecommendations
          courses={courses}
          myLearning={myLearning}
          wishlist={wishlist}
          onEnroll={handleEnroll}
          onViewDetails={handleViewDetails}
          onAddToWishlist={handleAddToWishlist}
        />
      )}
    </div>
  );
};

export default CoursesDashboard;