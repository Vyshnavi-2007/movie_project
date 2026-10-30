import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieRow({ 
  title, 
  icon: Icon, 
  subtitle, 
  movies = [], 
  viewAllLink, 
  genreMap = {} 
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-row-section">
      <div className="movie-row-header">
        <div>
          <h2 className="movie-row-title">
            {Icon && <Icon size={22} className="movie-row-icon" />}
            <span>{title}</span>
          </h2>
          {subtitle && <p className="movie-row-subtitle">{subtitle}</p>}
        </div>

        <div className="movie-row-actions">
          {viewAllLink && (
            <Link to={viewAllLink} className="movie-row-view-all">
              <span>Explore All</span>
              <ArrowRight size={15} />
            </Link>
          )}

          <div className="movie-row-arrows">
            <button
              type="button"
              className="row-arrow-btn"
              onClick={() => handleScroll('left')}
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="row-arrow-btn"
              onClick={() => handleScroll('right')}
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="movie-row-slider" ref={scrollRef}>
        {movies.map((movie) => {
          const movieGenres = (movie.genre_ids || [])
            .map((id) => genreMap[id])
            .filter(Boolean);

          return (
            <div key={movie.id} className="movie-row-item">
              <MovieCard movie={movie} genreNames={movieGenres} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
