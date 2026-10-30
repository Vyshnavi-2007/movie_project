import React from 'react';
import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

/**
 * SearchFilters component
 * Provides filters for Industry, Genre, Year, and Audience Rating sorting.
 * Note: Title search is managed exclusively by the single header search bar.
 */
export default function SearchFilters({
  searchTerm = '',
  selectedLanguage = '',
  onLanguageChange,
  selectedGenre = '',
  onGenreChange,
  selectedYear = '',
  onYearChange,
  selectedSort = 'rating.desc',
  onSortChange,
  genres = [],
  availableYears = [],
  onClearFilters,
  totalResults = 0,
}) {
  const isFiltered = Boolean(
    searchTerm.trim() || 
    selectedLanguage || 
    selectedGenre || 
    selectedYear || 
    (selectedSort && selectedSort !== 'rating.desc')
  );

  return (
    <div className="filter-card">
      <div className="filter-toolbar" style={{ gridTemplateColumns: onLanguageChange ? '1.2fr 1fr 1fr 1.2fr auto' : '1fr 1fr 1.2fr auto' }}>
        {/* Filter by Industry */}
        {onLanguageChange && (
          <div className="filter-select-wrapper">
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              aria-label="Filter by industry"
            >
              <option value="">All Categories & Industries</option>
              <option value="Tollywood">Tollywood (Telugu)</option>
              <option value="Bollywood">Bollywood (Hindi)</option>
              <option value="Hollywood">Hollywood (English)</option>
              <option value="Anime">Anime (Japanese Animation)</option>
            </select>
          </div>
        )}

        {/* Filter by Genre */}
        <div className="filter-select-wrapper">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Release Year */}
        <div className="filter-select-wrapper">
          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            aria-label="Filter by release year"
          >
            <option value="">All Release Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Audience Rating & Dates */}
        {onSortChange && (
          <div className="filter-select-wrapper">
            <select
              className="form-select"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort movies by"
            >
              <option value="rating.desc">Highest Audience Rating (★ 5 to 1)</option>
              <option value="rating.asc">Lowest Audience Rating (★ 1 to 5)</option>
              <option value="releaseDate.desc">Newest Releases</option>
              <option value="releaseDate.asc">Earliest Releases</option>
              <option value="title.asc">Title (A – Z)</option>
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        <div>
          <button
            type="button"
            onClick={onClearFilters}
            className="btn btn-secondary btn-sm"
            disabled={!isFiltered}
            title="Reset all active filters"
            style={{ whiteSpace: 'nowrap' }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="filter-status-bar">
        <div className="filter-status-left">
          <SlidersHorizontal size={15} color="var(--accent-purple)" />
          <span>
            Showing <strong style={{ color: 'var(--text-main)' }}>{totalResults}</strong> movies
            {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
          </span>
          {isFiltered && (
            <span className="filter-active-pill">
              Active Filters
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
