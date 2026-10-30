import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getMovieById, 
  getReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  calculateAverageRating 
} from '../services/api';
import { 
  getMovieDetails, 
  getBackdropUrl, 
  getPosterUrl, 
  getProfileUrl, 
  formatRuntime, 
  getLanguageName, 
  getIndustryBadge,
  extractOfficialTrailer,
  FALLBACK_POSTER,
  FALLBACK_BACKDROP
} from '../services/tmdb';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ConfirmModal from '../components/ConfirmModal';
import NotificationToast from '../components/NotificationToast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Play, 
  Users, 
  MessageSquare, 
  Sparkles
} from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [enrichedData, setEnrichedData] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review editing state
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Movie & Reviews from JSON Server
      const [movieData, reviewsData] = await Promise.all([
        getMovieById(id),
        getReviews(id),
      ]);

      setMovie(movieData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      // 2. Set trailer key: prefer database trailerKey, fallback to TMDB videos API
      if (movieData.trailerKey) {
        setTrailerKey(movieData.trailerKey);
      }

      // 3. Enrich with TMDB cast credits
      const tmdbIdToQuery = movieData.tmdbId || movieData.id;
      if (tmdbIdToQuery) {
        try {
          const tmdbDetails = await getMovieDetails(tmdbIdToQuery);
          setEnrichedData(tmdbDetails);

          // If no trailerKey on movieData, try extracting from TMDB response
          if (!movieData.trailerKey) {
            const trailer = extractOfficialTrailer(tmdbDetails?.videos);
            setTrailerKey(trailer ? trailer.key : null);
          }
        } catch (tmdbErr) {
          console.warn('Could not fetch extra TMDB credits:', tmdbErr.message);
          setEnrichedData(null);
        }
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
      setError(err.message || `Movie with ID "${id}" could not be retrieved from the database.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Handle Review submission to JSON Server
  const handleReviewSubmit = async (reviewData) => {
    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.id, reviewData);
        setToast({ type: 'success', message: 'Your review was updated successfully!' });
        setEditingReview(null);
      } else {
        await createReview(reviewData);
        setToast({ type: 'success', message: 'Review submitted successfully!' });
      }

      // Refresh reviews list from JSON Server
      const updated = await getReviews(id);
      setReviews(Array.isArray(updated) ? updated : []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to submit review.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle Review deletion from JSON Server
  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    const deletedId = reviewToDelete.id;
    try {
      // Optimistically remove from state immediately
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(deletedId)));
      setDeleteModalOpen(false);
      setReviewToDelete(null);

      await deleteReview(deletedId);
      setToast({ type: 'success', message: 'Review removed successfully.' });

      // Refresh reviews list
      const updated = await getReviews(id);
      setReviews(Array.isArray(updated) ? updated : []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete review.' });
    }
  };

  if (isLoading) {
    return <Loading message="Loading film details, credits, and reviews..." />;
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <ErrorMessage message={error || 'Movie not found.'} onRetry={loadData} />
      </div>
    );
  }

  // Calculate Audience Rating strictly out of 5 based exclusively on JSON Server reviews
  const localRatingData = calculateAverageRating(reviews);
  const displayRating = localRatingData.average !== null 
    ? localRatingData.average.toFixed(1) 
    : (movie.rating ? Number(movie.rating).toFixed(1) : '5.0');
  const reviewCount = reviews.length;

  // Image assets
  const backdropUrl = movie.backdrop
    ? (movie.backdrop.startsWith('http') ? movie.backdrop : getBackdropUrl(movie.backdrop))
    : (enrichedData?.backdrop_path ? getBackdropUrl(enrichedData.backdrop_path) : (movie.poster || FALLBACK_BACKDROP));

  const posterUrl = movie.poster
    ? (movie.poster.startsWith('http') ? movie.poster : getPosterUrl(movie.poster))
    : (enrichedData?.poster_path ? getPosterUrl(enrichedData.poster_path) : FALLBACK_POSTER);

  // Metadata
  const releaseYear = (movie.releaseDate || movie.release_date || '').split('-')[0] || movie.releaseYear || 'N/A';
  const fullReleaseDate = movie.releaseDate || movie.release_date || 'N/A';
  const runtimeFormatted = movie.runtime ? formatRuntime(movie.runtime) : (enrichedData?.runtime ? formatRuntime(enrichedData.runtime) : 'N/A');
  const industry = movie.industry || getIndustryBadge(movie);
  const language = movie.language || (movie.original_language ? getLanguageName(movie.original_language) : 'Original');

  // Top cast members (max 10)
  const castList = enrichedData?.credits?.cast ? enrichedData.credits.cast.slice(0, 10) : [];

  return (
    <div className="movie-details-page">
      {/* Toast Notifications */}
      {toast && (
        <NotificationToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Review"
        message="Are you sure you want to delete this review from JSON Server?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
      />

      {/* Hero Backdrop Header */}
      <section className="details-hero-section">
        <div
          className="details-hero-backdrop-bg"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="details-hero-backdrop-gradient" />

        <div className="container details-hero-content-wrapper">
          {/* Poster Box */}
          <div className="details-poster-box">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="details-poster-img"
              onError={(e) => {
                e.target.src = FALLBACK_POSTER;
              }}
            />
          </div>

          {/* Film Details Info */}
          <div className="details-info-box">
            {/* Tag Pills */}
            <div className="details-tags-row">
              <span className="details-pill industry">
                <Sparkles size={14} />
                <span>{industry}</span>
              </span>
              <span className="details-pill">
                <Calendar size={14} />
                <span>{fullReleaseDate}</span>
              </span>
              <span className="details-pill">
                <Clock size={14} />
                <span>{runtimeFormatted}</span>
              </span>
              <span className="details-pill">
                <Globe size={14} />
                <span>{language}</span>
              </span>
            </div>

            {/* Title & Tagline */}
            <h1 className="details-title">{movie.title}</h1>
            {enrichedData?.tagline && (
              <p className="details-tagline">"{enrichedData.tagline}"</p>
            )}

            {/* Exclusive Independent 5-Star Audience Rating (NO TMDB scores) */}
            <div className="details-ratings-container">
              <div className="rating-badge-block portal" style={{ minWidth: '220px' }}>
                <div className="rating-badge-header">
                  <Star size={26} fill="var(--accent-gold)" stroke="var(--accent-gold)" />
                  <span className="rating-score-num" style={{ color: 'var(--accent-gold)' }}>
                    {displayRating}
                  </span>
                  <span className="rating-scale">/ 5</span>
                </div>
                <div className="rating-badge-footer">
                  <strong>Audience Rating</strong>
                  <span>({reviewCount} community {reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="details-genres-list">
              {movie.genre ? (
                movie.genre.split(',').map((g) => (
                  <span key={g.trim()} className="genre-pill">
                    {g.trim()}
                  </span>
                ))
              ) : enrichedData?.genres ? (
                enrichedData.genres.map((g) => (
                  <span key={g.id} className="genre-pill">
                    {g.name}
                  </span>
                ))
              ) : (
                <span className="genre-pill">Cinema</span>
              )}
            </div>

            {/* Storyline Overview */}
            <div className="section-label">Overview</div>
            <p className="details-overview-text">
              {movie.overview || enrichedData?.overview || 'No synopsis is available for this title.'}
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Embedded Trailer Section */}
      <section className="container details-trailer-section" style={{ marginBottom: '3.5rem' }}>
        <div className="details-section-header">
          <Play size={22} color="var(--accent-red)" />
          <h2>Official Movie Trailer</h2>
        </div>
        {trailerKey ? (
          <div 
            style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
              background: '#000'
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?rel=0&modestbranding=1`}
              title={`${movie.title} Official Trailer`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <Play size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Trailer unavailable
            </h4>
            <p style={{ fontSize: '0.875rem' }}>
              No official trailer is currently available for this title.
            </p>
          </div>
        )}
      </section>

      {/* Cast and Crew Section */}
      {castList.length > 0 && (
        <section className="container details-cast-section">
          <div className="details-section-header">
            <Users size={22} color="var(--accent-purple)" />
            <h2>Top Billed Cast</h2>
          </div>
          <div className="cast-slider">
            {castList.map((actor) => (
              <div key={actor.id} className="cast-card">
                <div className="cast-photo-wrapper">
                  <img
                    src={
                      actor.profile_path
                        ? getProfileUrl(actor.profile_path)
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={actor.name}
                    className="cast-photo"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </div>
                <div className="cast-info">
                  <div className="cast-actor-name" title={actor.name}>
                    {actor.name}
                  </div>
                  <div className="cast-character-name" title={actor.character}>
                    {actor.character || 'Cast'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audience Ratings & Community Reviews Section */}
      <section className="container details-reviews-section">
        <div className="details-section-header">
          <MessageSquare size={22} color="var(--accent-red)" />
          <h2>Audience Reviews & Community Critiques</h2>
        </div>

        <div className="reviews-layout">
          {/* Review Submission Form */}
          <div>
            <ReviewForm
              movieId={movie.id}
              initialReview={editingReview}
              onSubmit={handleReviewSubmit}
              onCancel={() => setEditingReview(null)}
              isLoading={isSubmittingReview}
            />
          </div>

          {/* Submitted Demonstration Reviews List */}
          <div>
            <ReviewList
              reviews={reviews}
              onEditReview={(rev) => {
                setEditingReview(rev);
                window.scrollTo({ top: document.querySelector('.review-form-card')?.offsetTop - 80, behavior: 'smooth' });
              }}
              onDeleteReview={(rev) => {
                setReviewToDelete(rev);
                setDeleteModalOpen(true);
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
