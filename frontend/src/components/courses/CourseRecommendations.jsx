import React, { useState, useMemo, useEffect, useCallback } from 'react';

const CourseRecommendations = ({
  courses = [],
  myLearning = [],
  wishlist = [],
  onEnroll,
  onViewDetails,
  onAddToWishlist,
  onShare,
  userId,
  userProfile = {}
}) => {
  const [recommendationType, setRecommendationType] = useState('personalized');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [userActivity, setUserActivity] = useState({
    recentlyViewed: [],
    searchHistory: [],
    timeSpent: {}
  });

  // Load user activity from localStorage
  useEffect(() => {
    if (userId) {
      const savedActivity = localStorage.getItem(`user_${userId}_activity`);
      if (savedActivity) {
        setUserActivity(JSON.parse(savedActivity));
      }
    }
  }, [userId]);

  // Get unique categories and levels from courses
  const categories = useMemo(() => {
    const cats = new Set();
    courses.forEach(course => course.category && cats.add(course.category));
    return Array.from(cats);
  }, [courses]);

  const levels = useMemo(() => {
    const lvls = new Set();
    courses.forEach(course => course.level && lvls.add(course.level));
    return Array.from(lvls);
  }, [courses]);

  // Calculate user interests based on multiple factors
  const userInterests = useMemo(() => {
    const interests = {
      categories: new Set(),
      levels: new Set(),
      topics: new Set(),
      instructors: new Set(),
      tags: new Set()
    };

    // From enrolled courses
    myLearning.forEach(course => {
      if (course.category) interests.categories.add(course.category);
      if (course.level) interests.levels.add(course.level);
      course.topics?.forEach(topic => interests.topics.add(topic));
      course.tags?.forEach(tag => interests.tags.add(tag));
      if (course.instructor?.id) interests.instructors.add(course.instructor.id);
    });

    // From wishlist
    wishlist.forEach(course => {
      if (course.category) interests.categories.add(course.category);
      if (course.level) interests.levels.add(course.level);
      course.topics?.forEach(topic => interests.topics.add(topic));
    });

    // From recently viewed
    userActivity.recentlyViewed.forEach(courseId => {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        if (course.category) interests.categories.add(course.category);
        course.topics?.forEach(topic => interests.topics.add(topic));
      }
    });

    // From user profile preferences
    if (userProfile.preferredCategories) {
      userProfile.preferredCategories.forEach(cat => interests.categories.add(cat));
    }
    if (userProfile.preferredLevels) {
      userProfile.preferredLevels.forEach(level => interests.levels.add(level));
    }

    return {
      categories: Array.from(interests.categories),
      levels: Array.from(interests.levels),
      topics: Array.from(interests.topics),
      instructors: Array.from(interests.instructors),
      tags: Array.from(interests.tags)
    };
  }, [myLearning, wishlist, userActivity, userProfile, courses]);

  // Calculate recommendation score for each course - FIXED: Now a regular function, not causing re-renders
  const calculateScore = useCallback((course) => {
    let score = 0;
    const weights = {
      category: 10,
      level: 8,
      topic: 7,
      instructor: 15,
      tag: 5,
      popularity: 3,
      recency: 4,
      rating: 6
    };

    // Category match
    if (userInterests.categories.includes(course.category)) {
      score += weights.category;
    }

    // Level match
    if (userInterests.levels.includes(course.level)) {
      score += weights.level;
    }

    // Topic match
    course.topics?.forEach(topic => {
      if (userInterests.topics.includes(topic)) {
        score += weights.topic;
      }
    });

    // Instructor match
    if (userInterests.instructors.includes(course.instructor?.id)) {
      score += weights.instructor;
    }

    // Tag match
    course.tags?.forEach(tag => {
      if (userInterests.tags.includes(tag)) {
        score += weights.tag;
      }
    });

    // Popularity (students count)
    score += (course.students / 1000) * weights.popularity;

    // Rating
    score += (course.rating || 0) * weights.rating;

    // Recency (newer courses get higher score)
    if (course.lastUpdated) {
      const daysSinceUpdate = (new Date() - new Date(course.lastUpdated)) / (1000 * 60 * 60 * 24);
      score += Math.max(0, (30 - daysSinceUpdate) / 30) * weights.recency;
    }

    return Math.round(score);
  }, [userInterests]);

  // Get personalized recommendations - FIXED: No setState inside useMemo
  const personalizedRecommendations = useMemo(() => {
    return courses
      .filter(course =>
        !myLearning.some(c => c.id === course.id) // Not enrolled
      )
      .map(course => {
        const score = calculateScore(course);
        return { ...course, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [courses, myLearning, calculateScore]);

  // Get popular recommendations
  const popularRecommendations = useMemo(() => {
    return courses
      .filter(course =>
        !myLearning.some(c => c.id === course.id)
      )
      .sort((a, b) => (b.students || 0) - (a.students || 0))
      .slice(0, 12);
  }, [courses, myLearning]);

  // Get new & trending recommendations
  const trendingRecommendations = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return courses
      .filter(course =>
        !myLearning.some(c => c.id === course.id) &&
        course.lastUpdated && new Date(course.lastUpdated) > oneMonthAgo
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 12);
  }, [courses, myLearning]);

  // Get similar to your learning
  const similarRecommendations = useMemo(() => {
    if (myLearning.length === 0) return [];

    const lastEnrolled = myLearning[myLearning.length - 1];
    return courses
      .filter(course =>
        !myLearning.some(c => c.id === course.id) &&
        (course.category === lastEnrolled.category ||
         course.level === lastEnrolled.level ||
         course.topics?.some(t => lastEnrolled.topics?.includes(t)))
      )
      .slice(0, 12);
  }, [courses, myLearning]);

  // Get recommendations based on current selection
  const recommendations = useMemo(() => {
    let base = [];

    switch (recommendationType) {
      case 'personalized':
        base = personalizedRecommendations;
        break;
      case 'popular':
        base = popularRecommendations;
        break;
      case 'trending':
        base = trendingRecommendations;
        break;
      case 'similar':
        base = similarRecommendations;
        break;
      default:
        base = personalizedRecommendations;
    }

    // Apply filters
    let filtered = base;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(c => c.level === selectedLevel);
    }

    // Apply sorting
    switch (sortBy) {
      case 'relevance':
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'students':
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0));
        break;
    }

    return filtered.slice(0, 8);
  }, [
    recommendationType,
    selectedCategory,
    selectedLevel,
    sortBy,
    personalizedRecommendations,
    popularRecommendations,
    trendingRecommendations,
    similarRecommendations
  ]);

  // Handle course view
  const handleViewDetails = useCallback((courseId) => {
    // Update recently viewed
    const updatedActivity = {
      ...userActivity,
      recentlyViewed: [
        courseId,
        ...userActivity.recentlyViewed.filter(id => id !== courseId)
      ].slice(0, 10)
    };
    setUserActivity(updatedActivity);
    if (userId) {
      localStorage.setItem(`user_${userId}_activity`, JSON.stringify(updatedActivity));
    }

    onViewDetails(courseId);
  }, [userActivity, userId, onViewDetails]);

  // Handle share
  const handleShare = useCallback((course, e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(course);
    } else {
      const shareData = {
        title: course.title,
        text: `Check out this course: ${course.title}`,
        url: `${window.location.origin}/courses/${course.id}`
      };
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    }
  }, [onShare]);

  // Get recommendation type title
  const getRecommendationTitle = useCallback(() => {
    switch (recommendationType) {
      case 'personalized': return 'Personalized For You';
      case 'popular': return 'Most Popular';
      case 'trending': return 'New & Trending';
      case 'similar': return 'Similar to Your Learning';
      default: return 'Recommended For You';
    }
  }, [recommendationType]);

  // Get recommendation subtitle
  const getRecommendationSubtitle = useCallback(() => {
    switch (recommendationType) {
      case 'personalized':
        return 'Based on your interests and learning history';
      case 'popular':
        return 'Top-rated courses loved by students';
      case 'trending':
        return 'Recently updated and highly rated';
      case 'similar':
        return 'Courses similar to what you\'re learning';
      default:
        return 'Discover courses tailored for you';
    }
  }, [recommendationType]);

  // Styles
  const styles = {
    container: {
      padding: '2rem',
      background: '#f8fafc',
      borderRadius: '1.5rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 0.5rem 0',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.95rem',
      margin: 0,
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    select: {
      padding: '0.6rem 2rem 0.6rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      color: '#1e293b',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
    },
    filterToggle: {
      padding: '0.6rem 1.2rem',
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      color: '#1e293b',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
    },
    filterToggleActive: {
      background: '#667eea',
      borderColor: '#667eea',
      color: 'white',
    },
    filtersPanel: {
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      border: '1px solid #e2e8f0',
      animation: 'slideDown 0.3s ease',
    },
    filterGroup: {
      flex: 1,
      minWidth: '200px',
    },
    filterLabel: {
      display: 'block',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    filterSelect: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '0.95rem',
      color: '#1e293b',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
    },
    clearFilters: {
      padding: '0.75rem 1.5rem',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '0.75rem',
      color: '#64748b',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '1.2rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    cardHovered: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    },
    cardImage: {
      position: 'relative',
      height: '180px',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    cardImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    imageBadges: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      display: 'flex',
      gap: '0.5rem',
      zIndex: 2,
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    badgeFree: {
      background: '#10b981',
      color: 'white',
    },
    badgeNew: {
      background: '#3b82f6',
      color: 'white',
    },
    badgeSale: {
      background: '#f59e0b',
      color: 'white',
    },
    badgeHot: {
      background: '#ef4444',
      color: 'white',
    },
    quickActions: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      gap: '0.5rem',
      zIndex: 2,
      animation: 'fadeIn 0.3s ease',
    },
    quickActionBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      fontSize: '1.1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(4px)',
    },
    cardContent: {
      padding: '1.25rem',
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 0.25rem 0',
      cursor: 'pointer',
      lineHeight: '1.4',
    },
    instructor: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '0.75rem',
    },
    courseStats: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.9rem',
      color: '#64748b',
    },
    stars: {
      color: '#fbbf24',
    },
    students: {
      fontSize: '0.9rem',
      color: '#64748b',
    },
    topics: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    topicTag: {
      padding: '0.2rem 0.6rem',
      background: '#f1f5f9',
      borderRadius: '1rem',
      fontSize: '0.75rem',
      color: '#475569',
      border: '1px solid #e2e8f0',
    },
    topicTagMore: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea',
    },
    matchScore: {
      marginBottom: '1rem',
    },
    scoreBar: {
      height: '4px',
      background: '#e2e8f0',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '0.25rem',
    },
    scoreFill: {
      height: '100%',
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
    scoreText: {
      fontSize: '0.75rem',
      color: '#10b981',
      fontWeight: '600',
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    priceSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    currentPrice: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#667eea',
    },
    originalPrice: {
      fontSize: '0.9rem',
      color: '#94a3b8',
      textDecoration: 'line-through',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    enrollBtn: {
      padding: '0.5rem 1.2rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    wishlistBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: '#f1f5f9',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    wishlistBtnActive: {
      background: '#fee2e2',
      color: '#ef4444',
    },
    courseMeta: {
      display: 'flex',
      gap: '1rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid #e2e8f0',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.8rem',
      color: '#64748b',
    },
    metaIcon: {
      fontSize: '0.9rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '1.5rem',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    emptyText: {
      color: '#64748b',
      marginBottom: '1.5rem',
    },
    exploreBtn: {
      padding: '0.75rem 2rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    loadMore: {
      textAlign: 'center',
      marginTop: '2rem',
    },
    loadMoreBtn: {
      padding: '0.75rem 2rem',
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      color: '#64748b',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  };

  if (courses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📚</div>
        <h3 style={styles.emptyTitle}>No Courses Available</h3>
        <p style={styles.emptyText}>Check back later for new courses</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>⭐</div>
        <h3 style={styles.emptyTitle}>No Recommendations Yet</h3>
        <p style={styles.emptyText}>Explore more courses to get personalized recommendations</p>
        <button
          style={styles.exploreBtn}
          onClick={() => setRecommendationType('popular')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 20px -5px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          View Popular Courses
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>{getRecommendationTitle()}</h2>
          <p style={styles.subtitle}>{getRecommendationSubtitle()}</p>
        </div>

        <div style={styles.controls}>
          {/* Recommendation Type Selector */}
          <select
            style={styles.select}
            value={recommendationType}
            onChange={(e) => setRecommendationType(e.target.value)}
          >
            <option value="personalized">Personalized</option>
            <option value="popular">Most Popular</option>
            <option value="trending">New & Trending</option>
            <option value="similar">Similar to You</option>
          </select>

          {/* Filter Toggle */}
          <button
            style={{
              ...styles.filterToggle,
              ...(showFilters ? styles.filterToggleActive : {})
            }}
            onClick={() => setShowFilters(!showFilters)}
            onMouseEnter={(e) => {
              if (!showFilters) {
                e.target.style.borderColor = '#667eea';
                e.target.style.color = '#667eea';
              }
            }}
            onMouseLeave={(e) => {
              if (!showFilters) {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#1e293b';
              }
            }}
          >
            <span>🔍</span>
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category</label>
            <select
              style={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Level</label>
            <select
              style={styles.filterSelect}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select
              style={styles.filterSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="students">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <button
            style={styles.clearFilters}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSortBy('relevance');
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e2e8f0';
              e.target.style.color = '#1e293b';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f1f5f9';
              e.target.style.color = '#64748b';
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Recommendations Grid */}
      <div style={styles.grid}>
        {recommendations.map((course) => {
          const isInWishlist = wishlist.some(c => c.id === course.id);
          const matchScore = course.score || 0;
          const isNew = course.lastUpdated && new Date(course.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

          return (
            <div
              key={course.id}
              style={{
                ...styles.card,
                ...(hoveredCourse === course.id ? styles.cardHovered : {})
              }}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Image Section */}
              <div style={styles.cardImage} onClick={() => handleViewDetails(course.id)}>
                <img
                  style={styles.cardImageImg}
                  src={course.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  loading="lazy"
                />
                
                {/* Badges */}
                <div style={styles.imageBadges}>
                  {course.isFree && <span style={{...styles.badge, ...styles.badgeFree}}>Free</span>}
                  {isNew && <span style={{...styles.badge, ...styles.badgeNew}}>New</span>}
                  {course.discountedPrice && (
                    <span style={{...styles.badge, ...styles.badgeSale}}>Sale</span>
                  )}
                  {matchScore >= 80 && (
                    <span style={{...styles.badge, ...styles.badgeHot}}>🔥 Hot</span>
                  )}
                </div>

                {/* Quick Actions (shown on hover) */}
                {hoveredCourse === course.id && (
                  <div style={styles.quickActions}>
                    <button
                      style={styles.quickActionBtn}
                      onClick={(e) => handleShare(course, e)}
                      title="Share"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.color = '#1e293b';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      📤
                    </button>
                    <button
                      style={styles.quickActionBtn}
                      onClick={() => onAddToWishlist(course)}
                      title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.color = '#1e293b';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {isInWishlist ? '❤️' : '🤍'}
                    </button>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle} onClick={() => handleViewDetails(course.id)}>
                  {course.title}
                </h3>
                <p style={styles.instructor}>by {course.instructor?.name || 'Instructor'}</p>
                
                {/* Rating and Students */}
                <div style={styles.courseStats}>
                  <span style={styles.rating}>
                    <span style={styles.stars}>⭐</span>
                    {course.rating || 0} ({course.reviews?.length || 0})
                  </span>
                  <span style={styles.students}>
                    👥 {course.students?.toLocaleString() || 0}
                  </span>
                </div>

                {/* Topics/Tags */}
                {course.topics && course.topics.length > 0 && (
                  <div style={styles.topics}>
                    {course.topics.slice(0, 2).map((topic, i) => (
                      <span key={i} style={styles.topicTag}>{topic}</span>
                    ))}
                    {course.topics.length > 2 && (
                      <span style={{...styles.topicTag, ...styles.topicTagMore}}>
                        +{course.topics.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Match Score (for personalized recommendations) */}
                {recommendationType === 'personalized' && matchScore > 0 && (
                  <div style={styles.matchScore}>
                    <div style={styles.scoreBar}>
                      <div
                        style={{
                          ...styles.scoreFill,
                          width: `${matchScore}%`
                        }}
                      />
                    </div>
                    <span style={styles.scoreText}>{matchScore}% match</span>
                  </div>
                )}

                {/* Footer */}
                <div style={styles.cardFooter}>
                  <div style={styles.priceSection}>
                    {course.discountedPrice ? (
                      <>
                        <span style={styles.currentPrice}>${course.discountedPrice}</span>
                        <span style={styles.originalPrice}>${course.price}</span>
                      </>
                    ) : (
                      <span style={styles.currentPrice}>
                        {course.isFree ? 'Free' : `$${course.price || 0}`}
                      </span>
                    )}
                  </div>

                  <div style={styles.actionButtons}>
                    <button
                      style={styles.enrollBtn}
                      onClick={() => onEnroll(course)}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateX(2px)';
                        e.target.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Enroll
                    </button>
                    <button
                      style={{
                        ...styles.wishlistBtn,
                        ...(isInWishlist ? styles.wishlistBtnActive : {})
                      }}
                      onClick={() => onAddToWishlist(course)}
                      title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      onMouseEnter={(e) => {
                        if (!isInWishlist) {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isInWishlist) {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {isInWishlist ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>

                {/* Duration and Level Info */}
                <div style={styles.courseMeta}>
                  <span style={styles.metaItem}>
                    <span style={styles.metaIcon}>⏱️</span>
                    {course.duration || 'N/A'}
                  </span>
                  <span style={styles.metaItem}>
                    <span style={styles.metaIcon}>📊</span>
                    {course.level || 'All Levels'}
                  </span>
                  <span style={styles.metaItem}>
                    <span style={styles.metaIcon}>📚</span>
                    {course.lessons || 0} lessons
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {recommendations.length >= 8 && (
        <div style={styles.loadMore}>
          <button
            style={styles.loadMoreBtn}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.color = '#667eea';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.color = '#64748b';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Load More Recommendations
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .course-recommendations {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseRecommendations;