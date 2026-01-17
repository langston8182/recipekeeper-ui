import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-brand">
          <span className="header-logo">🍳</span>
          <span className="header-title">Recipe Keeper</span>
        </Link>

        <div className="header-actions">
          <Link to="/add" className="btn-icon" title="Ajouter une recette">
            <span>+</span>
          </Link>
          <button 
            className="btn-icon" 
            title="Rechercher"
            onClick={() => setShowSearch(!showSearch)}
          >
            <span>🔍</span>
          </button>
          <button className="btn-icon" onClick={handleLogout} title="Déconnexion">
            <span>🚪</span>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="header-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="search-input"
            />
            <button type="submit" className="search-submit">
              Rechercher
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
