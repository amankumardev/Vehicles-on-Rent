import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import { isAuthenticated, validateEmail } from '../utils/helpers';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const data = await API.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password recovery feature coming soon.');
  };

  return (
    <div className="auth-page-container">
      <main className="login-page">
        <div className="scene-shell">
          <div className="top-strip">
            <Link to="/" className="brand-chip">
              <img src="/images/ak-logo.png" alt="AK Enterprises Logo" />
              <span>AK Enterprises</span>
            </Link>
            <Link to="/" className="back-link">Back to home</Link>
          </div>

          <section className="login-frame animate-fadeIn">
            <div className="login-stage">
              <div className="hero-panel">
                <div>
                  <div className="eyebrow">Premium access</div>
                  <h1 className="hero-title">
                    <span className="title-line">Welcome</span>
                    <span className="title-line">Back</span>
                  </h1>
                  <p className="hero-copy">
                    Apni bookings, payment status aur favorite rides ko ek sleek control panel se manage kijiye. Design video reference jaisa neon-tech feel rakha gaya hai.
                  </p>

                  <div className="status-grid">
                    <div className="status-card">
                      <strong>24/7</strong>
                      <span>Booking support</span>
                    </div>
                    <div className="status-card">
                      <strong>Fast</strong>
                      <span>Dashboard access</span>
                    </div>
                    <div className="status-card">
                      <strong>Secure</strong>
                      <span>Protected login</span>
                    </div>
                    <div className="status-card">
                      <strong>AK</strong>
                      <span>Brand styling</span>
                    </div>
                  </div>
                </div>

                <div className="hero-footer">
                  <p>Vehicle on Rent ke liye dark futuristic login experience, responsive layout ke saath.</p>
                  <div className="hero-lines" aria-hidden="true"></div>
                </div>
              </div>

              <div className="form-panel">
                <div className="form-shell">
                  <h2 className="form-title">Login</h2>
                  <p className="form-subtitle">Use your AK Enterprises account credentials.</p>

                  <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email</label>
                      <div className="input-wrap">
                        <span className="input-icon">@</span>
                        <input
                          type="email"
                          id="email"
                          className="form-input"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <span className="field-trace">ID</span>
                      </div>
                      <span className="form-error">{emailError}</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="password">Password</label>
                      <div className="input-wrap">
                        <span className="input-icon">#</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="form-input"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle" 
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <span className="form-error">{passwordError}</span>
                    </div>

                    <div className="form-meta">
                      <label className="remember-me" htmlFor="rememberMe">
                        <input type="checkbox" id="rememberMe" />
                        <span>Remember me</span>
                      </label>

                      <a href="#" className="forgot-link" onClick={handleForgotPassword}>Forgot password?</a>
                    </div>

                    <button type="submit" className="btn login-btn" disabled={loading}>
                      {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                  </form>

                  <div className="panel-note">
                    New here? <Link to="/register">Create account</Link>
                  </div>

                  <div className="auth-footer">
                    <p>Ride history, bookings and profile controls in one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
