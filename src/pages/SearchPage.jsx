import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, getGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchFilters from '../components/SearchFilters';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Film, RotateCcw } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'rating.desc';
  const initialIndustry = searchParams.get('industry') || '';

  const [selectedLanguage, setSelectedLanguage] = useState(initialIndustry);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load movies and genres from JSON Server
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [moviesList, genresList] = await Promise.all([
        getMovies(),
        getGenres(),
      ]);
      setMovies(Array.isArray(moviesList) ? moviesList : []);
      setGenres(Array.isArray(genresList) ? genresList : []);
    } catch (err) {
      console.error('Failed to load search data:', err);
      setError(err.message || 'Unable to connect to the JSON Server database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      const y = (m.releaseDate || m.release_date || '').split('-')[0];
      if (y && y.length === 4) set.add(y);
    });
    return Array.from(set).sort().reverse();
  }, [movies]);

  // Genre Map
  const genreMap = useMemo(() => {
    const map = {};
    genres.forEach((g) => {
      map[g.id] = g.name;
    });
    return map;
  }, [genres]);

  // Filter & Sort Logic
  const filteredMovies = useMemo(() => {
    let result = movies;

    // 1. Title Search (From single Header Search Bar)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((m) =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q)) ||
        (m.genre && m.genre.toLowerCase().includes(q)) ||
        (m.language && m.language.toLowerCase().includes(q)) ||
        (m.industry && m.industry.toLowerCase().includes(q))
      );
    }

    // 2. Industry Filter
    if (selectedLanguage) {
      result = result.filter((m) => m.industry === selectedLanguage);
    }

    // 3. Genre Filter
    if (selectedGenre) {
      result = result.filter((m) => {
        if (m.genreId && String(m.genreId) === String(selectedGenre)) return true;
        const targetName = genreMap[selectedGenre]?.toLowerCase();
        return targetName && m.genre && m.genre.toLowerCase().includes(targetName);
      });
    }

    // 4. Release Year Filter
    if (selectedYear) {
      result = result.filter((m) => {
        const y = (m.releaseDate || m.release_date || '').split('-')[0];
        return y === selectedYear;
      });
    }

    // 5. Sorting by Audience Rating & Dates (NO TMDB scores)
    result = [...result].sort((a, b) => {
      if (selectedSort === 'rating.desc') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (selectedSort === 'rating.asc') {
        return (Number(a.rating) || 0) - (Number(b.rating) || 0);
      }
      if (selectedSort === 'releaseDate.desc') {
        return new Date(b.releaseDate || '2000-01-01') - new Date(a.releaseDate || '2000-01-01');
      }
      if (selectedSort === 'releaseDate.asc') {
        return new Date(a.releaseDate || '2000-01-01') - new Date(b.releaseDate || '2000-01-01');
      }
      if (selectedSort === 'title.asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [movies, searchTerm, selectedLanguage, selectedGenre, selectedYear, selectedSort, genreMap]);

  const handleClearFilters = () => {
    setSelectedLanguage('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedSort('rating.desc');
    setSearchParams({});
  };

  const isFiltered = Boolean(
    searchTerm.trim() || 
    selectedLanguage || 
    selectedGenre || 
    selectedYear || 
    selectedSort !== 'rating.desc'
  );

  return (
    <div className="search-page-container">
      {/* Header Banner */}
      <section className="category-header-banner" style={{ background: 'linear-gradient(180deg, rgba(229, 9, 20, 0.12) 0%, rgba(12, 13, 20, 0.95) 100%)' }}>
        <div className="container">
          <div className="category-header-content">
            <div>
              <div className="category-badge" style={{ color: 'var(--accent-red)' }}>
                CineVerse Catalog
              </div>
              <h1 className="category-page-title">
                {searchTerm ? `Search Results: "${searchTerm}"` : 'Explore All Movies'}
              </h1>
              <p className="category-page-desc">
                Browse genuine movies across Tollywood, Bollywood, Hollywood, and Anime with audience reviews and official trailers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Multi-Filter Controls (NO duplicate search input) */}
        <SearchFilters
          searchTerm={searchTerm}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          genres={genres}
          availableYears={availableYears}
          onClearFilters={handleClearFilters}
          totalResults={filteredMovies.length}
        />

        {/* Content States */}
        {isLoading ? (
          <Loading message="Loading CineVerse movies from database..." showSkeletons count={12} />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadData} />
        ) : filteredMovies.length === 0 ? (
          <div className="no-movies-found">
            <Film size={48} className="empty-icon" />
            <h3>No matching movies found</h3>
            <p>
              {isFiltered 
                ? 'Try clearing selected filters or searching for another movie title in the header.'
                : 'No movies are available in the database.'}
            </p>
            {isFiltered && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClearFilters}
                style={{ marginTop: '1rem' }}
              >
                <RotateCcw size={16} />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                genreNames={movie.genre ? movie.genre.split(', ') : []} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
