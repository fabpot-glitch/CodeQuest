import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RecordingFilters from './RecordingFilters';
import RecordingList from './RecordingList';
import RecordingPlayer from './RecordingPlayer';
import RecordingAnalytics from './RecordingAnalytics';
import './RecordingsDashboard.css';

const RecordingsDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    interviewer: 'all',
    watched: 'all',
    sortBy: 'date',
    quality: 'all',
    duration: 'all',
    tag: 'all',
    playlist: 'all',
    customDateStart: '',
    customDateEnd: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [bookmarks, setBookmarks] = useState({});
  const [notes, setNotes] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [stats, setStats] = useState({
    totalRecordings: 0,
    totalWatchTime: '0m',
    averageRating: '0',
    completionRate: '0',
    totalDownloads: 0,
    totalShares: 0,
    totalBookmarks: 0,
    totalNotes: 0,
    watchTimeByDay: [],
    popularTags: []
  });

  // Load data from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('recordingBookmarks');
    const savedNotes = localStorage.getItem('recordingNotes');
    const savedPlaylists = localStorage.getItem('recordingPlaylists');
    const savedRecordings = localStorage.getItem('recordings');
    
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    
    // Load saved recordings if they exist
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
      setFilteredRecordings(JSON.parse(savedRecordings));
      calculateStats(JSON.parse(savedRecordings));
      setLoading(false);
    } else {
      // Mock data - Only video recordings, no audio
      setTimeout(() => {
        const mockRecordings = [
          {
            id: 1,
            sessionId: 101,
            title: 'Technical Interview Practice',
            sessionTitle: 'Technical Interview Practice',
            interviewer: 'Sarah Johnson',
            interviewerCompany: 'Google',
            date: '2024-01-15',
            duration: 3600,
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            size: 250,
            format: 'mp4',
            type: 'video',
            mediaType: 'video',
            quality: '1080p',
            watched: true,
            watchProgress: 100,
            rating: 4.8,
            notes: notes[1] || 'Great session! Learned a lot about algorithms.',
            keyMoments: [
              { time: 120, description: 'Introduction to algorithms' },
              { time: 600, description: 'Binary search explanation' },
              { time: 1200, description: 'Practice problem solving' },
              { time: 2400, description: 'Feedback and tips' }
            ],
            feedback: {
              strengths: ['Clear explanation', 'Good problem solving approach'],
              improvements: ['Could cover more edge cases'],
              tips: ['Practice more on dynamic programming']
            },
            downloads: 3,
            shares: 2,
            bookmarks: bookmarks[1] || [
              { id: 1, time: 900, note: 'Important concept' },
              { id: 2, time: 1800, note: 'Review this algorithm' }
            ],
            tags: ['Algorithms', 'Data Structures', 'Coding'],
            transcript: 'Full transcript text would be here...',
            comments: [
              { id: 1, user: 'John', text: 'Great explanation!', timestamp: '2024-01-16' }
            ]
          },
          {
            id: 2,
            sessionId: 102,
            title: 'System Design Masterclass',
            sessionTitle: 'System Design Masterclass',
            interviewer: 'Alex Rivera',
            interviewerCompany: 'Netflix',
            date: '2024-01-16',
            duration: 5400,
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            size: 450,
            format: 'mp4',
            type: 'video',
            mediaType: 'video',
            quality: '4K',
            watched: false,
            watchProgress: 45,
            rating: 4.9,
            notes: notes[2] || '',
            keyMoments: [
              { time: 180, description: 'System design basics' },
              { time: 900, description: 'Microservices architecture' },
              { time: 2100, description: 'Scalability patterns' },
              { time: 3600, description: 'Case study: Netflix' }
            ],
            feedback: {
              strengths: ['Real-world examples', 'Deep technical insights'],
              improvements: [],
              tips: ['Review distributed systems concepts']
            },
            downloads: 5,
            shares: 3,
            bookmarks: bookmarks[2] || [],
            tags: ['Scalability', 'Microservices', 'Architecture'],
            transcript: 'Full transcript text would be here...',
            comments: []
          },
          {
            id: 3,
            sessionId: 103,
            title: 'Frontend Interview Prep',
            sessionTitle: 'Frontend Interview Prep',
            interviewer: 'Emily Rodriguez',
            interviewerCompany: 'Meta',
            date: '2024-01-17',
            duration: 4500,
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            size: 380,
            format: 'mp4',
            type: 'video',
            mediaType: 'video',
            quality: '1080p',
            watched: true,
            watchProgress: 100,
            rating: 4.7,
            notes: notes[3] || 'Great React tips!',
            keyMoments: [
              { time: 240, description: 'React hooks deep dive' },
              { time: 1200, description: 'State management patterns' },
              { time: 2400, description: 'Performance optimization' },
              { time: 3600, description: 'Interview tips' }
            ],
            feedback: {
              strengths: ['Practical examples', 'Good performance tips'],
              improvements: ['Could cover more advanced patterns'],
              tips: ['Practice building custom hooks']
            },
            downloads: 4,
            shares: 2,
            bookmarks: bookmarks[3] || [],
            tags: ['React', 'JavaScript', 'CSS'],
            transcript: 'Full transcript text would be here...',
            comments: []
          },
          {
            id: 4,
            sessionId: 104,
            title: 'Behavioral Interview Workshop',
            sessionTitle: 'Behavioral Interview Workshop',
            interviewer: 'Mike Chen',
            interviewerCompany: 'Amazon',
            date: '2024-01-14',
            duration: 2700,
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            size: 180,
            format: 'mp4',
            type: 'video',
            mediaType: 'video',
            quality: '720p',
            watched: false,
            watchProgress: 30,
            rating: 4.9,
            notes: notes[4] || '',
            keyMoments: [
              { time: 120, description: 'STAR method introduction' },
              { time: 600, description: 'Common questions' },
              { time: 1200, description: 'Practice scenarios' },
              { time: 2100, description: 'Feedback session' }
            ],
            feedback: {
              strengths: ['Structured approach', 'Good examples'],
              improvements: [],
              tips: ['Practice with real examples']
            },
            downloads: 6,
            shares: 4,
            bookmarks: bookmarks[4] || [],
            tags: ['Leadership', 'STAR Method', 'Communication'],
            transcript: 'Full transcript text would be here...',
            comments: []
          },
          {
            id: 5,
            sessionId: 105,
            title: 'Data Science Interview',
            sessionTitle: 'Data Science Interview',
            interviewer: 'David Kim',
            interviewerCompany: 'Microsoft',
            date: '2024-01-18',
            duration: 3600,
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            size: 320,
            format: 'mp4',
            type: 'video',
            mediaType: 'video',
            quality: '1080p',
            watched: false,
            watchProgress: 0,
            rating: 4.8,
            notes: notes[5] || '',
            keyMoments: [
              { time: 180, description: 'ML basics' },
              { time: 900, description: 'Python implementation' },
              { time: 1800, description: 'Statistics review' },
              { time: 2700, description: 'Case studies' }
            ],
            feedback: {
              strengths: ['Clear explanations', 'Good examples'],
              improvements: [],
              tips: ['Practice with real datasets']
            },
            downloads: 2,
            shares: 1,
            bookmarks: bookmarks[5] || [],
            tags: ['Python', 'ML', 'Statistics'],
            transcript: 'Full transcript text would be here...',
            comments: []
          }
        ];

        setRecordings(mockRecordings);
        setFilteredRecordings(mockRecordings);
        calculateStats(mockRecordings);
        localStorage.setItem('recordings', JSON.stringify(mockRecordings));
        setLoading(false);
      }, 1000);
    }
  }, []); // Empty dependency array - only run once

  // Save recordings to localStorage whenever they change
  useEffect(() => {
    if (recordings.length > 0) {
      localStorage.setItem('recordings', JSON.stringify(recordings));
    }
  }, [recordings]);

  // Save to localStorage for bookmarks, notes, playlists
  useEffect(() => {
    localStorage.setItem('recordingBookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('recordingNotes', JSON.stringify(notes));
    localStorage.setItem('recordingPlaylists', JSON.stringify(playlists));
  }, [bookmarks, notes, playlists]);

  // Update recordings when notes or bookmarks change
  useEffect(() => {
    if (recordings.length > 0) {
      const updatedRecordings = recordings.map(rec => ({
        ...rec,
        notes: notes[rec.id] || rec.notes,
        bookmarks: bookmarks[rec.id] || rec.bookmarks
      }));
      setRecordings(updatedRecordings);
      setFilteredRecordings(updatedRecordings);
      calculateStats(updatedRecordings);
    }
  }, [notes, bookmarks]);

  const calculateStats = useCallback((recordingsData) => {
    const totalRecordings = recordingsData.length;
    const totalWatchTime = recordingsData.reduce((acc, rec) => {
      return acc + (rec.watched ? rec.duration : (rec.duration * rec.watchProgress / 100));
    }, 0);
    
    const averageRating = recordingsData.reduce((acc, rec) => acc + rec.rating, 0) / totalRecordings;
    const watchedCount = recordingsData.filter(rec => rec.watched).length;
    const completionRate = (watchedCount / totalRecordings) * 100;
    const totalDownloads = recordingsData.reduce((acc, rec) => acc + rec.downloads, 0);
    const totalShares = recordingsData.reduce((acc, rec) => acc + rec.shares, 0);
    const totalBookmarks = Object.values(bookmarks).flat().length;
    const totalNotes = Object.values(notes).filter(n => n && n.length > 0).length;

    // Calculate popular tags
    const tagCount = {};
    recordingsData.forEach(rec => {
      rec.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    setStats({
      totalRecordings,
      totalWatchTime: formatDuration(totalWatchTime),
      averageRating: averageRating.toFixed(1),
      completionRate: completionRate.toFixed(0),
      totalDownloads,
      totalShares,
      totalBookmarks,
      totalNotes,
      popularTags
    });
  }, [bookmarks, notes]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default navigation if onBack is not provided
      navigate(-1);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filters) => {
    let filtered = [...recordings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(rec =>
        rec.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        rec.interviewer.toLowerCase().includes(filters.search.toLowerCase()) ||
        rec.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          filtered = filtered.filter(rec => new Date(rec.date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(rec => new Date(rec.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(rec => new Date(rec.date) >= filterDate);
          break;
        default:
          break;
      }
    }

    // Custom date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(rec => 
        new Date(rec.date) >= new Date(dateRange.start) &&
        new Date(rec.date) <= new Date(dateRange.end)
      );
    }

    // Interviewer filter
    if (filters.interviewer !== 'all') {
      filtered = filtered.filter(rec => rec.interviewer === filters.interviewer);
    }

    // Watched filter
    if (filters.watched !== 'all') {
      const isWatched = filters.watched === 'watched';
      filtered = filtered.filter(rec => rec.watched === isWatched);
    }

    // Quality filter
    if (selectedQuality !== 'all') {
      filtered = filtered.filter(rec => rec.quality === selectedQuality);
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      const [min, max] = selectedDuration.split('-').map(Number);
      filtered = filtered.filter(rec => {
        const minutes = rec.duration / 60;
        if (max) {
          return minutes >= min && minutes <= max;
        } else {
          return minutes >= min;
        }
      });
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(rec => rec.tags.includes(selectedTag));
    }

    // Playlist filter
    if (selectedPlaylist !== 'all') {
      const playlist = playlists.find(p => p.id.toString() === selectedPlaylist);
      if (playlist) {
        filtered = filtered.filter(rec => playlist.recordings.includes(rec.id));
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      switch(filters.sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return b.duration - a.duration;
        case 'progress':
          return b.watchProgress - a.watchProgress;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'shares':
          return b.shares - a.shares;
        default:
          return 0;
      }
    });

    setFilteredRecordings(filtered);
  };

  // Apply filters when filter criteria change
  useEffect(() => {
    applyFilters(filters);
  }, [filters, selectedQuality, selectedDuration, selectedTag, selectedPlaylist, dateRange, recordings]);

  const handlePlayRecording = (recording) => {
    setSelectedRecording(recording);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedRecording(null);
  };

  const handleDownloadRecording = async (recording) => {
    try {
      // Determine the URL to download
      const downloadUrl = recording.videoUrl;
      const fileFormat = recording.format || 'mp4';
      
      // Simulate download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${recording.title}.${fileFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      const updatedRecordings = recordings.map(rec =>
        rec.id === recording.id ? { ...rec, downloads: rec.downloads + 1 } : rec
      );
      setRecordings(updatedRecordings);
      setFilteredRecordings(updatedRecordings);
      calculateStats(updatedRecordings);

      alert(`Downloading ${recording.title}...`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleShareRecording = async (recording) => {
    const shareData = {
      title: recording.title,
      text: `Check out this interview recording with ${recording.interviewer} from ${recording.interviewerCompany}`,
      url: `${window.location.origin}/recordings/${recording.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }

      // Update share count
      const updatedRecordings = recordings.map(rec =>
        rec.id === recording.id ? { ...rec, shares: rec.shares + 1 } : rec
      );
      setRecordings(updatedRecordings);
      setFilteredRecordings(updatedRecordings);
      calculateStats(updatedRecordings);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed. Please try again.');
    }
  };

  const handleAddBookmark = (recordingId, time, note) => {
    const newBookmark = { 
      id: Date.now(), 
      time, 
      note 
    };
    
    const updatedBookmarks = {
      ...bookmarks,
      [recordingId]: [...(bookmarks[recordingId] || []), newBookmark]
    };
    setBookmarks(updatedBookmarks);
    alert('Bookmark added successfully!');
  };

  const handleRemoveBookmark = (recordingId, bookmarkId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      const updatedBookmarks = {
        ...bookmarks,
        [recordingId]: bookmarks[recordingId].filter(b => b.id !== bookmarkId)
      };
      setBookmarks(updatedBookmarks);
      alert('Bookmark removed successfully!');
    }
  };

  const handleAddNote = (recordingId, note) => {
    const updatedNotes = { ...notes, [recordingId]: note };
    setNotes(updatedNotes);
    alert('Note saved successfully!');
  };

  const handleUpdateProgress = (recordingId, progress) => {
    const updatedRecordings = recordings.map(rec =>
      rec.id === recordingId
        ? { ...rec, watchProgress: progress, watched: progress === 100 }
        : rec
    );
    setRecordings(updatedRecordings);
    setFilteredRecordings(updatedRecordings);
    calculateStats(updatedRecordings);
  };

  const handleCreatePlaylist = (name) => {
    if (!name.trim()) {
      alert('Please enter a playlist name');
      return;
    }
    
    const newPlaylist = {
      id: Date.now(),
      name,
      recordings: [],
      createdAt: new Date().toISOString()
    };
    setPlaylists([...playlists, newPlaylist]);
    alert(`Playlist "${name}" created successfully!`);
  };

  const handleAddToPlaylist = (playlistId, recordingId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist.recordings.includes(recordingId)) {
      alert('Recording already in playlist');
      return;
    }
    
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId
        ? { ...p, recordings: [...p.recordings, recordingId] }
        : p
    );
    setPlaylists(updatedPlaylists);
    alert(`Added to playlist "${playlist.name}"`);
  };

  const handleRemoveFromPlaylist = (playlistId, recordingId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (window.confirm(`Remove from playlist "${playlist.name}"?`)) {
      const updatedPlaylists = playlists.map(p =>
        p.id === playlistId
          ? { ...p, recordings: p.recordings.filter(id => id !== recordingId) }
          : p
      );
      setPlaylists(updatedPlaylists);
      alert('Removed from playlist');
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (window.confirm(`Delete playlist "${playlist.name}"? This action cannot be undone.`)) {
      const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
      setPlaylists(updatedPlaylists);
      if (selectedPlaylist === playlistId.toString()) {
        setSelectedPlaylist('all');
      }
      alert('Playlist deleted');
    }
  };

  const handleDeleteRecording = (recordingId) => {
    const recording = recordings.find(r => r.id === recordingId);
    setRecordingToDelete(recording);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRecording = () => {
    if (recordingToDelete) {
      const updatedRecordings = recordings.filter(r => r.id !== recordingToDelete.id);
      setRecordings(updatedRecordings);
      setFilteredRecordings(updatedRecordings);
      calculateStats(updatedRecordings);
      
      // Remove from any playlists
      const updatedPlaylists = playlists.map(p => ({
        ...p,
        recordings: p.recordings.filter(id => id !== recordingToDelete.id)
      }));
      setPlaylists(updatedPlaylists);
      
      // Remove bookmarks and notes
      const { [recordingToDelete.id]: _, ...remainingBookmarks } = bookmarks;
      const { [recordingToDelete.id]: __, ...remainingNotes } = notes;
      setBookmarks(remainingBookmarks);
      setNotes(remainingNotes);
      
      setShowDeleteConfirm(false);
      setRecordingToDelete(null);
      alert('Recording deleted successfully');
    }
  };

  const handleBulkSelect = (recordingId) => {
    setSelectedRecordings(prev => {
      if (prev.includes(recordingId)) {
        return prev.filter(id => id !== recordingId);
      } else {
        return [...prev, recordingId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRecordings.length === filteredRecordings.length) {
      setSelectedRecordings([]);
    } else {
      setSelectedRecordings(filteredRecordings.map(r => r.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecordings.length === 0) {
      alert('No recordings selected');
      return;
    }
    
    if (window.confirm(`Delete ${selectedRecordings.length} selected recordings?`)) {
      const updatedRecordings = recordings.filter(r => !selectedRecordings.includes(r.id));
      setRecordings(updatedRecordings);
      setFilteredRecordings(updatedRecordings);
      calculateStats(updatedRecordings);
      
      // Remove from playlists
      const updatedPlaylists = playlists.map(p => ({
        ...p,
        recordings: p.recordings.filter(id => !selectedRecordings.includes(id))
      }));
      setPlaylists(updatedPlaylists);
      
      // Remove bookmarks and notes
      const remainingBookmarks = { ...bookmarks };
      const remainingNotes = { ...notes };
      selectedRecordings.forEach(id => {
        delete remainingBookmarks[id];
        delete remainingNotes[id];
      });
      setBookmarks(remainingBookmarks);
      setNotes(remainingNotes);
      
      setSelectedRecordings([]);
      setShowBulkActions(false);
      alert(`${selectedRecordings.length} recordings deleted`);
    }
  };

  const handleBulkAddToPlaylist = (playlistId) => {
    if (selectedRecordings.length === 0) {
      alert('No recordings selected');
      return;
    }
    
    const playlist = playlists.find(p => p.id === playlistId);
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        const newRecordings = [...new Set([...p.recordings, ...selectedRecordings])];
        return { ...p, recordings: newRecordings };
      }
      return p;
    });
    setPlaylists(updatedPlaylists);
    setSelectedRecordings([]);
    setShowBulkActions(false);
    alert(`Added ${selectedRecordings.length} recordings to "${playlist.name}"`);
  };

  const handleMarkAsWatched = (recordingId) => {
    handleUpdateProgress(recordingId, 100);
  };

  const handleMarkAsUnwatched = (recordingId) => {
    handleUpdateProgress(recordingId, 0);
  };

  const handleExportData = () => {
    const data = {
      recordings,
      bookmarks,
      notes,
      playlists,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recordings-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Data exported successfully!');
  };

  const handleImportData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!data.recordings || !Array.isArray(data.recordings)) {
          throw new Error('Invalid file format');
        }
        
        setRecordings(data.recordings);
        setBookmarks(data.bookmarks || {});
        setNotes(data.notes || {});
        setPlaylists(data.playlists || []);
        alert(`Imported ${data.recordings.length} recordings successfully!`);
      } catch (error) {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Get unique values for filters
  const interviewers = useMemo(() => 
    [...new Set(recordings.map(rec => rec.interviewer))],
    [recordings]
  );

  const allTags = useMemo(() => 
    [...new Set(recordings.flatMap(rec => rec.tags))],
    [recordings]
  );

  const qualities = useMemo(() => 
    [...new Set(recordings.map(rec => rec.quality))],
    [recordings]
  );

  return (
    <div className="recordings-dashboard">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && recordingToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <h2>Delete Recording</h2>
            <p>Are you sure you want to delete "{recordingToDelete.title}"?</p>
            <p className="warning-text">This action cannot be undone. All bookmarks and notes associated with this recording will also be deleted.</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDeleteRecording}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && selectedRecordings.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="selected-count">{selectedRecordings.length} selected</span>
          <div className="bulk-actions">
            <button className="bulk-action-btn" onClick={handleSelectAll}>
              {selectedRecordings.length === filteredRecordings.length ? 'Deselect All' : 'Select All'}
            </button>
            <button className="bulk-action-btn" onClick={handleBulkDelete}>
              Delete Selected
            </button>
            {playlists.length > 0 && (
              <select 
                className="bulk-action-select" 
                onChange={(e) => handleBulkAddToPlaylist(Number(e.target.value))}
                value=""
              >
                <option value="" disabled>Add to Playlist...</option>
                {playlists.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
            <button className="bulk-action-btn close" onClick={() => {
              setSelectedRecordings([]);
              setShowBulkActions(false);
            }}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="recordings-header">
        <div className="header-left">
          <h1>
            <span className="header-icon">🎥</span>
            Session Recordings
          </h1>
          <p className="header-subtitle">Review and analyze your past interview performances</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExportData} title="Export data">
            📤 Export
          </button>
          <label className="import-btn" title="Import data">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleImportData(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
          <button className="bulk-action-toggle" onClick={() => setShowBulkActions(true)} title="Bulk actions">
            ☰
          </button>
          <button className="back-btn" onClick={handleBack} title="Go back">
            ← Back
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <RecordingAnalytics stats={stats} />

      {/* Filters Section */}
      <RecordingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        interviewers={interviewers}
        tags={allTags}
        qualities={qualities}
        playlists={playlists}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={filters.sortBy}
        onSortChange={(value) => setFilters({...filters, sortBy: value})}
        selectedInterviewer={selectedInterviewer}
        onInterviewerChange={setSelectedInterviewer}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedQuality={selectedQuality}
        onQualityChange={setSelectedQuality}
        selectedDuration={selectedDuration}
        onDurationChange={setSelectedDuration}
        selectedPlaylist={selectedPlaylist}
        onPlaylistChange={setSelectedPlaylist}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
      />

      {/* Recordings List */}
      <RecordingList
        recordings={filteredRecordings}
        loading={loading}
        viewMode={viewMode}
        onPlay={handlePlayRecording}
        onDownload={handleDownloadRecording}
        onShare={handleShareRecording}
        onAddBookmark={handleAddBookmark}
        onRemoveBookmark={handleRemoveBookmark}
        onAddNote={handleAddNote}
        onDelete={handleDeleteRecording}
        onMarkWatched={handleMarkAsWatched}
        onMarkUnwatched={handleMarkAsUnwatched}
        onBulkSelect={handleBulkSelect}
        selectedRecordings={selectedRecordings}
        bookmarks={bookmarks}
        notes={notes}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
        onRemoveFromPlaylist={handleRemoveFromPlaylist}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* Recording Player Modal */}
      {showPlayer && selectedRecording && (
        <RecordingPlayer
          recording={selectedRecording}
          onClose={handleClosePlayer}
          onDownload={handleDownloadRecording}
          onShare={handleShareRecording}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onAddNote={handleAddNote}
          onUpdateProgress={handleUpdateProgress}
          bookmarks={bookmarks[selectedRecording.id] || []}
          notes={notes[selectedRecording.id] || ''}
        />
      )}
    </div>
  );
};

export default RecordingsDashboard;