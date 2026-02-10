import React from 'react';
import { Link, useLocation} from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    }
  };3

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          SIMVEX
        </Link>

        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/study/select" 
            className={`nav-link ${location.pathname.startsWith('/study') ? 'active' : ''}`}
          >
            Study
          </Link>
          <Link 
            to="/cad/select" 
            className={`nav-link ${location.pathname.startsWith('/cad') ? 'active' : ''}`}
          >
            CAD
          </Link>
        </div>

        <Link to="/login" className="sign-in-btn">
          {/* <span className="sign-in-icon"></span>  */} Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
