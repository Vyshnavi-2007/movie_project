import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies, getGenres } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SearchFilters from '../components/SearchFilters';
import { 
  Sparkles, 
  Tv, 
  Globe, 
  Compass, 
  Film,
  Calendar
} from 'lucide-react';

const CATEGORY_CONFIGS = {
  tollywood: {
    title: 'Tollywood Cinema',
    subtitle: 'Telugu Feature Films',
    description: 'Explore Telugu cinema masterpieces—from mass spectacles and mythological sci-fi to poignant romantic dramas.',
    icon: Sparkles,
    badgeColor: 'var(--accent-gold)',
    industry: 'Tollywood',
  },
  bollywood: {
    title: 'Bollywood Hits',
    subtitle: 'Hindi Feature Films',
    description: 'Immerse yourself in Hindi cinema featuring heartfelt comedies, inspiring biographical dramas, and acclaimed road trips.',
    icon: Tv,
    badgeColor: 'var(--accent-red)',
    industry: 'Bollywood',
  },
  hollywood: {
    title: 'Hollywood Cinema',
    subtitle: 'Global English Masterpieces',
    description: 'Experience groundbreaking sci-fi epics, psychological thrillers, and Academy Award contenders.',
    icon: Globe,
    badgeColor: 'var(--accent-cyan)',
    industry: 'Hollywood',
  },
  anime: {
    title: 'Anime & Japanese Animation',
    subtitle: 'Acclaimed Anime Films',
    description: 'Experience the finest in Japanese animation—from Studio Ghibli classics to Makoto Shinkai and Ufotable spectacles.',
    icon: Compass,
    badgeColor: 'var(--accent-purple)',
    industry: 'Anime',
  },
  upcoming: {
    title: 'Upcoming Releases',
    subtitle: 'Future Blockbusters',
    description: 'Anticipated theatrical premieres and upcoming cinema events across all industries.',
    icon: Calendar,
    badgeColor: 'var(--accent-gold)',
    industry: null,
  },
};

export default function CategoryPage({ categoryKey }) {
  const config = CATEGORY_CONFIGS[categoryKey] || CATEGORY_CONFIGS.tollywood;
  const IconComponent = config.icon;

  const [searchParams] = useSearchParams();
  const headerSearchQuery = searchParams.get('q') || '';

  const [allMovies, setAllMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters (Search query handled exclusively by single header search bar)
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating.desc');

  // Load movies and genres from JSON Server
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [moviesList, genresList] = await Promise.all([
        getMovies(),
        getGenres(),
      ]);
      setAllMovies(Array.isArray(moviesList) ? moviesList : []);
      setGenres(Array.isArray(genresList) ? genresList : []);
    } catch (err) {
      console.error('Failed to load category data from backend:', err);
      setError(err.message || 'Unable to connect to the backend database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryKey]);

  // Movies belonging specifically to this category
  const categoryMovies = useMemo(() => {
    if (config.industry) {
      return allMovies.filter((m) => m.industry === config.industry);
    }
    return allMovies.filter((m) => m.isUpcoming);
  }, [allMovies, config.industry]);

  // Available release years within this category
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    categoryMovies.forEach((m) => {
      const y = (m.releaseDate || m.release_date || '').split('-')[0];
      if (y && y.length === 4) yearsSet.add(y);
    });
    return Array.from(yearsSet).sort().reverse();
  }, [categoryMovies]);

  // Genre map
  const genreMap = useMemo(() => {
    const map = {};
    genres.forEach((g) => {
      map[g.id] = g.name;
    });
    return map;
  }, [genres]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let result = categoryMovies;

    // 1. Search term from single header search bar
    if (headerSearchQuery.trim()) {
      const q = headerSearchQuery.toLowerCase().trim();
      result = result.filter((m) => 
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q)) ||
        (m.genre && m.genre.toLowerCase().includes(q))
      );
    }

    // 2. Genre filter
    if (selectedGenre) {
      result = result.filter((m) => {
        if (m.genreId && String(m.genreId) === String(selectedGenre)) return true;
        const targetName = genreMap[selectedGenre]?.toLowerCase();
        return targetName && m.genre && m.genre.toLowerCase().includes(targetName);
      });
    }

    // 3. Year filter
    if (selectedYear) {
      result = result.filter((m) => {
        const y = (m.releaseDate || m.release_date || '').split('-')[0];
        return y === selectedYear;
      });
    }

    // 4. Sorting by Audience Rating out of 5
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
  }, [categoryMovies, headerSearchQuery, selectedGenre, selectedYear, selectedSort, genreMap]);

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedSort('rating.desc');
  };

  const hasActiveFilters = Boolean(selectedGenre || selectedYear || selectedSort !== 'rating.desc');

  if (isLoading) {
    return <Loading message={`Loading ${config.title} films from database...`} showSkeletons count={6} />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <ErrorMessage message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Cinematic Hero Banner Carousel (Exact match to Home Dashboard layout) */}
      {categoryMovies.length > 0 && (
        <HeroBanner movies={categoryMovies} />
      )}

      {/* Main Content Container */}
      <div className="container category-container">
        {/* Category Header Information */}
        <div className="category-section-header">
          <div className="category-header-main">
            <span 
              className="category-badge-pill" 
              style={{ color: config.badgeColor, borderColor: config.badgeColor }}
            >
              <IconComponent size={14} />
              <span>{config.subtitle}</span>
            </span>
            <h1 className="category-title">
              <span>{config.title}</span>
            </h1>
            <p className="category-description">
              {config.description}
            </p>
          </div>

          <div className="category-meta-count">
            <strong>{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'Film' : 'Films'}
          </div>
        </div>

        {/* Filter Toolbar (Title search handled exclusively by single header search bar) */}
        <SearchFilters
          searchTerm={headerSearchQuery}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          onClearFilters={handleResetFilters}
          totalResults={filteredMovies.length}
        />

        {/* Movie Grid: Responsive 4-Column Grid of Beautiful Cards */}
        {filteredMovies.length === 0 ? (
          <div className="no-movies-found">
            <Film size={48} className="empty-icon" />
            <h3>No movies found</h3>
            <p>We couldn't find any films matching your filters in {config.title}.</p>
            {hasActiveFilters && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetFilters}
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
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
