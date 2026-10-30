import React from 'react';

export default function Loading({ 
  message = 'Loading Premier Entertainer Portal...', 
  showSkeletons = false,
  count = 8 
}) {
  if (showSkeletons) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="skeleton-grid">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-poster shimmer" />
              <div className="skeleton-line shimmer" style={{ width: '80%', marginTop: '0.8rem' }} />
              <div className="skeleton-line shimmer" style={{ width: '50%', marginTop: '0.4rem' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '1rem' }}>
        {message}
      </p>
    </div>
  );
}
