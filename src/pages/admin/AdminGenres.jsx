import React, { useState, useEffect } from 'react';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';
import NotificationToast from '../../components/NotificationToast';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Tag, Plus, Edit3, Trash2, Check, X } from 'lucide-react';

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Genre input state
  const [newGenreName, setNewGenreName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const loadGenres = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getGenres();
      setGenres(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load genres:', err);
      setError(err.message || 'Unable to connect to the JSON Server backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  // Add genre
  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    setIsAdding(true);
    try {
      await createGenre({ name: newGenreName.trim() });
      setToast({ type: 'success', message: `Genre "${newGenreName.trim()}" created successfully!` });
      setNewGenreName('');
      loadGenres();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create genre.' });
    } finally {
      setIsAdding(false);
    }
  };

  // Start edit
  const handleStartEdit = (genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) return;

    setIsUpdating(true);
    try {
      await updateGenre(id, { name: editingName.trim() });
      setToast({ type: 'success', message: 'Genre updated successfully!' });
      setEditingId(null);
      setEditingName('');
      loadGenres();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update genre.' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete click
  const handleDeleteClick = (genre) => {
    setGenreToDelete(genre);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!genreToDelete) return;
    const deletedId = genreToDelete.id;
    const deletedName = genreToDelete.name;
    setIsDeleting(true);
    try {
      // Optimistically remove from state immediately
      setGenres((prev) => prev.filter((g) => String(g.id) !== String(deletedId)));
      setDeleteModalOpen(false);
      setGenreToDelete(null);

      await deleteGenre(deletedId);
      setToast({ type: 'success', message: `Genre "${deletedName}" deleted successfully.` });
      loadGenres();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete genre.' });
      loadGenres();
    } finally {
      setIsDeleting(false);
    }
  };

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
        title="Delete Genre"
        message={`Are you sure you want to delete the genre "${genreToDelete?.name}" from JSON Server?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Genre'}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setGenreToDelete(null);
        }}
      />

      {/* Header */}
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-heading">Genre Management</h2>
          <p className="admin-subtext">
            Add, update, and manage movie genre classifications in JSON Server.
          </p>
        </div>
      </div>

      {/* Add New Genre Card */}
      <div className="admin-form-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} color="var(--accent-cyan)" />
          <span>Add New Genre</span>
        </h3>
        <form onSubmit={handleAddGenre} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="e.g. Science Fiction, Psychological Thriller, Musical..."
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            className="admin-input"
            style={{ maxWidth: '400px' }}
          />
          <button 
            type="submit" 
            disabled={isAdding || !newGenreName.trim()} 
            className="admin-primary-btn"
          >
            {isAdding ? 'Adding...' : 'Add Genre'}
          </button>
        </form>
      </div>

      {/* Genres List */}
      {isLoading ? (
        <Loading message="Loading genres from JSON Server..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadGenres} />
      ) : genres.length === 0 ? (
        <div className="admin-empty-state">
          <Tag size={48} className="admin-empty-icon" />
          <h3>No genres found</h3>
          <p>Add a genre using the form above to populate the list.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Genre Name</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => {
                const isCurrentlyEditing = editingId === genre.id;

                return (
                  <tr key={genre.id}>
                    <td>
                      <span className="admin-genre-id">#{genre.id}</span>
                    </td>
                    <td>
                      {isCurrentlyEditing ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="admin-input"
                            style={{ maxWidth: '300px' }}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(genre.id)}
                            disabled={isUpdating || !editingName.trim()}
                            className="admin-action-btn view"
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="admin-action-btn delete"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="admin-table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Tag size={16} color="var(--accent-gold)" />
                          <span>{genre.name}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {!isCurrentlyEditing && (
                        <div className="admin-actions-cell">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(genre)}
                            title="Edit Genre"
                            className="admin-action-btn edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(genre)}
                            title="Delete Genre"
                            className="admin-action-btn delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
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
