import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [heroLocation, setHeroLocation] = useState('');
  const [heroPickup, setHeroPickup] = useState('');
  const [heroReturn, setHeroReturn] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);

  const heroSearch = () => {
    const params = new URLSearchParams();
    if (heroLocation) params.append('location', heroLocation);
    if (heroPickup) params.append('pickup', heroPickup);
    if (heroReturn) params.append('return', heroReturn);
    navigate(`/vehicles?${params.toString()}`);
  };

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(-1);
    } else {
      setActiveFaq(index);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Promo Banners */}
      <section className="promo-banners">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-dark">
              <div className="promo-badge">Premium Bikes ★★★★★</div>
              <h3>Rent Premium Bikes from ₹500/day</h3>
              <p>Experience the thrill of riding powerful machines.</p>
              <Link to="/vehicles" className="btn btn-promo-green btn-sm">View Bikes</Link>
            </div>
            <div className="promo-card promo-light">
              <div className="promo-badge">Luxury Cars ★★★★★</div>
              <h3>SUVs & Sedans Available Now</h3>
              <p>Drive your dream car today with AK Enterprises.</p>
              <Link to="/vehicles" className="btn btn-promo-green btn-sm">View Cars</Link>
            </div>
            <div className="promo-card promo-dark promo-accent">
              <div className="promo-badge">Scooty Rentals ★★★★☆</div>
              <h3>Easy & Affordable Scooty Rides</h3>
              <p>Perfect for quick city commutes at just ₹300/day.</p>
              <Link to="/vehicles?type=scooty" className="btn btn-promo-green btn-sm">View Scooties</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-new">
        <div className="container">
          <div className="hero-new-content animate-fadeIn">
            <h1 className="hero-new-title">Find Your Perfect Ride</h1>
            <p className="hero-new-subtitle">Discover premium vehicles at unbeatable prices. From luxury cars to everyday rides, we've got you covered.</p>
            
            {/* Search Form */}
            <div className="hero-new-search">
              <div className="hero-search-fields">
                <div className="hero-search-field">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={heroLocation}
                    onChange={(e) => setHeroLocation(e.target.value)}
                    placeholder="Enter city" 
                  />
                </div>
                <div className="hero-search-field">
                  <label>Pick-up Date</label>
                  <input 
                    type="date" 
                    value={heroPickup}
                    onChange={(e) => setHeroPickup(e.target.value)}
                  />
                </div>
                <div className="hero-search-field">
                  <label>Return Date</label>
                  <input 
                    type="date" 
                    value={heroReturn}
                    onChange={(e) => setHeroReturn(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn hero-search-btn" onClick={heroSearch}>Search Vehicles</button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Vehicles</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">10K+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Categories */}
      <section className="section" id="categories">
        <div className="container">
          <div className="categories-grid">
            <Link to="/vehicles?type=bike" className="category-card animate-on-scroll">
              <div className="category-img-wrapper">
                <img src="/images/bikes/red-chopper.png" alt="Rent Bikes" />
              </div>
              <div className="category-info">
                <h3>Rent Bikes</h3>
                <span className="category-arrow">↗</span>
              </div>
            </Link>
            <Link to="/vehicles?type=car" className="category-card animate-on-scroll" style={{animationDelay: '0.1s'}}>
              <div className="category-img-wrapper">
                <img src="/images/cars/green-defender.png" alt="Rent Cars" />
              </div>
              <div className="category-info">
                <h3>Rent Cars</h3>
                <span className="category-arrow">↗</span>
              </div>
            </Link>
            <Link to="/vehicles?type=suv" className="category-card animate-on-scroll" style={{animationDelay: '0.2s'}}>
              <div className="category-img-wrapper">
                <img src="/images/cars/black-luxury-suv.png" alt="Rent SUVs" />
              </div>
              <div className="category-info">
                <h3>Rent SUVs</h3>
                <span className="category-arrow">↗</span>
              </div>
            </Link>
            <Link to="/vehicles?type=scooty" className="category-card animate-on-scroll" style={{animationDelay: '0.3s'}}>
              <div className="category-img-wrapper">
                <img src="/images/scooty/tvs-scooty-pep-plus-standard-167.avif" alt="Rent Scooty" />
              </div>
              <div className="category-info">
                <h3>Rent Scooty</h3>
                <span className="category-arrow">↗</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Cars */}
      <section className="section" id="popular">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Popular Vehicles</h2>
            <p>Check out some of the most popular bikes & cars our customers love,<br/>known for their performance, style, and reliability.</p>
          </div>
          
          <div className="popular-cars-grid">
            <div className="popular-car-card featured animate-on-scroll">
              <div className="popular-car-badge">Featured</div>
              <img src="/images/bikes/red-chopper.png" alt="Red Chopper Bike" />
              <div className="popular-car-info">
                <h3>Red Chopper</h3>
                <p className="popular-car-price">Rent: ₹1,500/day</p>
                <Link to="/vehicle-details" className="btn btn-gold btn-sm">Rent Now</Link>
              </div>
            </div>
            
            <div className="popular-car-card animate-on-scroll">
              <img src="/images/bikes/black-cafe-racer.png" alt="Black Cafe Racer" />
              <div className="popular-car-info">
                <h3>Black Cafe Racer</h3>
                <p className="popular-car-price">Rent: ₹800/day</p>
              </div>
            </div>

            <div className="popular-car-card animate-on-scroll">
              <img src="/images/cars/green-defender.png" alt="Defender SUV" />
              <div className="popular-car-info">
                <h3>Defender SUV</h3>
                <p className="popular-car-price">Rent: ₹5,000/day</p>
              </div>
            </div>

            <div className="popular-car-card animate-on-scroll">
              <img src="/images/cars/black-luxury-suv.png" alt="Luxury SUV" />
              <div className="popular-car-info">
                <h3>Luxury SUV</h3>
                <p className="popular-car-price">Rent: ₹4,000/day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top-Rated Cars by Type */}
      <section className="section section-gray" id="top-rated">
        <div className="container">
          <div className="section-header text-center">
            <h2><em>Top-rated</em> cars by type</h2>
            <p>Discover the highest rated cars in each category, handpicked for<br/>their performance, comfort, and reliability.</p>
          </div>

          <div className="top-rated-grid">
            <div className="top-rated-card animate-on-scroll">
              <div className="top-rated-img">
                <img src="/images/bikes/red-chopper.png" alt="Premium Bikes" />
              </div>
              <div className="top-rated-info">
                <h4>Premium Bikes</h4>
                <span className="top-rated-arrow">▶</span>
              </div>
            </div>
            <div className="top-rated-card animate-on-scroll">
              <div className="top-rated-img">
                <img src="/images/bikes/black-cafe-racer.png" alt="Sport Bikes" />
              </div>
              <div className="top-rated-info">
                <h4>Sport Bikes</h4>
                <span className="top-rated-arrow">▶</span>
              </div>
            </div>
            <div className="top-rated-card animate-on-scroll">
              <div className="top-rated-img">
                <img src="/images/cars/green-defender.png" alt="Best SUV" />
              </div>
              <div className="top-rated-info">
                <h4>Best SUV</h4>
                <span className="top-rated-arrow">▶</span>
              </div>
            </div>
            <div className="top-rated-browse">
              <div className="browse-circle" onClick={() => navigate('/vehicles')}>
                <span>Browse all<br/><strong>top rated vehicles</strong></span>
                <div className="browse-arrow">▶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" id="why-choose">
        <div className="container">
          <div className="why-choose-layout">
            <div className="why-choose-left">
              <div className="section-header">
                <h2>Why <em>Choose</em> Us</h2>
                <p>We provide a smooth car buying or renting experience with great vehicle options, clear pricing, and top-notch customer support.</p>
              </div>

              <div className="features-grid">
                <div className="feature-item animate-on-scroll">
                  <div className="feature-icon">🚗</div>
                  <div>
                    <h4>Wide Selection of Vehicles</h4>
                    <p>Choose from a diverse selection of cars to suit your style and budget, whether you're looking to buy or rent.</p>
                  </div>
                </div>
                <div className="feature-item animate-on-scroll">
                  <div className="feature-icon">💰</div>
                  <div>
                    <h4>Transparent Pricing</h4>
                    <p>We believe in clear, upfront pricing with no hidden fees, ensuring you get the best deal on your vehicle.</p>
                  </div>
                </div>
                <div className="feature-item animate-on-scroll">
                  <div className="feature-icon">💳</div>
                  <div>
                    <h4>Flexible Financing Options</h4>
                    <p>Get customized financing plans that fit your budget, making it easier to drive away in your dream car.</p>
                  </div>
                </div>
                <div className="feature-item animate-on-scroll">
                  <div className="feature-icon">🤝</div>
                  <div>
                    <h4>Exceptional Customer Service</h4>
                    <p>Our team is dedicated to providing personalized support, ensuring a seamless experience from start to finish.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="why-choose-right">
              <img src="/images/cars/black-luxury-suv.png" alt="Luxury Vehicle" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-gray" id="faq">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-left">
              <div className="section-header">
                <h2>Frequently Asked<br/><em>Questions</em></h2>
              </div>
              <div className="faq-image">
                <img src="/images/bikes/red-chopper.png" alt="Vehicles FAQ" />
              </div>
            </div>
            <div className="faq-right">
              {[
                {q: "How can I buy a car from your website?", a: "Simply browse our selection of cars for sale, select the one that fits your needs, and follow the steps to complete the purchase online. Our team is here to assist if you need help."},
                {q: "What are the rental terms for cars?", a: "Our rental terms vary based on vehicle type and duration. Standard rentals include unlimited mileage, insurance coverage, and 24/7 roadside assistance."},
                {q: "Do you offer financing options?", a: "Yes! We offer flexible financing options including 0% APR for qualified buyers, low monthly payments, and customizable loan terms to fit your budget."},
                {q: "Can I test drive a car before purchasing?", a: "Absolutely! Schedule a test drive directly through our website or visit any of our locations. We want you to feel confident in your purchase."},
                {q: "What documents do I need to rent a car?", a: "You'll need a valid driver's license, a credit card in your name, and proof of insurance. International customers may need an International Driving Permit."}
              ].map((faq, idx) => (
                <div key={idx} className={`faq-item animate-on-scroll ${activeFaq === idx ? 'active' : ''}`} onClick={() => toggleFaq(idx)}>
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Ride Your Dream Vehicle?</h2>
          <p>Join thousands of satisfied customers and rent premium bikes & cars today</p>
          <div className="cta-buttons">
            <Link to="/vehicles" className="btn btn-primary btn-lg cta-primary-btn">Browse Vehicles</Link>
            <Link to="/register" className="btn btn-outline btn-lg cta-secondary-btn">Create Account</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
