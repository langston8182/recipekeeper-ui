import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <button className="btn-icon" title="Rechercher">
            <span>🔍</span>
          </button>
          <button className="btn-icon" onClick={handleLogout} title="Déconnexion">
            <span>🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
};
