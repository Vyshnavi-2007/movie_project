import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMovies, deleteMovie } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';
import NotificationToast from '../../components/NotificationToast';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  ExternalLink,
  Film
} from 'lucide-react';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const loadMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMovies();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load movies from backend:', err);
      setError(err.message || 'Unable to connect to the JSON Server backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    const deletedId = movieToDelete.id;
    const deletedTitle = movieToDelete.title;
    setIsDeleting(true);
    try {
      // Optimistically remove from state immediately
      setMovies((prev) => prev.filter((m) => String(m.id) !== String(deletedId)));
      setDeleteModalOpen(false);
      setMovieToDelete(null);

      await deleteMovie(deletedId);
      setToast({ type: 'success', message: `"${deletedTitle}" removed successfully.` });
      loadMovies();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete movie.' });
      loadMovies();
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter movies based on search and industry dropdown
  const filteredMovies = movies.filter((m) => {
    const matchesSearch = 
      (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.genre && m.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.language && m.language.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = 
      selectedIndustry === 'ALL' || m.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="admin-page-view">
      {toast && (
        <NotificationToast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Movie"
        message={`Are you sure you want to permanently delete "${movieToDelete?.title}" from JSON Server?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setMovieToDelete(null);
        }}
      />

      {/* Top Action Bar */}
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-heading">Movie Management</h2>
          <p className="admin-subtext">
            View, edit, create and delete movie records stored in your JSON Server database.
          </p>
        </div>

        <Link to="/admin/movies/new" className="admin-primary-btn">
          <Plus size={18} />
          <span>Add New Movie</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrapper">
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Filter movies by title, genre, language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-search-input"
          />
        </div>

        <div className="admin-select-wrapper">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="admin-select"
          >
            <option value="ALL">All Industries</option>
            <option value="Tollywood">Tollywood (Telugu)</option>
            <option value="Bollywood">Bollywood (Hindi)</option>
            <option value="Hollywood">Hollywood (English)</option>
            <option value="Anime">Anime (Japanese)</option>
          </select>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <Loading message="Fetching movies from JSON Server backend..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadMovies} />
      ) : filteredMovies.length === 0 ? (
        <div className="admin-empty-state">
          <Film size={48} className="admin-empty-icon" />
          <h3>No movies found</h3>
          <p>
            {searchTerm || selectedIndustry !== 'ALL' 
              ? 'No movies match your filter criteria. Try clearing the search or filter.'
              : 'Your database currently has no movies. Click "Add New Movie" to create one.'}
          </p>
          {(searchTerm || selectedIndustry !== 'ALL') && (
            <button 
              type="button" 
              className="admin-secondary-btn" 
              onClick={() => { setSearchTerm(''); setSelectedIndustry('ALL'); }}
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Poster</th>
                <th>Title & Info</th>
                <th>Industry / Language</th>
                <th>Genres</th>
                <th>Release Year</th>
                <th>Audience Rating</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => {
                const releaseYear = movie.releaseDate 
                  ? new Date(movie.releaseDate).getFullYear() || movie.releaseYear 
                  : (movie.releaseYear || 'N/A');

                return (
                  <tr key={movie.id}>
                    <td>
                      <img 
                        src={movie.poster} 
                        alt={movie.title} 
                        className="admin-table-thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <div className="admin-table-title">{movie.title}</div>
                      <div className="admin-table-runtime">
                        {movie.runtime ? `${movie.runtime} min` : 'Duration N/A'}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-industry-pill ${movie.industry?.toLowerCase() || 'cinema'}`}>
                        {movie.industry || 'Cinema'}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {movie.language || 'Original'}
                      </div>
                    </td>
                    <td>
                      <span className="admin-genre-text">{movie.genre || 'General'}</span>
                    </td>
                    <td>{releaseYear}</td>
                    <td>
                      <div className="admin-rating-badge">
                        <Star size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                        <span>{movie.rating ? Number(movie.rating).toFixed(1) : '5.0'} / 5</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <Link
                          to={`/movies/${movie.id}`}
                          title="View on User Portal"
                          className="admin-action-btn view"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/movies/edit/${movie.id}`)}
                          title="Edit Movie"
                          className="admin-action-btn edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(movie)}
                          title="Delete Movie"
                          className="admin-action-btn delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
