import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import NotFound from './pages/NotFound';

// Admin Portal Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminMovies from './pages/admin/AdminMovies';
import AdminMovieForm from './pages/admin/AdminMovieForm';
import AdminGenres from './pages/admin/AdminGenres';
import AdminReviews from './pages/admin/AdminReviews';

import { Clapperboard } from 'lucide-react';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      {/* User Portal Navbar (Only displayed on User Portal routes) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Routed Content */}
      <main className={isAdminRoute ? 'admin-main-wrapper' : 'main-content'}>
        <Routes>
          {/* =========================================
              USER PORTAL ROUTES
              ========================================= */}
          <Route path="/" element={<Home />} />
          <Route path="/tollywood" element={<CategoryPage categoryKey="tollywood" />} />
          <Route path="/bollywood" element={<CategoryPage categoryKey="bollywood" />} />
          <Route path="/hollywood" element={<CategoryPage categoryKey="hollywood" />} />
          <Route path="/anime" element={<CategoryPage categoryKey="anime" />} />
          <Route path="/upcoming" element={<CategoryPage categoryKey="upcoming" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies/:id" element={<MovieDetails />} />

          {/* =========================================
              ADMIN PORTAL ROUTES
              - /admin redirects directly to /admin/movies
              - Admin navigation contains ONLY:
                Movies, Add Movie, Genres, Reviews, Back to User Portal
              - NO analytics or statistical dashboard
              ========================================= */}
          <Route path="/admin" element={<Navigate to="/admin/movies" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="movies" element={<AdminMovies />} />
            <Route path="movies/new" element={<AdminMovieForm mode="create" />} />
            <Route path="movies/edit/:id" element={<AdminMovieForm mode="edit" />} />
            <Route path="genres" element={<AdminGenres />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* User Portal Footer (Only displayed on User Portal routes) */}
      {!isAdminRoute && (
        <footer className="portal-footer">
          <div className="container footer-content">
            {/* Brand Info */}
            <div className="footer-brand-section">
              <div className="footer-brand-header">
                <div className="footer-brand-icon">
                  <Clapperboard size={20} />
                </div>
                <span className="footer-brand-name">
                  Cine<span className="text-gradient">Verse</span>
                </span>
              </div>
              <p className="footer-brand-desc">
                Your premier cinematic destination for discovering genuine films across Tollywood, Bollywood, Hollywood, and Anime with official trailers and community audience critiques.
              </p>
            </div>

            {/* Quick Categories Navigation */}
            <div className="footer-links-section">
              <h4 className="footer-links-title">Cinema Industries</h4>
              <ul className="footer-nav-list">
                <li><Link to="/tollywood">Tollywood (Telugu)</Link></li>
                <li><Link to="/bollywood">Bollywood (Hindi)</Link></li>
                <li><Link to="/hollywood">Hollywood (English)</Link></li>
                <li><Link to="/anime">Anime (Japanese Animation)</Link></li>
                <li><Link to="/search">All Movies</Link></li>
              </ul>
            </div>

            {/* Management & Attributions */}
            <div className="footer-info-section">
              <h4 className="footer-links-title">Portal Administration</h4>
              <ul className="footer-nav-list" style={{ marginBottom: '1rem' }}>
                <li>
                  <Link to="/admin/movies" style={{ color: 'var(--accent-gold)' }}>
                    Admin Management Console
                  </Link>
                </li>
              </ul>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.813rem', lineHeight: 1.6 }}>
                Movie metadata, posters, and imagery provided via The Movie Database (TMDB) API and persisted in JSON Server. This product uses the TMDB API but is not officially endorsed or certified by TMDB.
              </p>
              <div className="footer-copyright">
                © {new Date().getFullYear()} CineVerse. Academic Project Demonstration.
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
