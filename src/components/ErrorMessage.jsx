import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorMessage({ message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="state-container" role="alert">
      <div 
        style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          maxWidth: '520px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}
        >
          <AlertCircle size={30} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f87171' }}>
            Unable to Load Data
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.938rem', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
