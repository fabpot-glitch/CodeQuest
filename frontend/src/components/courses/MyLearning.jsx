import React, { useState, useMemo } from 'react';

const MyLearning = ({ 
  courses = [], 
  onContinue, 
  getProgress, 
  onViewDetails,
  onReview,
  onShare,
  onDownloadCertificate,
  onResetProgress,
  onArchive,
  userId 
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [showAchievements, setShowAchievements] = useState({});

  // Process courses with progress data
  const processedCourses = useMemo(() => {
    return courses.map(course => {
      const progress = getProgress(course.id) || 0;
      const status = progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress';
      const lastAccessed = localStorage.getItem(`course_${course.id}_last_accessed`) || course.enrolledDate;
      const timeSpent = parseInt(localStorage.getItem(`course_${course.id}_time_spent`) || '0');
      const streak = parseInt(localStorage.getItem(`course_${course.id}_streak`) || '0');
      const achievements = JSON.parse(localStorage.getItem(`course_${course.id}_achievements`) || '[]');
      
      return {
        ...course,
        progress,
        status,
        lastAccessed,
        timeSpent,
        streak,
        achievements
      };
    });
  }, [courses, getProgress]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...processedCourses];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastAccessed || 0) - new Date(a.lastAccessed || 0));
        break;
      case 'progress-asc':
        filtered.sort((a, b) => a.progress - b.progress);
        break;
      case 'progress-desc':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'streak':
        filtered.sort((a, b) => b.streak - a.streak);
        break;
      case 'time':
        filtered.sort((a, b) => b.timeSpent - a.timeSpent);
        break;
    }

    return filtered;
  }, [processedCourses, filterStatus, searchTerm, sortBy]);

  // Group courses by status
  const groupedCourses = useMemo(() => {
    return {
      'in-progress': filteredCourses.filter(c => c.status === 'in-progress'),
      'not-started': filteredCourses.filter(c => c.status === 'not-started'),
      'completed': filteredCourses.filter(c => c.status === 'completed')
    };
  }, [filteredCourses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCourses = filteredCourses.length;
    const completedCourses = filteredCourses.filter(c => c.status === 'completed').length;
    const inProgressCourses = filteredCourses.filter(c => c.status === 'in-progress').length;
    const totalTimeSpent = filteredCourses.reduce((acc, c) => acc + (c.timeSpent || 0), 0);
    const totalStreak = Math.max(...filteredCourses.map(c => c.streak || 0), 0);
    const averageProgress = filteredCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / (totalCourses || 1);

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalTimeSpent,
      totalStreak,
      averageProgress
    };
  }, [filteredCourses]);

  // Format time
  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Handle continue learning
  const handleContinue = (courseId) => {
    localStorage.setItem(`course_${courseId}_last_accessed`, new Date().toISOString());
    onContinue(courseId);
  };

  // Handle view details
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  // Handle share
  const handleShare = (course, e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(course);
    } else {
      const shareData = {
        title: course.title,
        text: `I'm learning ${course.title} on this platform!`,
        url: `${window.location.origin}/courses/${course.id}`
      };
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    }
  };

  // Handle reset progress
  const handleResetProgress = (courseId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
      onResetProgress?.(courseId);
    }
  };

  // Handle archive
  const handleArchive = (courseId, e) => {
    e.stopPropagation();
    onArchive?.(courseId);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'not-started': return '#94a3b8';
      default: return '#64748b';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      case 'not-started': return '⏳';
      default: return '📚';
    }
  };

  // Get status title
  const getStatusTitle = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      case 'completed': return 'Completed';
      default: return '';
    }
  };

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
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '1rem',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    },
    statInfo: {
      flex: 1,
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      lineHeight: 1.2,
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    searchBox: {
      flex: 1,
      position: 'relative',
      minWidth: '250px',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    clearSearch: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    filterGroup: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    select: {
      padding: '0.75rem 2rem 0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
    },
    viewToggle: {
      display: 'flex',
      gap: '0.25rem',
      background: '#f1f5f9',
      padding: '0.25rem',
      borderRadius: '2rem',
    },
    viewButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'transparent',
      color: '#64748b',
    },
    viewButtonActive: {
      background: 'white',
      color: '#667eea',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    sectionCount: {
      padding: '0.25rem 0.75rem',
      background: '#e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.85rem',
      color: '#475569',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
      gap: '1.5rem',
    },
    card: {
      background: 'white',
      borderRadius: '1.2rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    cardHovered: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    },
    cardImage: {
      position: 'relative',
      height: '160px',
      overflow: 'hidden',
    },
    cardImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    statusBadge: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 2,
    },
    streakBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.75rem',
      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      zIndex: 2,
    },
    completedBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      background: '#10b981',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      zIndex: 2,
    },
    quickActions: {
      position: 'absolute',
      bottom: '1rem',
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
      fontSize: '1rem',
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
      lineHeight: '1.4',
    },
    instructor: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '0.75rem',
    },
    progressSection: {
      marginBottom: '1rem',
    },
    progressBar: {
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },
    progressInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
    },
    progressText: {
      color: '#64748b',
    },
    timeSpent: {
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0',
    },
    continueBtn: {
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
    startBtn: {
      padding: '0.5rem 1.2rem',
      background: '#10b981',
      border: 'none',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    reviewBtn: {
      padding: '0.5rem 1.2rem',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '2rem',
      color: '#475569',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    certificateBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: '#10b981',
      fontSize: '0.85rem',
      fontWeight: '500',
    },
    listView: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    listItem: {
      background: 'white',
      borderRadius: '1rem',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid #e2e8f0',
    },
    listItemHovered: {
      transform: 'translateX(5px)',
      borderColor: '#667eea',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    listImage: {
      width: '80px',
      height: '60px',
      borderRadius: '0.5rem',
      objectFit: 'cover',
    },
    listContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    listTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
    },
    listMeta: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.85rem',
      color: '#64748b',
    },
    listProgress: {
      width: '200px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
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
    browseBtn: {
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
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    },
    modalContainer: {
      background: 'white',
      borderRadius: '1.5rem',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      padding: '2rem',
    },
    modalClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      border: 'none',
      background: '#f1f5f9',
      cursor: 'pointer',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
    },
    modalStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    modalStat: {
      textAlign: 'center',
      padding: '1rem',
      background: '#f8fafc',
      borderRadius: '0.75rem',
    },
    modalStatValue: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    modalStatLabel: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    achievements: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    achievement: {
      textAlign: 'center',
      padding: '1rem',
      background: '#f8fafc',
      borderRadius: '0.75rem',
      opacity: 0.5,
    },
    achievementUnlocked: {
      opacity: 1,
      background: 'linear-gradient(135deg, #667eea20, #764ba220)',
      border: '1px solid #667eea',
    },
    achievementIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem',
    },
    achievementName: {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: '#1e293b',
    },
  };

  if (courses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🎓</div>
        <h3 style={styles.emptyTitle}>You haven't enrolled in any courses yet</h3>
        <p style={styles.emptyText}>Start your learning journey today!</p>
        <button
          style={styles.browseBtn}
          onClick={() => window.location.href = '/dashboard/courses'}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 20px -5px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>My Learning</h2>
      </div>

      {/* Stats Cards */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#dbeafe', color: '#3b82f6'}}>📚</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.totalCourses}</div>
            <div style={styles.statLabel}>Total Courses</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#fef3c7', color: '#f59e0b'}}>🔄</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.inProgressCourses}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#d1fae5', color: '#10b981'}}>✅</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.completedCourses}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#fee2e2', color: '#ef4444'}}>⏱️</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</div>
            <div style={styles.statLabel}>Time Spent</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#f3e8ff', color: '#8b5cf6'}}>🔥</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.totalStreak}</div>
            <div style={styles.statLabel}>Day Streak</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#cffafe', color: '#06b6d4'}}>📊</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{Math.round(stats.averageProgress)}%</div>
            <div style={styles.statLabel}>Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          {searchTerm && (
            <button style={styles.clearSearch} onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.filterGroup}>
          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Courses</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
            <option value="completed">Completed</option>
          </select>

          <select
            style={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="progress-desc">Highest Progress</option>
            <option value="progress-asc">Lowest Progress</option>
            <option value="title">Title</option>
            <option value="streak">Highest Streak</option>
            <option value="time">Most Time</option>
          </select>

          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'grid' ? styles.viewButtonActive : {})
              }}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === 'list' ? styles.viewButtonActive : {})
              }}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Course Sections */}
      {['in-progress', 'not-started', 'completed'].map((status) => {
        const statusCourses = groupedCourses[status];
        if (statusCourses.length === 0) return null;

        return (
          <div key={status} style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>
                <span>{getStatusIcon(status)}</span>
                {getStatusTitle(status)}
              </h3>
              <span style={styles.sectionCount}>{statusCourses.length} courses</span>
            </div>

            {viewMode === 'grid' ? (
              <div style={styles.grid}>
                {statusCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      ...styles.card,
                      ...(hoveredCourseId === course.id ? styles.cardHovered : {})
                    }}
                    onMouseEnter={() => setHoveredCourseId(course.id)}
                    onMouseLeave={() => setHoveredCourseId(null)}
                    onClick={() => handleViewDetails(course)}
                  >
                    <div style={styles.cardImage}>
                      <img
                        style={styles.cardImageImg}
                        src={course.image || 'https://via.placeholder.com/300x160'}
                        alt={course.title}
                      />
                      
                      {/* Status Badge */}
                      <div style={{
                        ...styles.statusBadge,
                        color: getStatusColor(status),
                        border: `1px solid ${getStatusColor(status)}20`,
                      }}>
                        <span>{getStatusIcon(status)}</span>
                        <span>{getStatusTitle(status)}</span>
                      </div>

                      {/* Streak Badge */}
                      {course.streak > 0 && (
                        <div style={styles.streakBadge}>
                          <span>🔥</span>
                          <span>{course.streak} day streak</span>
                        </div>
                      )}

                      {/* Completed Badge */}
                      {status === 'completed' && (
                        <div style={styles.completedBadge}>
                          ✓
                        </div>
                      )}

                      {/* Quick Actions */}
                      {hoveredCourseId === course.id && (
                        <div style={styles.quickActions}>
                          <button
                            style={styles.quickActionBtn}
                            onClick={(e) => handleShare(course, e)}
                            title="Share"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#667eea';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                              e.currentTarget.style.color = '#1e293b';
                            }}
                          >
                            📤
                          </button>
                          {status !== 'completed' && (
                            <button
                              style={styles.quickActionBtn}
                              onClick={(e) => handleResetProgress(course.id, e)}
                              title="Reset Progress"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#1e293b';
                              }}
                            >
                              🔄
                            </button>
                          )}
                          <button
                            style={styles.quickActionBtn}
                            onClick={(e) => handleArchive(course.id, e)}
                            title="Archive"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#94a3b8';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                              e.currentTarget.style.color = '#1e293b';
                            }}
                          >
                            📦
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={styles.cardContent}>
                      <h4 style={styles.cardTitle}>{course.title}</h4>
                      <p style={styles.instructor}>by {course.instructor?.name || 'Instructor'}</p>

                      {status === 'in-progress' && (
                        <div style={styles.progressSection}>
                          <div style={styles.progressBar}>
                            <div style={{...styles.progressFill, width: `${course.progress}%`}} />
                          </div>
                          <div style={styles.progressInfo}>
                            <span style={styles.progressText}>{course.progress}% complete</span>
                            <span style={styles.timeSpent}>
                              ⏱️ {formatTime(course.timeSpent)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div style={styles.cardFooter}>
                        {status === 'in-progress' && (
                          <button
                            style={styles.continueBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinue(course.id);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateX(2px)';
                              e.target.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateX(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            Continue
                          </button>
                        )}
                        {status === 'not-started' && (
                          <button
                            style={styles.startBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinue(course.id);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            Start Course
                          </button>
                        )}
                        {status === 'completed' && (
                          <>
                            <span style={styles.certificateBadge}>
                              🎓 Certificate
                            </span>
                            <button
                              style={styles.reviewBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(course.id);
                              }}
                            >
                              Review
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.listView}>
                {statusCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      ...styles.listItem,
                      ...(hoveredCourseId === course.id ? styles.listItemHovered : {})
                    }}
                    onMouseEnter={() => setHoveredCourseId(course.id)}
                    onMouseLeave={() => setHoveredCourseId(null)}
                    onClick={() => handleViewDetails(course)}
                  >
                    <img
                      style={styles.listImage}
                      src={course.image || 'https://via.placeholder.com/80x60'}
                      alt={course.title}
                    />
                    <div style={styles.listContent}>
                      <h4 style={styles.listTitle}>{course.title}</h4>
                      <p style={styles.instructor}>{course.instructor?.name || 'Instructor'}</p>
                      <div style={styles.listMeta}>
                        <span>{getStatusIcon(status)} {getStatusTitle(status)}</span>
                        <span>⏱️ {formatTime(course.timeSpent)}</span>
                        {course.streak > 0 && <span>🔥 {course.streak} day streak</span>}
                      </div>
                    </div>
                    {status === 'in-progress' && (
                      <div style={styles.listProgress}>
                        <div style={styles.progressBar}>
                          <div style={{...styles.progressFill, width: `${course.progress}%`}} />
                        </div>
                        <span style={styles.progressText}>{course.progress}%</span>
                      </div>
                    )}
                    <button
                      style={status === 'completed' ? styles.reviewBtn : styles.continueBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinue(course.id);
                      }}
                    >
                      {status === 'completed' ? 'Review' : status === 'not-started' ? 'Start' : 'Continue'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowDetailsModal(false)}>×</button>
            
            <h2 style={styles.modalTitle}>{selectedCourse.title}</h2>

            <div style={styles.modalStats}>
              <div style={styles.modalStat}>
                <div style={styles.modalStatValue}>{selectedCourse.progress}%</div>
                <div style={styles.modalStatLabel}>Progress</div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatValue}>{formatTime(selectedCourse.timeSpent)}</div>
                <div style={styles.modalStatLabel}>Time Spent</div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatValue}>{selectedCourse.streak}</div>
                <div style={styles.modalStatLabel}>Day Streak</div>
              </div>
            </div>

            <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>
              Achievements
            </h3>
            <div style={styles.achievements}>
              {[
                { id: 1, name: 'First Lesson', icon: '🎯', achieved: selectedCourse.progress > 0 },
                { id: 2, name: '10 Lessons', icon: '📚', achieved: selectedCourse.progress >= 25 },
                { id: 3, name: 'Halfway', icon: '🌟', achieved: selectedCourse.progress >= 50 },
                { id: 4, name: 'Almost There', icon: '⚡', achieved: selectedCourse.progress >= 75 },
                { id: 5, name: 'Course Master', icon: '🎓', achieved: selectedCourse.progress >= 100 },
                { id: 6, name: '7-Day Streak', icon: '🔥', achieved: selectedCourse.streak >= 7 },
              ].map(achievement => (
                <div
                  key={achievement.id}
                  style={{
                    ...styles.achievement,
                    ...(achievement.achieved ? styles.achievementUnlocked : {})
                  }}
                >
                  <div style={styles.achievementIcon}>{achievement.icon}</div>
                  <div style={styles.achievementName}>{achievement.name}</div>
                </div>
              ))}
            </div>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button
                style={styles.reviewBtn}
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button
                style={styles.continueBtn}
                onClick={() => {
                  setShowDetailsModal(false);
                  handleContinue(selectedCourse.id);
                }}
              >
                {selectedCourse.status === 'completed' ? 'Review Course' : 'Continue Learning'}
              </button>
            </div>
          </div>
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

        @media (max-width: 768px) {
          .my-learning {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyLearning;