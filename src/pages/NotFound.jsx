import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div 
        style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div 
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(229, 9, 20, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--accent-red)'
          }}
        >
          <Film size={36} />
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          4<span className="text-gradient">0</span>4
        </h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Scene Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          The movie reel or page you're searching for does not exist in our theatre or has moved to a new premiere slot.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>Return to Premier Entertainer Portal</span>
        </Link>
      </div>
    </div>
  );
}
