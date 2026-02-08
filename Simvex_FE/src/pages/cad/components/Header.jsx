import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="logo">SIMVEX</div>
      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#study">Study</a>
        <a href="#cad" className="nav-cad">CAD</a>
      </nav>
      <button className="sign-in">
        <span>⮞</span> Sign in
      </button>
    </header>
  );
}

export default Header;
