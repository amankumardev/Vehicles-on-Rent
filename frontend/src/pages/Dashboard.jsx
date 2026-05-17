import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../services/api';
import { isAuthenticated, formatDate } from '../utils/helpers';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadUserProfile();
    loadBookings();
  }, [navigate]);

  const loadUserProfile = async () => {
    try {
      const data = await API.getProfile();
      if (data.success) {
        setUser(data.user);
        setProfileName(data.user.name || '');
        setProfilePhone(data.user.phone || '');
        setProfileEmail(data.user.email || '');
      }
    } catch (error) {
      console.error('Failed to load profile', error);
      alert('Failed to load profile');
    }
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await API.getUserBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const data = await API.updateProfile({ name: profileName, phone: profilePhone });
      if (data.success) {
        alert('Profile updated successfully');
        loadUserProfile();
      }
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const data = await API.cancelBooking(bookingId);
      if (data.success) {
        alert('Booking cancelled successfully');
        loadBookings();
      }
    } catch (error) {
      alert(error.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'primary'
    };
    return colors[status] || 'primary';
  };

  const getPaymentColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'primary'
    };
    return colors[status] || 'primary';
  };

  return (
    <div style={{ padding: '100px 0 40px' }}>
      <div className="container">
        <h1 className="mb-4">My Dashboard</h1>
        
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar card">
            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <h3>{user ? user.name : 'Loading...'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user ? user.email : ''}</p>
            </div>
            
            <nav className="dashboard-nav">
              <button 
                className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} 
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
              <button 
                className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`} 
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </nav>
          </aside>

          <main className="dashboard-content">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="dashboard-tab">
                <h2>My Bookings</h2>
                <div className="mt-3">
                  {loadingBookings ? (
                    <div className="loading-container" style={{ minHeight: '300px' }}>
                      <div className="loading-spinner"></div>
                    </div>
                  ) : bookings.length > 0 ? (
                    bookings.map(booking => (
                      <div key={booking._id} className="booking-card card">
                        <div className="booking-header">
                          <div>
                            <h3>{booking.vehicle?.name}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                          <div>
                            <span className={`badge badge-${getStatusColor(booking.status)}`} style={{ marginRight: '5px' }}>{booking.status}</span>
                            <span className={`badge badge-${getPaymentColor(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
                          </div>
                        </div>
                        
                        <div className="booking-details">
                          <div className="booking-detail-item">
                            <span>Total Days:</span>
                            <strong>{booking.totalDays}</strong>
                          </div>
                          <div className="booking-detail-item">
                            <span>Total Price:</span>
                            <strong>&#8377;{booking.totalPrice}</strong>
                          </div>
                          <div className="booking-detail-item">
                            <span>Pickup:</span>
                            <strong>{booking.pickupLocation ? (booking.pickupLocation.city || booking.pickupLocation) : 'N/A'}</strong>
                          </div>
                        </div>

                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <button className="btn btn-danger btn-sm mt-3" onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="card text-center">
                      <p>You have no bookings yet.</p>
                      <Link to="/vehicles" className="btn btn-primary mt-3">Browse Vehicles</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="dashboard-tab">
                <h2>Profile Settings</h2>
                <form onSubmit={handleProfileUpdate} className="mt-3 card" style={{ maxWidth: '600px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Read Only)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={profileEmail}
                      disabled 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                    {loadingProfile ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
