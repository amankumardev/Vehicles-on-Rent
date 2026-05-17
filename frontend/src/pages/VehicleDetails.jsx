import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import { isAuthenticated, calculateDays } from '../utils/helpers';
import '../styles/VehicleDetails.css';

function VehicleDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vehicleId = searchParams.get('id');
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  useEffect(() => {
    if (!vehicleId) {
      navigate('/vehicles');
      return;
    }
    loadVehicleDetails();
  }, [vehicleId, navigate]);

  const loadVehicleDetails = async () => {
    try {
      const data = await API.getVehicle(vehicleId);
      if (data.success) {
        setVehicle(data.vehicle);
        setMainImage(data.vehicle.images?.[0] || 'https://via.placeholder.com/800x500');
      }
    } catch (error) {
      console.error('Failed to load vehicle details', error);
      alert('Failed to load vehicle details');
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const initiateBooking = () => {
    if (!isAuthenticated()) {
      alert('Please login to book a vehicle');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const processBooking = async () => {
    if (!startDate || !endDate) {
      alert('Please select booking dates');
      return;
    }

    try {
      const bookingData = await API.createBooking({
        vehicle: vehicleId,
        startDate,
        endDate,
        pickupLocation: {
          address: pickupLocation || vehicle.location?.address || '',
          city: vehicle.location?.city || '',
          state: vehicle.location?.state || '',
          zipCode: vehicle.location?.zipCode || ''
        },
        dropoffLocation: {
          address: '',
          city: vehicle.location?.city || '',
          state: vehicle.location?.state || '',
          zipCode: vehicle.location?.zipCode || ''
        }
      });

      if (bookingData.success) {
        alert('Booking created! Processing payment...');
        navigate(`/payment?bookingId=${bookingData.booking._id}`);
      }
    } catch (error) {
      alert(error.message || 'Booking failed');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  let totalDays = 0;
  let totalPrice = 0;
  if (startDate && endDate && vehicle) {
    totalDays = calculateDays(startDate, endDate);
    totalPrice = totalDays * vehicle.pricePerDay;
  }

  if (loading) {
    return (
      <div style={{ padding: '100px 0 40px' }}>
        <div className="container">
          <div className="loading-container" style={{ minHeight: '400px' }}>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div style={{ padding: '100px 0 40px' }}>
      <div className="container">
        <div className="vehicle-details-layout">
          <div className="vehicle-images">
            <img src={mainImage} alt={vehicle.name} className="main-vehicle-image" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            {vehicle.images?.length > 1 && (
              <div className="thumbnail-list" style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                {vehicle.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="thumbnail" 
                    onClick={() => setMainImage(img)}
                    style={{ 
                      width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', 
                      border: mainImage === img ? '2px solid var(--primary)' : '2px solid transparent', 
                      transition: '0.2s' 
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="vehicle-info card">
            <h1>{vehicle.name}</h1>
            <div className="vehicle-meta">
              <span className="badge badge-primary">{vehicle.type}</span>
              <span className={`badge ${vehicle.availability ? 'badge-success' : 'badge-danger'}`}>
                {vehicle.availability ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            <div className="vehicle-price">
              <span style={{ fontSize: '3rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{vehicle.pricePerDay}
              </span>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/day</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', margin: 'var(--spacing-lg) 0' }}>{vehicle.description}</p>

            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-icon">👥</div>
                <div>
                  <div className="spec-label">Seats</div>
                  <div className="spec-value">{vehicle.specifications?.seats} People</div>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-icon">⚙️</div>
                <div>
                  <div className="spec-label">Transmission</div>
                  <div className="spec-value">{vehicle.specifications?.transmission}</div>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-icon">⛽</div>
                <div>
                  <div className="spec-label">Fuel</div>
                  <div className="spec-value">{vehicle.specifications?.fuelType}</div>
                </div>
              </div>
              <div className="spec-item">
                <div className="spec-icon">📍</div>
                <div>
                  <div className="spec-label">Location</div>
                  <div className="spec-value">{vehicle.location?.city}</div>
                </div>
              </div>
            </div>

            {vehicle.features?.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <h4>Features</h4>
                <div className="features-list">
                  {vehicle.features.map((f, idx) => (
                    <span key={idx} className="feature-tag">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: 'var(--spacing-xl)' }} 
              onClick={initiateBooking}
              disabled={!vehicle.availability}
            >
              {vehicle.availability ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Complete Your Booking</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <div>
              <div className="form-group">
                <label className="form-label">Pick-up Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  min={today}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Return Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate || today}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pickup Location (Optional)</label>
                <input 
                  type="text" 
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className="form-input" 
                  placeholder="Enter location" 
                />
              </div>
              
              <div className="booking-summary card-glass mb-3">
                <div className="flex-between mb-2">
                  <span>Total Days:</span>
                  <strong>{totalDays}</strong>
                </div>
                <div className="flex-between mb-2">
                  <span>Price per Day:</span>
                  <strong>₹{vehicle.pricePerDay}</strong>
                </div>
                <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '1.25rem' }}>Total:</span>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary-light)' }}>₹{totalPrice}</strong>
                </div>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={processBooking}>
                Complete Payment & Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
