import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getMovieById, createMovie, updateMovie, getGenres } from '../../services/api';
import { searchMovies, getMovieDetails, extractOfficialTrailer } from '../../services/tmdb';
import Loading from '../../components/Loading';
import NotificationToast from '../../components/NotificationToast';
import { 
  ArrowLeft, 
  Save, 
  Search, 
  Sparkles, 
  Film, 
  Upload, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function AdminMovieForm({ mode = 'create' }) {
  const { id } = useParams();
  const isEdit = mode === 'edit' || Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    poster: '',
    backdrop: '',
    releaseDate: '',
    genre: '',
    genreId: '1',
    language: 'Telugu',
    industry: 'Tollywood',
    runtime: 120,
    rating: 5.0,
    trailerKey: '',
    tmdbId: '',
    isTrending: false,
    isPopular: false,
    isUpcoming: false,
  });

  const [genresList, setGenresList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // TMDB Import Tool State
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [tmdbResults, setTmdbResults] = useState([]);

  // Load genres and movie data (if edit mode)
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const genres = await getGenres();
        setGenresList(Array.isArray(genres) ? genres : []);

        if (isEdit && id) {
          const movie = await getMovieById(id);
          setFormData({
            title: movie.title || '',
            overview: movie.overview || '',
            poster: movie.poster || '',
            backdrop: movie.backdrop || '',
            releaseDate: movie.releaseDate || '',
            genre: movie.genre || '',
            genreId: String(movie.genreId || '1'),
            language: movie.language || 'English',
            industry: movie.industry || 'Hollywood',
            runtime: movie.runtime || 120,
            rating: movie.rating || 7.0,
            tmdbId: movie.tmdbId ? String(movie.tmdbId) : '',
            isTrending: Boolean(movie.isTrending),
            isPopular: Boolean(movie.isPopular),
            isUpcoming: Boolean(movie.isUpcoming),
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to load form data.' });
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id, isEdit]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error if resolved
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Search TMDB for Auto-fill
  const handleSearchTMDB = async (e) => {
    e.preventDefault();
    if (!tmdbQuery.trim()) return;

    setTmdbSearching(true);
    setTmdbResults([]);
    try {
      const data = await searchMovies(tmdbQuery.trim());
      setTmdbResults((data.results || []).slice(0, 5));
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to search TMDB: ' + err.message });
    } finally {
      setTmdbSearching(false);
    }
  };

  // Auto-fill from TMDB Result
  const handleSelectTMDBMovie = async (tmdbMovie) => {
    setIsLoading(true);
    try {
      // Fetch full details for runtime, genres, backdrops
      const details = await getMovieDetails(tmdbMovie.id);

      const langMap = {
        te: { lang: 'Telugu', ind: 'Tollywood' },
        hi: { lang: 'Hindi', ind: 'Bollywood' },
        ja: { lang: 'Japanese', ind: 'Anime' },
        en: { lang: 'English', ind: 'Hollywood' },
      };

      const matched = langMap[details.original_language] || {
        lang: details.original_language?.toUpperCase() || 'English',
        ind: 'Hollywood',
      };

      const genreNames = details.genres ? details.genres.map((g) => g.name).join(', ') : '';
      const trailer = extractOfficialTrailer(details?.videos);

      setFormData((prev) => ({
        ...prev,
        title: details.title || tmdbMovie.title,
        overview: details.overview || tmdbMovie.overview || '',
        poster: details.poster_path 
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}` 
          : prev.poster,
        backdrop: details.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` 
          : prev.backdrop,
        releaseDate: details.release_date || tmdbMovie.release_date || '',
        genre: genreNames,
        runtime: details.runtime || 120,
        rating: 5.0,
        language: matched.lang,
        industry: matched.ind,
        tmdbId: String(details.id),
        trailerKey: trailer ? trailer.key : (prev.trailerKey || ''),
      }));

      setTmdbResults([]);
      setTmdbQuery('');
      setToast({ type: 'success', message: `Imported "${details.title}" metadata from TMDB!` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to import details: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Form Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Movie title is required.';
    if (!formData.overview.trim()) newErrors.overview = 'Movie overview is required.';
    if (!formData.poster.trim()) newErrors.poster = 'Poster image URL is required.';
    if (!formData.releaseDate) newErrors.releaseDate = 'Release date is required.';
    if (!formData.industry) newErrors.industry = 'Industry category is required.';
    if (Number(formData.rating) < 1 || Number(formData.rating) > 5) {
      newErrors.rating = 'Audience rating must be between 1 and 5 stars.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (isEdit) {
        await updateMovie(id, formData);
        setToast({ type: 'success', message: 'Movie updated successfully!' });
      } else {
        await createMovie(formData);
        setToast({ type: 'success', message: 'Movie added to JSON Server successfully!' });
      }

      // Navigate back after slight delay for user feedback
      setTimeout(() => {
        navigate('/admin/movies');
      }, 700);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save movie.' });
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading movie details..." />;
  }

  return (
    <div className="admin-page-view">
      {toast && (
        <NotificationToast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="admin-toolbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Link to="/admin/movies" className="admin-back-btn">
              <ArrowLeft size={16} />
              <span>Back to Movies</span>
            </Link>
          </div>
          <h2 className="admin-heading">
            {isEdit ? `Edit Movie: ${formData.title || 'Movie'}` : 'Add New Movie'}
          </h2>
          <p className="admin-subtext">
            {isEdit 
              ? 'Update movie metadata, streaming details, and media assets in JSON Server.' 
              : 'Add a new movie to your database manually or import real metadata from TMDB.'}
          </p>
        </div>
      </div>

      {/* Optional TMDB Fast-Import Box (Visible in Add Mode) */}
      {!isEdit && (
        <div className="admin-import-box">
          <div className="admin-import-header">
            <Sparkles size={18} color="var(--accent-gold)" />
            <span style={{ fontWeight: 600 }}>Quick TMDB Auto-Fill (Optional)</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
            Search any movie by title on TMDB to automatically retrieve genuine posters, backdrops, cast, genres, runtime, and ratings:
          </p>
          <form onSubmit={handleSearchTMDB} className="admin-import-form">
            <div className="admin-search-wrapper" style={{ flex: 1 }}>
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                placeholder="e.g. Kalki 2898 AD, Interstellar, Spirited Away, Jawan..."
                value={tmdbQuery}
                onChange={(e) => setTmdbQuery(e.target.value)}
                className="admin-input"
              />
            </div>
            <button 
              type="submit" 
              disabled={tmdbSearching || !tmdbQuery.trim()} 
              className="admin-secondary-btn"
            >
              {tmdbSearching ? 'Searching...' : 'Search TMDB'}
            </button>
          </form>

          {/* TMDB Results List */}
          {tmdbResults.length > 0 && (
            <div className="admin-tmdb-results">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Select a movie below to populate the form:
              </span>
              <div className="admin-tmdb-grid">
                {tmdbResults.map((m) => (
                  <div key={m.id} className="admin-tmdb-item">
                    <img 
                      src={m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80'} 
                      alt={m.title}
                      className="admin-tmdb-thumb" 
                    />
                    <div className="admin-tmdb-info">
                      <div className="admin-tmdb-title">{m.title}</div>
                      <div className="admin-tmdb-date">{m.release_date?.split('-')[0] || 'N/A'} • TMDB ID: {m.id}</div>
                      <button 
                        type="button" 
                        onClick={() => handleSelectTMDBMovie(m)} 
                        className="admin-import-btn"
                      >
                        <Check size={14} /> Import Data
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Movie Form */}
      <form onSubmit={handleSubmit} className="admin-form-container">
        <div className="admin-form-grid">
          {/* Title */}
          <div className="form-group full-width">
            <label className="form-label">
              Movie Title <span className="req">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Kalki 2898-AD"
              className={`admin-input ${errors.title ? 'has-error' : ''}`}
            />
            {errors.title && <span className="form-error-msg">{errors.title}</span>}
          </div>

          {/* Industry Category */}
          <div className="form-group">
            <label className="form-label">
              Industry Category <span className="req">*</span>
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="admin-select"
            >
              <option value="Tollywood">Tollywood (Telugu Cinema)</option>
              <option value="Bollywood">Bollywood (Hindi Cinema)</option>
              <option value="Hollywood">Hollywood (English Cinema)</option>
              <option value="Anime">Anime (Japanese Animation)</option>
            </select>
          </div>

          {/* Language */}
          <div className="form-group">
            <label className="form-label">Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g. Telugu, Hindi, English, Japanese"
              className="admin-input"
            />
          </div>

          {/* Genre String */}
          <div className="form-group">
            <label className="form-label">Genre(s)</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. Action, Sci-Fi, Drama"
              className="admin-input"
            />
          </div>

          {/* Primary Genre Dropdown from DB */}
          <div className="form-group">
            <label className="form-label">Primary Database Genre</label>
            <select
              name="genreId"
              value={formData.genreId}
              onChange={handleChange}
              className="admin-select"
            >
              {genresList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Release Date */}
          <div className="form-group">
            <label className="form-label">
              Release Date <span className="req">*</span>
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className={`admin-input ${errors.releaseDate ? 'has-error' : ''}`}
            />
            {errors.releaseDate && <span className="form-error-msg">{errors.releaseDate}</span>}
          </div>

          {/* Runtime */}
          <div className="form-group">
            <label className="form-label">Runtime (Minutes)</label>
            <input
              type="number"
              name="runtime"
              min="1"
              max="600"
              value={formData.runtime}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          {/* Audience Rating */}
          <div className="form-group">
            <label className="form-label">Audience Rating (1 - 5 Stars)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className={`admin-input ${errors.rating ? 'has-error' : ''}`}
            />
            {errors.rating && <span className="form-error-msg">{errors.rating}</span>}
          </div>

          {/* YouTube Trailer Key */}
          <div className="form-group">
            <label className="form-label">YouTube Trailer Key / ID</label>
            <input
              type="text"
              name="trailerKey"
              value={formData.trailerKey || ''}
              onChange={handleChange}
              placeholder="e.g. NgBoMJy386M"
              className="admin-input"
            />
          </div>

          {/* TMDB ID */}
          <div className="form-group">
            <label className="form-label">TMDB ID (For trailer & cast enrichment)</label>
            <input
              type="text"
              name="tmdbId"
              value={formData.tmdbId}
              onChange={handleChange}
              placeholder="e.g. 801688"
              className="admin-input"
            />
          </div>

          {/* Poster Image URL */}
          <div className="form-group full-width">
            <label className="form-label">
              Poster Image URL <span className="req">*</span>
            </label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              placeholder="https://image.tmdb.org/t/p/w500/..."
              className={`admin-input ${errors.poster ? 'has-error' : ''}`}
            />
            {errors.poster && <span className="form-error-msg">{errors.poster}</span>}
          </div>

          {/* Backdrop Image URL */}
          <div className="form-group full-width">
            <label className="form-label">Backdrop Image URL</label>
            <input
              type="url"
              name="backdrop"
              value={formData.backdrop}
              onChange={handleChange}
              placeholder="https://image.tmdb.org/t/p/original/..."
              className="admin-input"
            />
          </div>

          {/* Overview */}
          <div className="form-group full-width">
            <label className="form-label">
              Overview / Synopsis <span className="req">*</span>
            </label>
            <textarea
              name="overview"
              rows={4}
              value={formData.overview}
              onChange={handleChange}
              placeholder="Provide a detailed storyline or synopsis of the movie..."
              className={`admin-textarea ${errors.overview ? 'has-error' : ''}`}
            />
            {errors.overview && <span className="form-error-msg">{errors.overview}</span>}
          </div>

          {/* Featured Flags */}
          <div className="form-group full-width admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
              />
              <span>Feature on Trending Worldwide Shelf</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
              />
              <span>Feature on Popular Shelf</span>
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="isUpcoming"
                checked={formData.isUpcoming}
                onChange={handleChange}
              />
              <span>Classify as Upcoming Release</span>
            </label>
          </div>
        </div>

        {/* Live Preview Card */}
        {formData.poster && (
          <div className="admin-live-preview">
            <span className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
              Movie Card Preview:
            </span>
            <div className="preview-card-wrapper">
              <img 
                src={formData.poster} 
                alt="Preview" 
                className="preview-poster" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="preview-details">
                <div className="preview-title">{formData.title || 'Movie Title'}</div>
                <div className="preview-meta">
                  {formData.industry} • {formData.language} • {formData.releaseDate?.split('-')[0] || 'Year'}
                </div>
                <div className="preview-genres">{formData.genre || 'Genres'}</div>
                <p className="preview-desc">{formData.overview || 'Synopsis preview...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="admin-form-actions">
          <Link to="/admin/movies" className="admin-secondary-btn">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="admin-primary-btn"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving to JSON Server...' : isEdit ? 'Update Movie' : 'Save Movie'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
