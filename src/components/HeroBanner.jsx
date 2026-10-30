import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Info, 
  Star, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  getBackdropUrl, 
  getMovieDetails, 
  extractOfficialTrailer, 
  getIndustryBadge,
  FALLBACK_BACKDROP 
} from '../services/tmdb';
import TrailerModal from './TrailerModal';

export default function HeroBanner({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  // Take top 6 movies for the hero carousel
  const heroMovies = movies.slice(0, 6);
  const currentMovie = heroMovies[currentIndex] || null;

  // Auto-advance hero banner every 7 seconds if trailer is not playing
  useEffect(() => {
    if (trailerOpen || heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroMovies.length, trailerOpen]);

  const handleOpenTrailer = async (movie) => {
    if (!movie) return;
    if (movie.trailerKey) {
      setCurrentTrailerKey(movie.trailerKey);
      setTrailerOpen(true);
      return;
    }

    setLoadingTrailer(true);
    try {
      const targetId = movie.tmdbId || movie.id;
      const details = await getMovieDetails(targetId);
      const trailer = extractOfficialTrailer(details?.videos);
      setCurrentTrailerKey(trailer ? trailer.key : null);
      setTrailerOpen(true);
    } catch (err) {
      console.error('Error fetching trailer for hero movie:', err);
      setCurrentTrailerKey(null);
      setTrailerOpen(true);
    } finally {
      setLoadingTrailer(false);
    }
  };

  if (!currentMovie) return null;

  const backdropUrl = currentMovie.backdrop 
    ? (currentMovie.backdrop.startsWith('http') ? currentMovie.backdrop : getBackdropUrl(currentMovie.backdrop))
    : (currentMovie.backdrop_path ? getBackdropUrl(currentMovie.backdrop_path) : (currentMovie.poster || FALLBACK_BACKDROP));

  const releaseYear = (currentMovie.releaseDate || currentMovie.release_date || '').split('-')[0] || currentMovie.releaseYear || 'N/A';
  // Audience Rating strictly out of 5 (NO TMDB score)
  const audienceRating = currentMovie.rating ? Number(currentMovie.rating).toFixed(1) : '4.8';
  const industry = currentMovie.industry || getIndustryBadge(currentMovie);

  return (
    <section className="hero-section" aria-label="Featured Movie">
      {/* Background Image with Dark Vignette Gradients */}
      <div 
        className="hero-background"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="hero-gradient-overlay" />
      </div>

      <div className="hero-container container">
        <div className="hero-content">
          {/* Metadata Badges */}
          <div className="hero-badge-row">
            <span className={`hero-badge-industry ${industry.toLowerCase()}`}>
              <Sparkles size={13} />
              <span>{industry}</span>
            </span>
            <span className="hero-badge-rating" title="Audience Rating out of 5">
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              <span>★ {audienceRating} Audience Rating</span>
            </span>
            <span className="hero-badge-meta">
              <Calendar size={13} />
              <span>{releaseYear}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-movie-title">
            {currentMovie.title}
          </h1>

          {/* Synopsis */}
          <p className="hero-movie-overview">
            {currentMovie.overview || 'Experience this sensational cinematic journey on CineVerse.'}
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleOpenTrailer(currentMovie)}
              disabled={loadingTrailer}
            >
              <Play size={18} fill="#fff" />
              <span>{loadingTrailer ? 'Loading Trailer...' : 'Watch Trailer'}</span>
            </button>

            <Link 
              to={`/movies/${currentMovie.id}`} 
              className="btn btn-secondary"
            >
              <Info size={18} />
              <span>More Details</span>
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Dots / Controls */}
        {heroMovies.length > 1 && (
          <div className="hero-controls">
            <button
              type="button"
              className="hero-nav-arrow"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length)}
              aria-label="Previous featured film"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="hero-indicators">
              {heroMovies.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to slide ${idx + 1}: ${m.title}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="hero-nav-arrow"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % heroMovies.length)}
              aria-label="Next featured film"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        trailerKey={currentTrailerKey}
        movieTitle={currentMovie.title}
        onClose={() => setTrailerOpen(false)}
      />
    </section>
  );
}
