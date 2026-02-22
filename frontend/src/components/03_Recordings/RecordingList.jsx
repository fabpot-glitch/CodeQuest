import React from 'react';
import RecordingCard from './RecordingCard';

const RecordingList = ({ 
  recordings, 
  loading, 
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
  if (loading) {
    return (
      <div className={`skeleton-${viewMode}`}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="no-recordings">
        <div className="no-recordings-icon">🎥</div>
        <h3>No recordings found</h3>
        <p>Try adjusting your filters or search criteria</p>
        <button className="clear-filters-btn" onClick={() => window.location.reload()}>
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className={`recordings-${viewMode}`}>
      {recordings.map(recording => (
        <RecordingCard
          key={recording.id}
          recording={recording}
          viewMode={viewMode}
          onPlay={onPlay}
          onDownload={onDownload}
          onShare={onShare}
          onAddBookmark={onAddBookmark}
          onRemoveBookmark={onRemoveBookmark}
          onAddNote={onAddNote}
          bookmarks={bookmarks[recording.id] || []}
          notes={notes[recording.id]}
          playlists={playlists}
          onAddToPlaylist={onAddToPlaylist}
          onCreatePlaylist={onCreatePlaylist}
        />
      ))}
    </div>
  );
};

export default RecordingList;