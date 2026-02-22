import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Trophy,
  BarChart3,
  BookOpen,
  Video,
  User,
  Settings as SettingsIcon, // Alias the icon from lucide-react
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Moon,
  Sun,
  Globe,
  Search,
  Award,
  Flame,
  Star,
  Clock,
  Calendar,
  Code,
  Cpu,
  Zap,
  Shield,
  Lock,
  Mail,
  Volume2,
  Eye,
  EyeOff,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Save,
  Edit,
  Camera,
  MapPin,
  Briefcase,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  MessageCircle,
  Heart,
  Gift,
  CreditCard,
  DollarSign
} from 'lucide-react';
import Notifications from '../components/Notifications';
import Settings from '../components/Settings'; // This is your Settings component
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false); // For the full settings panel
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [language, setLanguage] = useState('en');
  const searchRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'contest', 
      message: 'Weekly Contest starts in 2 hours', 
      time: '2 hours ago',
      read: false 
    },
    { 
      id: 2, 
      type: 'achievement', 
      message: 'You earned "Fast Solver" badge!', 
      time: '5 hours ago',
      read: false 
    },
    { 
      id: 3, 
      type: 'problem', 
      message: 'New problem "Dynamic Programming" added', 
      time: '1 day ago',
      read: true 
    },
    { 
      id: 4, 
      type: 'course', 
      message: 'Course "Advanced Algorithms" is now available', 
      time: '2 days ago',
      read: true 
    }
  ]);

  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  // Searchable items database
  const searchableItems = [
    // Problems
    { id: 1, title: 'Two Sum', category: 'problem', path: '/dashboard/problems/1', tags: ['array', 'hash table', 'easy'], difficulty: 'Easy' },
    { id: 2, title: 'Add Two Numbers', category: 'problem', path: '/dashboard/problems/2', tags: ['linked list', 'math', 'medium'], difficulty: 'Medium' },
    { id: 3, title: 'Longest Substring Without Repeating Characters', category: 'problem', path: '/dashboard/problems/3', tags: ['string', 'sliding window', 'medium'], difficulty: 'Medium' },
    { id: 4, title: 'Median of Two Sorted Arrays', category: 'problem', path: '/dashboard/problems/4', tags: ['array', 'binary search', 'hard'], difficulty: 'Hard' },
    { id: 5, title: 'Dynamic Programming', category: 'problem', path: '/dashboard/problems?topic=dp', tags: ['dp', 'algorithms', 'medium'], difficulty: 'Medium' },
    
    // Contests
    { id: 6, title: 'Weekly Contest 342', category: 'contest', path: '/dashboard/contests/342', tags: ['weekly', 'live'], status: 'LIVE' },
    { id: 7, title: 'Biweekly Contest 121', category: 'contest', path: '/dashboard/contests/121', tags: ['biweekly', 'upcoming'], status: 'Upcoming' },
    { id: 8, title: 'Algorithm Marathon', category: 'contest', path: '/dashboard/contests/marathon', tags: ['marathon', 'algorithms'], status: 'Registration' },
    
    // Courses
    { id: 9, title: 'Advanced Algorithms', category: 'course', path: '/dashboard/courses/adv-algorithms', tags: ['algorithms', 'advanced'], level: 'Advanced' },
    { id: 10, title: 'System Design Fundamentals', category: 'course', path: '/dashboard/courses/system-design', tags: ['system design', 'architecture'], level: 'Intermediate' },
    { id: 11, title: 'Dynamic Programming Masterclass', category: 'course', path: '/dashboard/courses/dp-masterclass', tags: ['dp', 'algorithms'], level: 'Advanced' },
    { id: 12, title: 'Python for Beginners', category: 'course', path: '/dashboard/courses/python-basics', tags: ['python', 'beginner'], level: 'Beginner' },
    
    // Pages/Sections
    { id: 13, title: 'Dashboard', category: 'page', path: '/dashboard', tags: ['home', 'main'] },
    { id: 14, title: 'Problems', category: 'page', path: '/dashboard/problems', tags: ['coding', 'challenges'] },
    { id: 15, title: 'Submissions', category: 'page', path: '/dashboard/submissions', tags: ['history', 'code'] },
    { id: 16, title: 'Contests', category: 'page', path: '/dashboard/contests', tags: ['competition', 'events'] },
    { id: 17, title: 'Leaderboard', category: 'page', path: '/dashboard/leaderboard', tags: ['ranking', 'top'] },
    { id: 18, title: 'Courses', category: 'page', path: '/dashboard/courses', tags: ['learning', 'education'] },
    { id: 19, title: 'Mock Interviews', category: 'page', path: '/dashboard/mockinterviews', tags: ['interview', 'practice'] },
    { id: 20, title: 'Profile', category: 'page', path: '/dashboard/profile', tags: ['user', 'settings'] },
    { id: 21, title: 'Settings', category: 'page', path: '/dashboard/settings', tags: ['preferences', 'configuration'] },
    { id: 22, title: 'Billing', category: 'page', path: '/dashboard/billing', tags: ['payment', 'subscription'] },
    { id: 23, title: 'Help & Support', category: 'page', path: '/dashboard/help', tags: ['support', 'faq'] },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  // Search function
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = searchableItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.difficulty && item.difficulty.toLowerCase().includes(query)) ||
      (item.level && item.level.toLowerCase().includes(query)) ||
      (item.status && item.status.toLowerCase().includes(query))
    ).slice(0, 8);

    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery]);

  const handleSearchSelect = (item) => {
    navigate(item.path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Problems', path: '/dashboard/problems', icon: FileText, badge: '42' },
    { name: 'Submissions', path: '/dashboard/submissions', icon: CheckCircle, badge: null },
    { name: 'Contests', path: '/dashboard/contests', icon: Trophy, badge: 'LIVE' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: BarChart3, badge: null },
    { name: 'Courses', path: '/dashboard/courses', icon: BookOpen, badge: 'NEW' },
    { name: 'Mock Interviews', path: '/dashboard/mockinterviews', icon: Video, badge: null },
    { name: 'Profile', path: '/dashboard/profile', icon: User, badge: null }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    setIsSettingsOpen(false);
    setIsSettingsPanelOpen(false); // Close settings panel when navigating
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'contest': return <Trophy size={20} />;
      case 'achievement': return <Award size={20} />;
      case 'problem': return <Code size={20} />;
      case 'course': return <BookOpen size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'problem': return <Code size={16} />;
      case 'contest': return <Trophy size={16} />;
      case 'course': return <BookOpen size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'problem': return '#3b82f6';
      case 'contest': return '#f59e0b';
      case 'course': return '#10b981';
      default: return '#6b7280';
    }
  };

  const openSettingsPanel = () => {
    setIsSettingsPanelOpen(true);
    setIsSettingsOpen(false); // Close the dropdown
  };

  const closeSettingsPanel = () => {
    setIsSettingsPanelOpen(false);
  };

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark' : ''}`}>
      {/* Ultra-Polished Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Updated Logo Section with one-line gradient */}
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="12" fill="url(#logo-gradient)" />
                <path 
                  d="M12 12L20 8L28 12L20 16L12 12Z M12 20L20 16L28 20L20 24L12 20Z M12 28L20 24L28 28L20 32L12 28Z" 
                  fill="white" 
                  opacity="0.95"
                />
                <circle cx="20" cy="20" r="4" fill="white" opacity="0.3" />
              </svg>
            </div>
            <div className="logo-text">CodeQuest</div>
          </div>
          <button 
            className="sidebar-close" 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">
              <div className="nav-section-icon" />
              NAVIGATION
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-item ${active ? 'active' : ''}`}
                >
                  <Icon size={20} className="nav-item-icon" />
                  <span className="nav-item-text">{item.name}</span>
                  {item.badge && (
                    <span className={`nav-item-badge ${
                      item.badge === 'LIVE' ? 'badge-live' : 
                      item.badge === 'NEW' ? 'badge-new' : 'badge-default'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <span className="nav-item-indicator" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer - Simple logout button only */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Premium Main Content */}
      <div className="main-content">
        <header className="top-bar">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Enhanced Search Bar with Results Dropdown */}
          <div className="search-container" ref={searchRef}>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search problems, contests, courses..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.trim() !== '' && setShowSearchResults(true)}
              />
              {searchQuery && (
                <button 
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                <div className="search-results-header">
                  <span>Search Results</span>
                  <span className="results-count">{searchResults.length} items</span>
                </div>
                <div className="search-results-list">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      className="search-result-item"
                      onClick={() => handleSearchSelect(result)}
                    >
                      <div className="result-icon" style={{ color: getCategoryColor(result.category) }}>
                        {getCategoryIcon(result.category)}
                      </div>
                      <div className="result-content">
                        <div className="result-title">{result.title}</div>
                        <div className="result-meta">
                          <span className="result-category">{result.category}</span>
                          {result.difficulty && (
                            <span className={`result-difficulty ${result.difficulty.toLowerCase()}`}>
                              {result.difficulty}
                            </span>
                          )}
                          {result.status && (
                            <span className={`result-status ${result.status.toLowerCase()}`}>
                              {result.status}
                            </span>
                          )}
                          {result.level && (
                            <span className="result-level">{result.level}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="search-results-footer">
                  <span>Press Enter to go to first result</span>
                </div>
              </div>
            )}
          </div>

          <div className="top-bar-actions">
            {/* Notifications Button */}
            <button 
              className={`icon-btn ${unreadCount > 0 ? 'has-notifications' : ''}`}
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {/* Settings Dropdown */}
            <div className="dropdown-container" ref={settingsRef}>
              <button 
                className="icon-btn"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-label="Settings"
              >
                <SettingsIcon size={20} /> {/* Use the aliased SettingsIcon */}
              </button>

              {isSettingsOpen && (
                <div className="settings-dropdown">
                  <div className="dropdown-header">
                    <span>Quick Settings</span>
                  </div>
                  <div className="settings-list">
                    <div className="settings-item">
                      <div className="settings-item-info">
                        <Moon size={16} />
                        <span>Dark Mode</span>
                      </div>
                      <button 
                        className={`toggle-switch ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <div className="toggle-slider" />
                      </button>
                    </div>
                    <div className="settings-item">
                      <div className="settings-item-info">
                        <Globe size={16} />
                        <span>Language</span>
                      </div>
                      <select 
                        className="language-select"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="hi">हिन्दी</option>
                      </select>
                    </div>
                    <div className="settings-item">
                      <div className="settings-item-info">
                        <Volume2 size={16} />
                        <span>Sound Effects</span>
                      </div>
                      <button className="toggle-switch active">
                        <div className="toggle-slider" />
                      </button>
                    </div>
                    <div className="settings-divider" />
                    <button 
                      className="settings-full-btn"
                      onClick={openSettingsPanel}
                    >
                      <SettingsIcon size={16} /> {/* Use the aliased SettingsIcon */}
                      <span>Open Full Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Icon - Simple user icon that navigates to profile */}
            <button 
              className="profile-icon-btn"
              onClick={() => handleNavigation('/dashboard/profile')}
              aria-label="Profile"
            >
              <User size={22} />
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Notifications Panel */}
      <Notifications 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Settings Panel */}
      <Settings 
        isOpen={isSettingsPanelOpen} 
        onClose={closeSettingsPanel} 
      />
    </div>
  );
};

export default DashboardLayout;