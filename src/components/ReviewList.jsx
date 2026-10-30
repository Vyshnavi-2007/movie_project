import React from 'react';
import { Star, MessageSquare, Edit2, Trash2, Calendar, User } from 'lucide-react';

export default function ReviewList({
  reviews = [],
  onEditReview,
  onDeleteReview,
}) {
  if (reviews.length === 0) {
    return (
      <div 
        style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}
      >
        <MessageSquare size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          No reviews yet
        </h4>
        <p style={{ fontSize: '0.875rem' }}>
          Be the first cinephile to share your thoughts on this film!
        </p>
      </div>
    );
  }

  // Format initials for avatar
  const getInitials = (name = 'User') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="reviews-list">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>
          Community Reviews ({reviews.length})
        </h3>
      </div>

      {reviews.map((rev) => (
        <article key={rev.id} className="review-card">
          <div className="review-header">
            <div className="review-user-badge">
              <div className="avatar-circle">
                {getInitials(rev.username || rev.userName)}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{rev.username || rev.userName || 'User'}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--accent-gold)' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= rev.rating ? 'var(--accent-gold)' : 'none'}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {rev.createdAt || 'Recent'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onEditReview(rev)}
                title="Edit this review"
                aria-label="Edit review"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: '#f87171' }}
                onClick={() => onDeleteReview(rev)}
                title="Delete this review"
                aria-label="Delete review"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', lineHeight: 1.6, paddingLeft: '3.25rem' }}>
            {rev.comment}
          </p>
        </article>
      ))}
    </div>
  );
}
