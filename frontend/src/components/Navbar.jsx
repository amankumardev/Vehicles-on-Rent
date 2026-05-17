import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img 
            src="/images/ak-logo.png" 
            alt="AK Enterprises Logo" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          AK ENTERPRISES
        </Link>
        
        <button 
          className="navbar-toggle" 
          id="navbarToggle" 
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`} id="navbarMenu">
          <li><Link to="/vehicles" className="navbar-link">Rent a Bike</Link></li>
          <li><Link to="/vehicles?type=scooty" className="navbar-link">Rent a Scooty</Link></li>
          <li><Link to="/vehicles" className="navbar-link">Rent a Car</Link></li>
          <li><Link to="#" className="navbar-link">Our Fleet</Link></li>
          <li><Link to="#" className="navbar-link">About Us</Link></li>
        </ul>

        <div className="navbar-icons">
          <button className="navbar-icon-btn" aria-label="Search" id="searchBtn">🔍</button>
          <button className="navbar-icon-btn" aria-label="Wishlist" id="wishlistBtn">♡</button>
          <Link to="/login" className="navbar-icon-btn" aria-label="Account" id="accountBtn">👤</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
