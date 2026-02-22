import React from 'react';
import './CoursesDashboard.css';

const CourseFilters = ({ filters, onFilterChange, categories, levels }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      level: 'all',
      duration: 'all',
      price: 'all',
      language: 'all',
      rating: 0,
      sortBy: 'popular'
    });
  };

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h3>Filter Courses</h3>
        <button className="clear-filters" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        {/* Category Filter */}
        <div className="filter-group">
          <h4>Category</h4>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div className="filter-group">
          <h4>Level</h4>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="filter-group">
          <h4>Price</h4>
          <select
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="filter-group">
          <h4>Minimum Rating</h4>
          <div className="rating-filter">
            {[4.5, 4.0, 3.5].map(rating => (
              <button
                key={rating}
                className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
                onClick={() => handleFilterChange('rating', rating)}
              >
                {rating}+ ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <h4>Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;