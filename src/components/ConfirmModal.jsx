import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  confirmLabel,
  cancelText = 'Cancel',
  cancelLabel,
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape key press and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel?.();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const displayConfirm = confirmLabel || confirmText || 'Delete';
  const displayCancel = cancelLabel || cancelText || 'Cancel';

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDanger ? '#ef4444' : 'var(--accent-purple)',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {title}
            </h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onCancel} 
            aria-label="Close dialog"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '1rem 0 1.75rem', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            {displayCancel}
          </button>
          <button 
            type="button" 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : displayConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
