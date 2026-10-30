import React, { useState, useEffect } from 'react';
import { Star, Send, AlertCircle, X, Check } from 'lucide-react';

export default function ReviewForm({
  movieId,
  initialReview = null,
  onSubmit,
  onCancel = null,
  isLoading = false,
}) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialReview) {
      setUserName(initialReview.username || initialReview.userName || '');
      setRating(Number(initialReview.rating) || 0);
      setComment(initialReview.comment || '');
    } else {
      setUserName('');
      setRating(0);
      setComment('');
    }
    setErrors({});
  }, [initialReview]);

  const validate = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = 'Your name is required.';
    } else if (userName.trim().length < 2) {
      newErrors.userName = 'Name must be at least 2 characters.';
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a star rating from 1 to 5.';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review comment.';
    } else if (comment.trim().length < 5) {
      newErrors.comment = 'Review comment must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      movieId,
      username: userName.trim(),
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: initialReview?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  const isEditing = Boolean(initialReview && initialReview.id);

  return (
    <form className="review-form-card" onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {isEditing && onCancel && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onCancel}
            title="Cancel editing"
          >
            <X size={16} />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      {/* 5 Selectable Stars */}
      <div className="form-group">
        <label className="form-label">
          Your Rating * {rating > 0 && <span style={{ color: 'var(--accent-gold)', marginLeft: '0.5rem' }}>({rating} of 5 stars)</span>}
        </label>
        <div className="star-rating-selector" role="radiogroup" aria-label="Rating out of 5 stars">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                className={`star-btn ${isFilled ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => {
                  setRating(star);
                  if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
                }}
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <Star
                  size={28}
                  fill={isFilled ? 'var(--accent-gold)' : 'none'}
                  stroke={isFilled ? 'var(--accent-gold)' : 'currentColor'}
                />
              </button>
            );
          })}
        </div>
        {errors.rating && (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{errors.rating}</span>
          </div>
        )}
      </div>

      {/* User Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="reviewer-name">
          Your Name / Handle *
        </label>
        <input
          id="reviewer-name"
          type="text"
          className="form-input"
          placeholder="e.g. CinemaLover99"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (errors.userName) setErrors((prev) => ({ ...prev, userName: undefined }));
          }}
        />
        {errors.userName && (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{errors.userName}</span>
          </div>
        )}
      </div>

      {/* Comment */}
      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">
          Your Review / Thoughts *
        </label>
        <textarea
          id="review-comment"
          className="form-textarea"
          rows={3}
          placeholder="Share your experience, thoughts on performance, directing, cinematography..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) setErrors((prev) => ({ ...prev, comment: undefined }));
          }}
        />
        {errors.comment && (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{errors.comment}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {isEditing && onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            'Submitting...'
          ) : isEditing ? (
            <>
              <Check size={16} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
