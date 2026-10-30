import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Clapperboard, 
  Film, 
  Sparkles, 
  Search, 
  Calendar, 
  Menu, 
  X,
  Tv,
  Globe,
  Compass,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const urlQuery = searchParams.get('q') || '';
  const [quickSearch, setQuickSearch] = useState(urlQuery);

  // Keep search input in sync if URL query parameter changes
  useEffect(() => {
    setQuickSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuickSearch(val);
    // If currently on /search, update URL query parameter live
    if (location.pathname === '/search') {
      navigate(`/search${val.trim() ? `?q=${encodeURIComponent(val)}` : ''}`, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/search');
    }
    closeMobileMenu();
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* CineVerse Brand Logo */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <div className="nav-brand-icon">
            <Clapperboard size={22} />
          </div>
          <span className="nav-brand-title">
            Cine<span className="text-gradient">Verse</span>
          </span>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/tollywood" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                
                <span>Tollywood</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/bollywood" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                
                <span>Bollywood</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/hollywood" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>Hollywood</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/anime" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                
                <span>Anime</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/search" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Search size={16} />
                <span>Explore All</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Single Universal Header Search Bar & Admin Gateway */}
        <div className="nav-actions">
          <form onSubmit={handleSearchSubmit} className="nav-search-form" role="search">
            <Search size={16} className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search CineVerse movies..."
              value={quickSearch}
              onChange={handleSearchChange}
              className="nav-search-input"
              aria-label="Search movies across Tollywood, Bollywood, Hollywood, and Anime"
            />
          </form>

          {/* Admin Portal Gateway Link */}
          <Link to="/admin/movies" className="admin-portal-gateway-btn" title="Open Admin Portal">
            <ShieldCheck size={16} />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button"
            className="mobile-menu-btn" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form" role="search">
            <Search size={18} className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search CineVerse movies..."
              value={quickSearch}
              onChange={handleSearchChange}
              className="nav-search-input"
              autoFocus
            />
          </form>

          <ul className="mobile-nav-links">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Film size={20} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/tollywood" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Sparkles size={20} color="var(--accent-gold)" />
                <span>Tollywood (Telugu)</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/bollywood" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Tv size={20} color="var(--accent-red)" />
                <span>Bollywood (Hindi)</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/hollywood" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Globe size={20} color="var(--accent-cyan)" />
                <span>Hollywood</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/anime" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Compass size={20} color="var(--accent-purple)" />
                <span>Anime (Japanese)</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/search" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Search size={20} />
                <span>Explore All Movies</span>
              </NavLink>
            </li>

            <li style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <NavLink 
                to="/admin/movies" 
                className="mobile-nav-link"
                style={{ color: 'var(--accent-gold)' }}
                onClick={closeMobileMenu}
              >
                <ShieldCheck size={20} />
                <span>Admin Portal</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
