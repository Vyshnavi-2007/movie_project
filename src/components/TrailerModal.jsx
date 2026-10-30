import React, { useEffect } from 'react';
import { X, ExternalLink, Play } from 'lucide-react';

export default function TrailerModal({ isOpen, trailerKey, movieTitle, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="trailer-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trailer-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="trailer-icon-badge">
              <Play size={14} fill="#fff" />
            </span>
            <h3 className="trailer-modal-title">
              {movieTitle} – Official Trailer
            </h3>
          </div>
          <button 
            type="button" 
            className="trailer-close-btn" 
            onClick={onClose}
            aria-label="Close trailer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="trailer-video-wrapper">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            />
          ) : (
            <div className="trailer-fallback">
              <Play size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <p>Official video trailer is currently unavailable for this title.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' official trailer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                <span>Search on YouTube</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
