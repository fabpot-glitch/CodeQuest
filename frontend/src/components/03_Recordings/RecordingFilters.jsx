import React from 'react';

const RecordingFilters = ({
  filters,
  onFilterChange,
  interviewers,
  tags,
  qualities,
  playlists,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedInterviewer,
  onInterviewerChange,
  selectedTag,
  onTagChange,
  dateRange,
  onDateRangeChange,
  selectedQuality,
  onQualityChange,
  selectedDuration,
  onDurationChange,
  selectedPlaylist,
  onPlaylistChange,
  onCreatePlaylist
}) => {
  return (
    <div className="filters-bar">
      <div className="filters-header">
        <button className="filter-toggle" onClick={onToggleFilters}>
          {showFilters ? '▼' : '▶'} Filters
        </button>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-row">
            <div className="filter-group">
              <label>Date Range</label>
              <select
                className="filter-select"
                value={filters.dateRange}
                onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
              {filters.dateRange === 'custom' && (
                <div className="date-range-inputs">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="filter-group">
              <label>Interviewer</label>
              <select
                className="filter-select"
                value={selectedInterviewer}
                onChange={(e) => onInterviewerChange(e.target.value)}
              >
                <option value="all">All Interviewers</option>
                {interviewers.map(interviewer => (
                  <option key={interviewer} value={interviewer}>
                    {interviewer}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Tag</label>
              <select
                className="filter-select"
                value={selectedTag}
                onChange={(e) => onTagChange(e.target.value)}
              >
                <option value="all">All Tags</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Quality</label>
              <select
                className="filter-select"
                value={selectedQuality}
                onChange={(e) => onQualityChange(e.target.value)}
              >
                <option value="all">All Qualities</option>
                {qualities.map(quality => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Duration</label>
              <select
                className="filter-select"
                value={selectedDuration}
                onChange={(e) => onDurationChange(e.target.value)}
              >
                <option value="all">Any Duration</option>
                <option value="0-30">&lt; 30 min</option>
                <option value="30-60">30-60 min</option>
                <option value="60-90">60-90 min</option>
                <option value="90">90+ min</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Playlist</label>
              <select
                className="filter-select"
                value={selectedPlaylist}
                onChange={(e) => onPlaylistChange(e.target.value)}
              >
                <option value="all">All Playlists</option>
                {playlists.map(playlist => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
              </select>
              <button className="create-playlist-btn" onClick={() => {
                const name = prompt('Enter playlist name:');
                if (name) onCreatePlaylist(name);
              }}>
                + New
              </button>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                className="filter-select"
                value={filters.watched}
                onChange={(e) => onFilterChange({ ...filters, watched: e.target.value })}
              >
                <option value="all">All Recordings</option>
                <option value="watched">Watched</option>
                <option value="unwatched">Unwatched</option>
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
                <option value="progress">Progress</option>
                <option value="downloads">Downloads</option>
                <option value="shares">Shares</option>
              </select>
            </div>

            <div className="view-toggle-group">
              <label>View</label>
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('grid')}
                >
                  ⊞ Grid
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('list')}
                >
                  ☰ List
                </button>
              </div>
            </div>

            <button className="clear-filters-btn" onClick={() => {
              onSearchChange('');
              onInterviewerChange('all');
              onTagChange('all');
              onQualityChange('all');
              onDurationChange('all');
              onPlaylistChange('all');
              onDateRangeChange({ start: '', end: '' });
              onFilterChange({
                search: '',
                dateRange: 'all',
                interviewer: 'all',
                watched: 'all',
                sortBy: 'date'
              });
            }}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingFilters;