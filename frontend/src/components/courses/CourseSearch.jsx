import React from 'react';
import './CoursesDashboard.css';

const CourseSearch = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="search-filter-bar">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search courses by title, category, or instructor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => onSearchChange('')}>
            ×
          </button>
        )}
      </div>

      <div className="filter-actions">
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={onToggleFilters}
        >
          <span>⚙️</span>
          Filters
        </button>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;