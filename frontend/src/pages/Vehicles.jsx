import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { API } from '../services/api';

function Vehicles() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const initialType = searchParams.get('type');
  const [filters, setFilters] = useState({
    type: initialType && initialType.toLowerCase() === 'scooty' ? 'scooter' : (initialType || ''),
    transmission: '',
    fuelType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadVehicles(filters);
  }, []);

  const loadVehicles = async (currentFilters) => {
    setLoading(true);
    try {
      const params = { available: 'true' };
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key]) params[key] = currentFilters[key];
      });

      const data = await API.getVehicles(params);
      if (data.success) {
        setVehicles(data.vehicles);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    loadVehicles(filters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      type: '',
      transmission: '',
      fuelType: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(defaultFilters);
    loadVehicles(defaultFilters);
  };

  return (
    <div style={{ padding: '100px 0 40px' }}>
      <div className="container">
        <h1 className="text-center mb-4">Find Your Perfect Vehicle</h1>
        
        <div className="vehicles-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginTop: '2rem' }}>
          {/* Filters */}
          <aside className="filters-sidebar card" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
            <h3>Filters</h3>
            
            <div className="filter-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Vehicle Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="form-select">
                <option value="">All Types</option>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="bike">Bike</option>
                <option value="van">Van</option>
                <option value="scooter">Scooty</option>
              </select>
            </div>

            <div className="filter-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Transmission</label>
              <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className="form-select">
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="filter-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Fuel Type</label>
              <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} className="form-select">
                <option value="">All</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            <div className="filter-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Price Range (per day)</label>
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="form-input" placeholder="Min" />
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="form-input mt-2" placeholder="Max" />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={applyFilters}>Apply Filters</button>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '10px' }} onClick={clearFilters}>Clear</button>
          </aside>

          {/* Vehicle Grid */}
          <main className="vehicles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              <div className="loading-container" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / -1' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className="vehicle-card" onClick={() => navigate(`/vehicle-details?id=${vehicle._id}`)} style={{ cursor: 'pointer' }}>
                  <img src={vehicle.images?.[0] || 'https://via.placeholder.com/400x240'} alt={vehicle.name} className="vehicle-card-image" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                  <div className="vehicle-card-content" style={{ padding: '1.5rem' }}>
                    <div className="vehicle-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div className="vehicle-card-name" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{vehicle.name}</div>
                        <div className="vehicle-card-type" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                          {vehicle.type === 'scooter' ? 'Scooty' : vehicle.type}
                        </div>
                      </div>
                      <div className="vehicle-card-price" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                        &#8377;{vehicle.pricePerDay}<span style={{ fontSize: '0.875rem', fontWeight: 500 }}>/day</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.5rem 0' }}>
                      {vehicle.description?.substring(0, 100)}...
                    </p>
                    <div className="vehicle-card-info" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <div className="vehicle-card-spec" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>👥 {vehicle.specifications?.seats}</div>
                      <div className="vehicle-card-spec" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>⚙️ {vehicle.specifications?.transmission}</div>
                      <div className="vehicle-card-spec" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>⛽ {vehicle.specifications?.fuelType}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center" style={{ gridColumn: '1 / -1' }}>No vehicles found matching your criteria.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;
