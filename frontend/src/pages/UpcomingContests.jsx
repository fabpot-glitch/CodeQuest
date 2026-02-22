// src/components/contests/UpcomingContests.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Filter, Calendar, Clock, Users,
  Trophy, Award, Star, TrendingUp, Bookmark,
  ChevronRight, AlertCircle, Globe, Lock,
  Zap, Target, BarChart, Eye
} from 'lucide-react';

const UpcomingContests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    type: 'all',
    dateRange: 'all'
  });
  const [bookmarked, setBookmarked] = useState(new Set());

  // Category data for the "View All" section
  const categoriesData = [
    { id: 'algorithm', name: 'Algorithm', icon: 'A', contests: 3, prize: '$50,000', participants: 3850 },
    { id: 'ai-ml', name: 'AI/ML', icon: 'A', contests: 3, prize: '$40,000', participants: 2350 },
    { id: 'web-dev', name: 'Web Development', icon: 'W', contests: 3, prize: '$22,000', participants: 2150 },
    { id: 'data-science', name: 'Data Science', icon: 'D', contests: 3, prize: '$32,000', participants: 2100 },
    { id: 'security', name: 'Security', icon: 'S', contests: 3, prize: '$45,000', participants: 1550 },
    { id: 'mobile', name: 'Mobile', icon: 'M', contests: 3, prize: '$24,000', participants: 1750 },
    { id: 'game-dev', name: 'Game Development', icon: 'G', contests: 3, prize: '$22,000', participants: 1350 }
  ];

  // Mock contests data
  const mockContests = [
    // ── ALGORITHM ──────────────────────────────────────────────
    {
      id: 'code-challenge-2024',
      title: 'Code Challenge 2024',
      description: 'Annual coding competition featuring algorithmic problems from beginner to advanced levels.',
      date: '2026-03-15',
      startTime: '10:00 AM',
      duration: '8 hours',
      participants: 1250,
      maxParticipants: 2000,
      difficulty: 'Medium',
      category: 'Algorithm',
      type: 'public',
      prizePool: '$10,000',
      registrationDeadline: '2026-03-14',
      tags: ['Algorithm', 'Data Structures', 'C++', 'Python', 'Java'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'algorithm-masters',
      title: 'Algorithm Masters',
      description: 'Advanced algorithm competition for expert programmers tackling complex optimization problems.',
      date: '2026-04-25',
      startTime: '2:00 PM',
      duration: '6 hours',
      participants: 1200,
      maxParticipants: 2000,
      difficulty: 'Hard',
      category: 'Algorithm',
      type: 'public',
      prizePool: '$20,000',
      registrationDeadline: '2026-04-24',
      tags: ['Advanced Algorithms', 'C++', 'Java', 'Optimization'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'beginner-dsa-sprint',
      title: 'Beginner DSA Sprint',
      description: 'A beginner-friendly contest focusing on fundamental data structures and sorting algorithms.',
      date: '2026-05-10',
      startTime: '11:00 AM',
      duration: '3 hours',
      participants: 400,
      maxParticipants: 1500,
      difficulty: 'Easy',
      category: 'Algorithm',
      type: 'public',
      prizePool: '$5,000',
      registrationDeadline: '2026-05-09',
      tags: ['Arrays', 'Sorting', 'Recursion', 'Python'],
      isFeatured: false,
      isFree: true
    },

    // ── AI / ML ────────────────────────────────────────────────
    {
      id: 'ai-ml-hackathon',
      title: 'AI/ML Hackathon 2026',
      description: 'Build innovative AI/ML solutions for real-world problems in 48 hours.',
      date: '2026-03-20',
      startTime: '9:00 AM',
      duration: '48 hours',
      participants: 850,
      maxParticipants: 1000,
      difficulty: 'Hard',
      category: 'AI/ML',
      type: 'public',
      prizePool: '$15,000',
      registrationDeadline: '2026-03-19',
      tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow', 'PyTorch'],
      isFeatured: true,
      isFree: false,
      registrationFee: 25
    },
    {
      id: 'nlp-challenge',
      title: 'NLP Challenge 2026',
      description: 'Compete to build the best Natural Language Processing model on a hidden benchmark dataset.',
      date: '2026-05-18',
      startTime: '10:00 AM',
      duration: '72 hours',
      participants: 620,
      maxParticipants: 900,
      difficulty: 'Hard',
      category: 'AI/ML',
      type: 'public',
      prizePool: '$12,000',
      registrationDeadline: '2026-05-17',
      tags: ['NLP', 'Transformers', 'HuggingFace', 'Python'],
      isFeatured: false,
      isFree: false,
      registrationFee: 20
    },
    {
      id: 'ai-for-good',
      title: 'AI for Good Hackathon',
      description: 'Use machine learning to solve pressing social and environmental challenges.',
      date: '2026-06-05',
      startTime: '9:00 AM',
      duration: '36 hours',
      participants: 880,
      maxParticipants: 1200,
      difficulty: 'Medium',
      category: 'AI/ML',
      type: 'public',
      prizePool: '$8,000',
      registrationDeadline: '2026-06-04',
      tags: ['AI', 'Social Impact', 'Scikit-learn', 'Python'],
      isFeatured: false,
      isFree: true
    },

    // ── WEB DEVELOPMENT ────────────────────────────────────────
    {
      id: 'frontend-frenzy',
      title: 'Frontend Frenzy',
      description: 'Design and build stunning, accessible UIs in React or Vue within 12 hours.',
      date: '2026-04-08',
      startTime: '10:00 AM',
      duration: '12 hours',
      participants: 700,
      maxParticipants: 1000,
      difficulty: 'Medium',
      category: 'Web Development',
      type: 'public',
      prizePool: '$8,000',
      registrationDeadline: '2026-04-07',
      tags: ['React', 'Vue', 'CSS', 'Accessibility', 'Tailwind'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'fullstack-sprint',
      title: 'Full-Stack Sprint',
      description: 'Build a complete full-stack web app from scratch — design, API, and deployment included.',
      date: '2026-05-22',
      startTime: '8:00 AM',
      duration: '24 hours',
      participants: 550,
      maxParticipants: 800,
      difficulty: 'Hard',
      category: 'Web Development',
      type: 'public',
      prizePool: '$10,000',
      registrationDeadline: '2026-05-21',
      tags: ['Node.js', 'React', 'PostgreSQL', 'REST API'],
      isFeatured: false,
      isFree: false,
      registrationFee: 15
    },
    {
      id: 'web-accessibility-cup',
      title: 'Web Accessibility Cup',
      description: 'Refactor provided web apps to meet WCAG 2.1 AA standards and score the highest accessibility audit.',
      date: '2026-06-14',
      startTime: '11:00 AM',
      duration: '8 hours',
      participants: 300,
      maxParticipants: 600,
      difficulty: 'Easy',
      category: 'Web Development',
      type: 'public',
      prizePool: '$4,000',
      registrationDeadline: '2026-06-13',
      tags: ['Accessibility', 'HTML', 'ARIA', 'CSS'],
      isFeatured: false,
      isFree: true
    },

    // ── DATA SCIENCE ───────────────────────────────────────────
    {
      id: 'data-science-bowl',
      title: 'Data Science Bowl 2026',
      description: 'Analyze large datasets and build predictive models to solve a real-world business problem.',
      date: '2026-04-15',
      startTime: '9:00 AM',
      duration: '48 hours',
      participants: 750,
      maxParticipants: 1000,
      difficulty: 'Medium',
      category: 'Data Science',
      type: 'public',
      prizePool: '$12,000',
      registrationDeadline: '2026-04-14',
      tags: ['Python', 'Pandas', 'Scikit-learn', 'EDA', 'Visualization'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'kaggle-style-blitz',
      title: 'Kaggle-Style Prediction Blitz',
      description: 'Fast-paced tabular data competition: highest leaderboard score in 6 hours wins.',
      date: '2026-05-30',
      startTime: '2:00 PM',
      duration: '6 hours',
      participants: 480,
      maxParticipants: 800,
      difficulty: 'Hard',
      category: 'Data Science',
      type: 'public',
      prizePool: '$10,000',
      registrationDeadline: '2026-05-29',
      tags: ['XGBoost', 'LightGBM', 'Feature Engineering', 'Python'],
      isFeatured: false,
      isFree: false,
      registrationFee: 20
    },
    {
      id: 'data-viz-challenge',
      title: 'Data Visualization Challenge',
      description: 'Turn raw public datasets into compelling, interactive visual stories using any charting library.',
      date: '2026-06-20',
      startTime: '10:00 AM',
      duration: '10 hours',
      participants: 370,
      maxParticipants: 700,
      difficulty: 'Easy',
      category: 'Data Science',
      type: 'public',
      prizePool: '$5,000',
      registrationDeadline: '2026-06-19',
      tags: ['D3.js', 'Matplotlib', 'Tableau', 'Storytelling'],
      isFeatured: false,
      isFree: true
    },

    // ── SECURITY ───────────────────────────────────────────────
    {
      id: 'cybersecurity-ctf',
      title: 'Cybersecurity CTF',
      description: 'Capture The Flag competition for cybersecurity enthusiasts across web, binary, and crypto domains.',
      date: '2026-04-12',
      startTime: '2:00 PM',
      duration: '24 hours',
      participants: 450,
      maxParticipants: 800,
      difficulty: 'Hard',
      category: 'Security',
      type: 'public',
      prizePool: '$20,000',
      registrationDeadline: '2026-04-11',
      tags: ['Security', 'CTF', 'Cryptography', 'Networking'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'bug-bounty-blitz',
      title: 'Bug Bounty Blitz',
      description: 'Find and responsibly disclose vulnerabilities in a sandboxed target application to earn points.',
      date: '2026-05-14',
      startTime: '10:00 AM',
      duration: '48 hours',
      participants: 320,
      maxParticipants: 600,
      difficulty: 'Hard',
      category: 'Security',
      type: 'public',
      prizePool: '$15,000',
      registrationDeadline: '2026-05-13',
      tags: ['Penetration Testing', 'OWASP', 'XSS', 'SQL Injection'],
      isFeatured: false,
      isFree: false,
      registrationFee: 30
    },
    {
      id: 'secure-coding-sprint',
      title: 'Secure Coding Sprint',
      description: 'Write the most secure implementation of given features. Judges attempt to break your code.',
      date: '2026-06-25',
      startTime: '9:00 AM',
      duration: '8 hours',
      participants: 280,
      maxParticipants: 500,
      difficulty: 'Medium',
      category: 'Security',
      type: 'public',
      prizePool: '$8,000',
      registrationDeadline: '2026-06-24',
      tags: ['Secure Coding', 'Python', 'Java', 'OWASP', 'Code Review'],
      isFeatured: false,
      isFree: true
    },

    // ── MOBILE ─────────────────────────────────────────────────
    {
      id: 'mobile-app-challenge',
      title: 'Mobile App Challenge 2026',
      description: 'Build a production-ready mobile app in React Native or Flutter in under 24 hours.',
      date: '2026-04-20',
      startTime: '10:00 AM',
      duration: '24 hours',
      participants: 600,
      maxParticipants: 900,
      difficulty: 'Medium',
      category: 'Mobile',
      type: 'public',
      prizePool: '$9,000',
      registrationDeadline: '2026-04-19',
      tags: ['React Native', 'Flutter', 'iOS', 'Android'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'ar-mobile-hackathon',
      title: 'AR Mobile Hackathon',
      description: 'Create an augmented reality mobile experience using ARKit, ARCore, or 8thWall.',
      date: '2026-05-25',
      startTime: '9:00 AM',
      duration: '36 hours',
      participants: 420,
      maxParticipants: 700,
      difficulty: 'Hard',
      category: 'Mobile',
      type: 'public',
      prizePool: '$10,000',
      registrationDeadline: '2026-05-24',
      tags: ['ARKit', 'ARCore', 'Unity', 'Swift', 'Kotlin'],
      isFeatured: false,
      isFree: false,
      registrationFee: 20
    },
    {
      id: 'ui-ux-mobile-cup',
      title: 'Mobile UI/UX Design Cup',
      description: 'Design and prototype a mobile app interface judged on usability, aesthetics, and accessibility.',
      date: '2026-06-18',
      startTime: '10:00 AM',
      duration: '12 hours',
      participants: 330,
      maxParticipants: 600,
      difficulty: 'Easy',
      category: 'Mobile',
      type: 'public',
      prizePool: '$5,000',
      registrationDeadline: '2026-06-17',
      tags: ['Figma', 'UI Design', 'UX', 'Prototyping'],
      isFeatured: false,
      isFree: true
    },

    // ── GAME DEVELOPMENT ───────────────────────────────────────
    {
      id: 'game-jam-2026',
      title: 'Global Game Jam 2026',
      description: 'Create a complete game around a secret theme revealed at start — solo or in teams of up to 3.',
      date: '2026-04-05',
      startTime: '6:00 PM',
      duration: '48 hours',
      participants: 500,
      maxParticipants: 800,
      difficulty: 'Medium',
      category: 'Game Development',
      type: 'public',
      prizePool: '$8,000',
      registrationDeadline: '2026-04-04',
      tags: ['Unity', 'Godot', 'Game Design', 'C#', 'GDScript'],
      isFeatured: true,
      isFree: true
    },
    {
      id: 'pixel-art-game-challenge',
      title: 'Pixel Art Game Challenge',
      description: 'Build a retro-style pixel art game in 72 hours. Judged on gameplay, art, and sound design.',
      date: '2026-05-16',
      startTime: '10:00 AM',
      duration: '72 hours',
      participants: 340,
      maxParticipants: 600,
      difficulty: 'Easy',
      category: 'Game Development',
      type: 'public',
      prizePool: '$6,000',
      registrationDeadline: '2026-05-15',
      tags: ['Pixel Art', 'Pygame', 'Godot', 'Aseprite'],
      isFeatured: false,
      isFree: true
    },
    {
      id: 'multiplayer-game-sprint',
      title: 'Multiplayer Game Sprint',
      description: 'Build a real-time multiplayer game with matchmaking, leaderboard, and at least 2 game modes.',
      date: '2026-06-28',
      startTime: '9:00 AM',
      duration: '48 hours',
      participants: 280,
      maxParticipants: 500,
      difficulty: 'Hard',
      category: 'Game Development',
      type: 'public',
      prizePool: '$8,000',
      registrationDeadline: '2026-06-27',
      tags: ['Unity', 'Photon', 'WebSockets', 'Node.js', 'Multiplayer'],
      isFeatured: false,
      isFree: false,
      registrationFee: 15
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContests(mockContests);
      setFilteredContests(mockContests);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = [...contests];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(contest =>
        contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(contest => contest.category === filters.category);
    }
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(contest => contest.difficulty === filters.difficulty);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(contest => contest.type === filters.type);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(contest => {
        const contestDate = new Date(contest.date);
        const diffTime = contestDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(filters.dateRange) {
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case 'quarter': return diffDays <= 90;
          default: return true;
        }
      });
    }
    
    setFilteredContests(filtered);
  }, [contests, searchQuery, filters]);

  const handleBookmark = (contestId) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(contestId)) {
      newBookmarked.delete(contestId);
    } else {
      newBookmarked.add(contestId);
    }
    setBookmarked(newBookmarked);
    localStorage.setItem('bookmarkedContests', JSON.stringify([...newBookmarked]));
  };

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedContests');
    if (savedBookmarks) {
      setBookmarked(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  // Read category query param from URL and apply filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [location.search]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Algorithm': return 'bg-blue-100 text-blue-800';
      case 'AI/ML': return 'bg-purple-100 text-purple-800';
      case 'Web Development': return 'bg-green-100 text-green-800';
      case 'Data Science': return 'bg-orange-100 text-orange-800';
      case 'Security': return 'bg-red-100 text-red-800';
      case 'Mobile': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (date) => {
    const contestDate = new Date(date);
    const now = new Date();
    const diffMs = contestDate - now;
    
    if (diffMs <= 0) return 'Started';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days`;
    return `${hours} hours`;
  };

  const categories = [
    'Algorithm', 'AI/ML', 'Web Development', 'Data Science',
    'Security', 'Mobile', 'Game Development'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Upcoming Contests</h1>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Discover and participate in exciting programming competitions. 
              Sharpen your skills and compete with developers worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{contests.length}</div>
                <div className="text-white/80">Total Contests</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">
                  {contests.filter(c => c.isFree).length}
                </div>
                <div className="text-white/80">Free to Join</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">
                  ${contests.reduce((sum, c) => {
                    const amount = parseInt(c.prizePool.replace('$', '').replace(',', '')) || 0;
                    return sum + amount;
                  }, 0).toLocaleString()}+
                </div>
                <div className="text-white/80">Total Prize Pool</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">
                  {contests.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
                </div>
                <div className="text-white/80">Total Participants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contests by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contest Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Upcoming</option>
                  <option value="week">Next 7 Days</option>
                  <option value="month">Next 30 Days</option>
                  <option value="quarter">Next 90 Days</option>
                </select>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters({ category: 'all', difficulty: 'all', type: 'all', dateRange: 'all' })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
              >
                Clear Filters
              </button>
              <Link
                to="/dashboard/contests/my"
                className="px-4 py-2 border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                View My Contests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {filteredContests.length} Contest{filteredContests.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All upcoming contests'}
            </p>
          </div>
        </div>
      </div>

      {/* Contests Grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredContests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contests found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ category: 'all', difficulty: 'all', type: 'all', dateRange: 'all' });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Contests */}
            {filteredContests.filter(c => c.isFeatured).length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">Featured Contests</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredContests.filter(c => c.isFeatured).map((contest) => (
                    <div key={contest.id} className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl overflow-hidden shadow-lg">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Featured</span>
                              <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(contest.difficulty)}`}>
                                {contest.difficulty}
                              </span>
                              {contest.isFree ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">FREE</span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                                  ${contest.registrationFee}
                                </span>
                              )}
                            </div>
                            
                            <h4 className="text-2xl font-bold mb-2">{contest.title}</h4>
                            <p className="text-white/90 mb-4">{contest.description}</p>
                          </div>
                          
                          <button
                            onClick={() => handleBookmark(contest.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              bookmarked.has(contest.id)
                                ? 'text-yellow-300 hover:text-yellow-400'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${bookmarked.has(contest.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{contest.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{contest.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{contest.participants} registered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            <span>{contest.prizePool}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {contest.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">{tag}</span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/dashboard/contests/${contest.id}`}
                              className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/dashboard/contests/${contest.id}/results`}
                              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium"
                            >
                              Results
                            </Link>
                            <Link
                              to={`/dashboard/contests/${contest.id}/register`}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                            >
                              Register Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Contests */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Contests</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.map((contest) => (
                  <div key={contest.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(contest.category)}`}>
                              {contest.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                              {contest.difficulty}
                            </span>
                            {contest.type === 'private' && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Private
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{contest.title}</h4>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contest.description}</p>
                        </div>
                        
                        <button
                          onClick={() => handleBookmark(contest.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarked.has(contest.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${bookmarked.has(contest.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{contest.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{contest.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{contest.participants}/{contest.maxParticipants}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{contest.prizePool}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(contest.participants / contest.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {contest.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Starts in {formatTimeRemaining(contest.date)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/contests/${contest.id}`}
                            className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                          >
                            Details
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/dashboard/contests/${contest.id}/results`}
                            className="px-3 py-1.5 text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Results
                          </Link>
                          <Link
                            to={`/dashboard/contests/${contest.id}/register`}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contest Categories Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Contest Categories</h3>
              <p className="text-gray-600 mt-1">Browse competitions by technology domain</p>
            </div>
            <Link
              to={location.pathname}
              onClick={() => {
                setFilters({ category: 'all', difficulty: 'all', type: 'all', dateRange: 'all' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All Categories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesData.map((category) => (
              <Link
                key={category.id}
                to={`${location.pathname}?category=${encodeURIComponent(category.name)}`}
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: category.name }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <span className="font-bold text-blue-700 text-xl">{category.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.contests} contest{category.contests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prize Pool</span>
                    <span className="font-semibold text-green-600">{category.prize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Participants</span>
                    <span className="font-semibold text-blue-600">{category.participants.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  View All Contests
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingContests;