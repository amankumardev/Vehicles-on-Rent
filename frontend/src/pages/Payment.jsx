import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { API } from '../services/api';
import { isAuthenticated, formatDate, formatPrice } from '../utils/helpers';
import '../styles/Payment.css';

function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!bookingId) {
      alert('No booking found');
      navigate('/dashboard');
      return;
    }

    initializePayment();
  }, [bookingId, navigate]);

  const initializePayment = async () => {
    try {
      // Get booking details
      const bookingData = await API.getBooking(bookingId);
      if (!bookingData.success) {
        throw new Error('Booking not found');
      }

      setBooking(bookingData.booking);

      // Check if already paid
      if (bookingData.booking.paymentStatus === 'paid') {
        alert('This booking has already been paid');
        navigate('/dashboard');
        return;
      }

      // Create payment intent
      const paymentData = await API.createPaymentIntent(bookingId);
      
      // Initialize Stripe (use test key)
      const stripeInstance = window.Stripe('pk_test_51QcGEJDMy9n8fDjFZpzxYvhWJxztkUNZF3KqfAKvJtRdXe0oLpUF4B2vNv2xBJvx3VFOKJZNsU1HJWvY5Q0wOZRP00uPb8YQlW');
      setStripe(stripeInstance);
      
      const elementsInstance = stripeInstance.elements({ clientSecret: paymentData.clientSecret });
      setElements(elementsInstance);

      const paymentElement = elementsInstance.create('payment');
      
      // Mount after a short delay to ensure the DOM element exists
      setTimeout(() => {
        const el = document.getElementById('payment-element');
        if (el) {
          paymentElement.mount('#payment-element');
        }
      }, 100);

    } catch (err) {
      console.error('Error:', err);
      alert(err.message || 'Failed to initialize payment');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setPaymentProcessing(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard?payment=success&bookingId=' + bookingId
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setPaymentProcessing(false);
    } else {
      // Payment will be handled by return_url
    }
  };

  return (
    <div className="payment-body">
      <div className="payment-container">
        <div className="payment-card card">
          <div className="payment-header">
            <Link to="/" className="auth-brand">🚗 RentRide</Link>
            <h1>Complete Payment</h1>
            <p>Securely pay for your booking</p>
          </div>

          <div id="paymentContent">
            {loading ? (
              <div className="loading-container" style={{ minHeight: '300px' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : booking ? (
              <>
                <div className="booking-summary card-glass mb-4">
                  <h3>Booking Summary</h3>
                  <div className="summary-row">
                    <span>Vehicle:</span>
                    <strong>{booking.vehicle?.name}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Dates:</span>
                    <strong>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Total Days:</span>
                    <strong>{booking.totalDays}</strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount:</span>
                    <strong>{formatPrice(booking.totalPrice)}</strong>
                  </div>
                </div>

                <h3 className="mb-3">Payment Details</h3>
                <form id="payment-form" onSubmit={handlePaymentSubmit}>
                  <div id="payment-element" className="mb-3" style={{ minHeight: '200px' }}></div>
                  
                  {error && <div id="payment-message" className="form-error">{error}</div>}
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : `Pay ${formatPrice(booking.totalPrice)}`}
                  </button>
                </form>

                <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  🔒 Secured by Stripe • Your payment information is encrypted and secure
                </p>
              </>
            ) : (
              <p>Error loading payment details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
