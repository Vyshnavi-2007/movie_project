import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { 
  Film, 
  PlusCircle, 
  Tag, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import './Admin.css';

/**
 * AdminLayout
 * Clean, professional admin interface.
 * Strictly adheres to project specification:
 * Admin navigation contains ONLY:
 * 1. Movies (/admin/movies)
 * 2. Add Movie (/admin/movies/new)
 * 3. Genres (/admin/genres)
 * 4. Reviews (/admin/reviews)
 * 5. Back to User Portal (/)
 * NO statistical cards, charts, or analytics dashboards.
 */
export default function AdminLayout() {
  return (
    <div className="admin-container">
      {/* Top Admin Bar */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <div className="admin-shield-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="admin-title">CineVerse</h1>
              <span className="admin-subtitle">Management Console</span>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="admin-nav" aria-label="Admin Navigation">
            <ul className="admin-nav-links">
              <li>
                <NavLink 
                  to="/admin/movies" 
                  end
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Film size={18} />
                  <span>Movies</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/movies/new" 
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <PlusCircle size={18} />
                  <span>Add Movie</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/genres" 
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Tag size={18} />
                  <span>Genres</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/reviews" 
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <MessageSquare size={18} />
                  <span>Reviews</span>
                </NavLink>
              </li>
              <li className="admin-nav-separator"></li>
              <li>
                <Link to="/" className="admin-nav-item back-portal-link">
                  <ArrowLeft size={18} />
                  <span>Back to User Portal</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Admin Main Outlet */}
      <main className="admin-main">
        <div className="admin-content-card">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
