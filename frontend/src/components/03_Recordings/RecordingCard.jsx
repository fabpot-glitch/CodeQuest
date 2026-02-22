import React, { useState, useRef, useEffect } from 'react';

const RecordingCard = ({ 
  recording, 
  viewMode, 
  onPlay, 
  onDownload, 
  onShare,
  onAddBookmark,
  onRemoveBookmark,
  onAddNote,
  bookmarks,
  notes,
  playlists,
  onAddToPlaylist,
  onCreatePlaylist
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(notes || '');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(recording.duration || 0);
  const [audioProgress, setAudioProgress] = useState(recording.watchProgress || 0);
  
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // Check if recording is audio-only
  const isAudioOnly = recording.type === 'audio' || 
                      recording.mediaType === 'audio' || 
                      recording.format === 'mp3' ||
                      recording.format === 'audio' ||
                      recording.audioUrl;

  useEffect(() => {
    // Only initialize audio if this is an audio recording
    if (isAudioOnly && audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleAudioEnd);
      
      // Set initial volume
      audioRef.current.volume = 1;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isAudioOnly]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (recording.watchProgress > 0 && recording.watchProgress < 100) {
        audioRef.current.currentTime = (recording.watchProgress / 100) * audioRef.current.duration;
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setAudioProgress(100);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        clearInterval(progressInterval.current);
      } else {
        audioRef.current.play();
        progressInterval.current = setInterval(() => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setAudioProgress(progress);
          }
        }, 100);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getQualityBadge = (quality) => {
    const badges = {
      '4K': { color: '#f59e0b', text: '4K', icon: '✨' },
      '1080p': { color: '#10b981', text: 'HD', icon: '⭐' },
      '720p': { color: '#3b82f6', text: 'HD', icon: '⭐' },
      'audio': { color: '#8b5cf6', text: 'AUDIO', icon: '🎧' },
      'high': { color: '#8b5cf6', text: 'HIGH', icon: '🎧' },
      'medium': { color: '#8b5cf6', text: 'MED', icon: '🎧' },
      'low': { color: '#8b5cf6', text: 'LOW', icon: '🎧' }
    };
    return badges[quality] || { color: '#6b7280', text: quality || 'SD', icon: '📹' };
  };

  const quality = getQualityBadge(recording.quality);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay(recording);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload(recording);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShare(recording);
  };

  const handleAddToPlaylist = (e, playlistId) => {
    e.stopPropagation();
    onAddToPlaylist(playlistId, recording.id);
    setShowPlaylistMenu(false);
  };

  const handleSaveNote = (e) => {
    e.stopPropagation();
    onAddNote(recording.id, noteText);
    setShowNoteInput(false);
  };

  return (
    <div 
      className={`recording-card ${viewMode} ${isAudioOnly ? 'audio-card' : 'video-card'}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Audio element - only for audio recordings */}
      {isAudioOnly && recording.audioUrl && (
        <audio
          ref={audioRef}
          src={recording.audioUrl}
          preload="metadata"
        />
      )}

      {/* Thumbnail Section */}
      <div className="recording-thumbnail" onClick={isAudioOnly ? undefined : handlePlayClick}>
        {isAudioOnly ? (
          /* AUDIO UI - Show waveform and audio controls */
          <div className="audio-thumbnail">
            <div className="audio-waveform">
              <div className="waveform-bar" style={{ animationDelay: '0s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.1s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.2s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.3s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.4s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.5s' }}></div>
              <div className="waveform-bar" style={{ animationDelay: '0.6s' }}></div>
            </div>
            <div className="audio-icon">🎧</div>
            
            {/* Audio Controls Overlay */}
            {showOptions && (
              <div className="audio-controls-overlay" onClick={(e) => e.stopPropagation()}>
                <button className="audio-play-btn" onClick={togglePlay}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div className="audio-progress">
                  <span className="audio-time">{formatDuration(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioProgress}
                    onChange={handleSeek}
                    className="audio-slider"
                  />
                  <span className="audio-time">{formatDuration(duration)}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* VIDEO UI - Show thumbnail with play overlay */
          <>
            <img 
              src={recording.thumbnail || 'https://via.placeholder.com/400x225?text=No+Thumbnail'} 
              alt={recording.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x225?text=No+Thumbnail';
              }}
            />
            <div className="play-overlay">
              <span className="play-icon" aria-label="Play recording">▶</span>
            </div>
          </>
        )}
        
        {/* Progress Overlay - for both audio and video */}
        {!recording.watched && audioProgress > 0 && (
          <div className="progress-overlay">
            <div 
              className="progress-bar" 
              style={{ width: `${audioProgress}%` }} 
              aria-label={`${audioProgress}% watched`}
            />
          </div>
        )}
        
        {/* Duration Badge - for both */}
        <div className="duration-badge" aria-label={`Duration: ${formatDuration(duration)}`}>
          ⏱️ {formatDuration(duration)}
        </div>
        
        {/* Quality Badge - for both */}
        <div 
          className="quality-badge" 
          style={{ backgroundColor: quality.color }}
          aria-label={`Quality: ${quality.text}`}
        >
          {quality.icon} {quality.text}
        </div>

        {/* Quick Actions - for both */}
        {showOptions && (
          <div className="quick-actions">
            <button onClick={handlePlayClick} title="Play">▶</button>
            <button onClick={handleDownloadClick} title="Download">💾</button>
            <button onClick={handleShareClick} title="Share">↗️</button>
            <button onClick={() => setShowBookmarks(!showBookmarks)} title="Bookmarks">
              🔖 {bookmarks?.length || 0}
            </button>
            <button onClick={() => setShowNoteInput(!showNoteInput)} title="Notes">
              📝
            </button>
            <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} title="Add to playlist">
              📋
            </button>
          </div>
        )}
      </div>

      {/* Info Section - Same for both */}
      <div className="recording-info">
        <div className="recording-header">
          <h3 onClick={handlePlayClick} title={recording.title}>
            {recording.title || 'Untitled Recording'}
          </h3>
          <div className="recording-meta">
            <span className="interviewer">{recording.interviewer || 'Unknown Interviewer'}</span>
            <span className="company">{recording.interviewerCompany || 'Unknown Company'}</span>
          </div>
        </div>

        {/* Details */}
        <div className="recording-details">
          <span className="date" title="Recording date">📅 {formatDate(recording.date)}</span>
          <span className="size" title="File size">💾 {recording.size || 0} MB</span>
          <span className="rating" title="Rating">⭐ {recording.rating || 'N/A'}</span>
          {isAudioOnly && <span className="audio-indicator" title="Audio recording">🎧 Audio</span>}
          {!isAudioOnly && <span className="video-indicator" title="Video recording">📹 Video</span>}
        </div>

        {/* Tags */}
        {recording.tags && recording.tags.length > 0 && (
          <div className="recording-tags">
            {recording.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag" title={tag}>{tag}</span>
            ))}
            {recording.tags.length > 3 && (
              <span className="tag more-tag" title={`${recording.tags.length - 3} more tags`}>
                +{recording.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="recording-stats">
          <span className="stat" title="Downloads">👁️ {recording.downloads || 0}</span>
          <span className="stat" title="Shares">↗️ {recording.shares || 0}</span>
          <span className="stat" title="Bookmarks">🔖 {bookmarks?.length || 0}</span>
        </div>

        {/* Watch Status */}
        {recording.watched ? (
          <div className="watched-badge" title="You have watched this recording">
            ✓ Watched
          </div>
        ) : (
          <div className="progress-text" title={`${audioProgress || 0}% watched`}>
            ⏳ {audioProgress || 0}% watched
          </div>
        )}

        {/* Mini Audio Player for List View - only for audio */}
        {isAudioOnly && viewMode === 'list' && (
          <div className="mini-audio-player" onClick={(e) => e.stopPropagation()}>
            <button className="mini-play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <div className="mini-progress">
              <div 
                className="mini-progress-bar" 
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <span className="mini-time">{formatDuration(currentTime)}</span>
          </div>
        )}

        {/* Bookmarks Preview */}
        {showBookmarks && bookmarks?.length > 0 && (
          <div className="bookmarks-preview">
            <h4>Bookmarks</h4>
            {bookmarks.map((bookmark, index) => (
              <div key={index} className="bookmark-item">
                <span className="bookmark-time">
                  {formatDuration(bookmark.time)}
                </span>
                <span className="bookmark-note">{bookmark.note}</span>
                <button 
                  className="remove-bookmark"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(recording.id, bookmark.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Note Input */}
        {showNoteInput && (
          <div className="note-input">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your notes..."
              rows="2"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={handleSaveNote}>Save</button>
          </div>
        )}

        {/* Playlist Menu */}
        {showPlaylistMenu && (
          <div className="playlist-menu">
            <h4>Add to Playlist</h4>
            {playlists.map(playlist => (
              <button
                key={playlist.id}
                onClick={(e) => handleAddToPlaylist(e, playlist.id)}
              >
                {playlist.name}
              </button>
            ))}
            <button onClick={() => {
              const name = prompt('Enter playlist name:');
              if (name) onCreatePlaylist(name);
            }}>
              + New Playlist
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="recording-actions">
          <button className="action-btn play" onClick={handlePlayClick}>
            ▶ Play
          </button>
          <button className="action-btn download" onClick={handleDownloadClick}>
            💾 Download
          </button>
          <button className="action-btn share" onClick={handleShareClick}>
            ↗️ Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;