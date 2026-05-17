import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>AK ENTERPRISES</h4>
            <p>Your trusted partner for premium vehicle rentals. Quality bikes & cars, transparent pricing, exceptional service.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/vehicles" className="footer-link">Browse Vehicles</Link></li>
              <li><Link to="#" className="footer-link">Financing</Link></li>
              <li><Link to="/dashboard" className="footer-link">My Bookings</Link></li>
              <li><Link to="/login" className="footer-link">Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="#" className="footer-link">Help Center</Link></li>
              <li><Link to="#" className="footer-link">Contact Us</Link></li>
              <li><Link to="#" className="footer-link">Terms of Service</Link></li>
              <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: amankumardev688@gmail.com</p>
            <p>Phone: +91 9473044166</p>
            <p>Available 24/7</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 AK ENTERPRISES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
