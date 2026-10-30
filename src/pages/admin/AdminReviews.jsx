import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviews, deleteReview, getMovies } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';
import NotificationToast from '../../components/NotificationToast';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  MessageSquare, 
  Trash2, 
  Star, 
  Search, 
  ExternalLink,
  Film
} from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [moviesMap, setMoviesMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reviewsData, moviesData] = await Promise.all([
        getReviews(),
        getMovies(),
      ]);

      const map = {};
      if (Array.isArray(moviesData)) {
        moviesData.forEach((m) => {
          map[m.id] = m;
        });
      }

      setMoviesMap(map);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(err.message || 'Unable to connect to the JSON Server backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    const deletedId = reviewToDelete.id;
    setIsDeleting(true);
    try {
      // Optimistically remove from state immediately
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(deletedId)));
      setDeleteModalOpen(false);
      setReviewToDelete(null);

      await deleteReview(deletedId);
      setToast({ type: 'success', message: 'Review deleted successfully.' });
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete review.' });
      loadData();
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const movie = moviesMap[r.movieId];
    const movieTitle = movie ? movie.title.toLowerCase() : '';
    const username = (r.username || r.userName || '').toLowerCase();
    const comment = (r.comment || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    return movieTitle.includes(term) || username.includes(term) || comment.includes(term);
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Review"
        message={`Are you sure you want to delete this review by "${reviewToDelete?.username || reviewToDelete?.userName || 'User'}" from JSON Server?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Review'}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setReviewToDelete(null);
        }}
      />

      {/* Header */}
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-heading">Audience Reviews Management</h2>
          <p className="admin-subtext">
            Monitor community critiques, check associated films, and remove inappropriate or unwanted reviews.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrapper" style={{ maxWidth: '450px' }}>
          <Search size={18} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Filter reviews by movie title, username, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input admin-search-input"
          />
        </div>
      </div>

      {/* Reviews Table */}
      {isLoading ? (
        <Loading message="Loading community reviews from JSON Server..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : filteredReviews.length === 0 ? (
        <div className="admin-empty-state">
          <MessageSquare size={48} className="admin-empty-icon" />
          <h3>No reviews found</h3>
          <p>
            {searchTerm 
              ? 'No reviews match your search query.' 
              : 'There are currently no reviews in your JSON Server database.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Associated Movie</th>
                <th style={{ width: '160px' }}>Reviewer</th>
                <th style={{ width: '110px' }}>Rating</th>
                <th>Comment</th>
                <th style={{ width: '120px' }}>Submitted</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => {
                const movie = moviesMap[rev.movieId];
                const displayName = rev.username || rev.userName || 'Anonymous';

                return (
                  <tr key={rev.id}>
                    <td>
                      <div className="admin-review-movie">
                        {movie?.poster && (
                          <img 
                            src={movie.poster} 
                            alt={movie.title} 
                            className="admin-review-movie-thumb"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                        )}
                        <div>
                          <div className="admin-table-title">
                            {movie ? movie.title : `Movie #${rev.movieId}`}
                          </div>
                          {movie && (
                            <Link 
                              to={`/movies/${movie.id}`} 
                              className="admin-view-movie-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span>View Movie</span>
                              <ExternalLink size={12} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-reviewer-name">{displayName}</span>
                    </td>
                    <td>
                      <div className="admin-rating-badge">
                        <Star size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </td>
                    <td>
                      <p className="admin-review-comment">{rev.comment}</p>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {rev.createdAt || 'Recent'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(rev)}
                        title="Delete Review"
                        className="admin-action-btn delete"
                      >
                        <Trash2 size={16} />
                      </button>
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
