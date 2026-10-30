import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info, Calendar } from 'lucide-react';
import { 
  getPosterUrl, 
  FALLBACK_POSTER, 
  getIndustryBadge,
  getMovieDetails,
  extractOfficialTrailer
} from '../services/tmdb';
import TrailerModal from './TrailerModal';

export default function MovieCard({ movie, genreNames = [] }) {
  const initialPoster = movie?.poster 
    ? (movie.poster.startsWith('http') ? movie.poster : getPosterUrl(movie.poster))
    : (movie?.poster_path ? getPosterUrl(movie.poster_path) : FALLBACK_POSTER);

  const [imgSrc, setImgSrc] = useState(initialPoster);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(movie?.trailerKey || null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  if (!movie) return null;

  const handleImageError = () => {
    setImgSrc(FALLBACK_POSTER);
  };

  const handleOpenTrailer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If trailerKey is already stored on the movie, use it directly
    if (movie.trailerKey) {
      setTrailerKey(movie.trailerKey);
      setTrailerOpen(true);
      return;
    }

    setIsLoadingTrailer(true);
    try {
      const targetId = movie.tmdbId || movie.id;
      const details = await getMovieDetails(targetId);
      const trailer = extractOfficialTrailer(details?.videos);
      setTrailerKey(trailer ? trailer.key : null);
      setTrailerOpen(true);
    } catch (err) {
      console.error('Error fetching trailer for card:', err);
      setTrailerKey(null);
      setTrailerOpen(true);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const releaseYear = (movie.releaseDate || movie.release_date || '').split('-')[0] || movie.releaseYear || 'N/A';
  // Audience Rating strictly out of 5 (NO TMDB ratings)
  const audienceRating = movie.rating ? Number(movie.rating).toFixed(1) : '4.8';
  const industry = movie.industry || getIndustryBadge(movie);

  const genresDisplay = Array.isArray(genreNames) && genreNames.length > 0 
    ? genreNames.join(' • ')
    : (typeof movie.genre === 'string' ? movie.genre : '');

  return (
    <>
      <article className="movie-card" aria-label={movie.title}>
        <div className="movie-poster-wrapper">
          <img 
            src={imgSrc} 
            alt={`${movie.title} poster`} 
            className="movie-poster-img"
            loading="lazy"
            onError={handleImageError}
          />

          {/* Badges Overlay */}
          <div className="movie-poster-top-badges">
            <span className={`movie-badge-industry ${industry.toLowerCase()}`}>{industry}</span>
            <div className="movie-badge-rating" title={`Audience Rating: ${audienceRating} of 5 stars`}>
              <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
              <span>{audienceRating}</span>
            </div>
          </div>

          <div className="movie-poster-overlay">
            <div className="movie-card-hover-actions">
              <button
                type="button"
                className="btn-card-action play"
                onClick={handleOpenTrailer}
                disabled={isLoadingTrailer}
                title="Watch Trailer"
                aria-label={`Watch trailer for ${movie.title}`}
              >
                <Play size={16} fill="#fff" />
                <span>Trailer</span>
              </button>

              <Link
                to={`/movies/${movie.id}`}
                className="btn-card-action info"
                title="View Full Movie Details"
                aria-label={`View details for ${movie.title}`}
              >
                <Info size={16} />
                <span>Details</span>
              </Link>
            </div>
          </div>

          <span className="movie-badge-year">
            <Calendar size={11} style={{ marginRight: '3px' }} />
            {releaseYear}
          </span>
        </div>

        <div className="movie-card-content">
          <h3 className="movie-card-title" title={movie.title}>
            <Link to={`/movies/${movie.id}`}>
              {movie.title}
            </Link>
          </h3>

          {genresDisplay && (
            <p className="movie-card-genres" title={genresDisplay}>
              {genresDisplay}
            </p>
          )}
        </div>
      </article>

      {/* Embedded Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        trailerKey={trailerKey}
        movieTitle={movie.title}
        onClose={() => setTrailerOpen(false)}
      />
    </>
  );
}
