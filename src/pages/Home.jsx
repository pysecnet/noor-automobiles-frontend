import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Shield, Award, Phone, Star, Car, Clock } from 'lucide-react';
import CarCard from '../components/CarCard';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [upcomingCars, setUpcomingCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const [featuredRes, upcomingRes] = await Promise.all([
          axios.get('/api/cars?featured=true&status=available'),
          axios.get('/api/cars?upcoming=true')
        ]);
        setFeaturedCars(featuredRes.data.slice(0, 6));
        setUpcomingCars(upcomingRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        overflow: 'hidden',
        padding: '100px 0 60px'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2
        }} />

        <div style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(196,30,58,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'rgba(196,30,58,0.15)',
              borderRadius: '50px',
              marginBottom: '24px'
            }}>
              <Star size={14} color="#c41e3a" fill="#c41e3a" />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff'
              }}>
                Premium Japanese Imports
              </span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: '700',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '24px'
            }}>
              Import Your<br />
              <span style={{
                background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Dream Car</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              maxWidth: '500px',
              marginBottom: '36px'
            }}>
              We deal in new & used cars imported directly from Japan. 
              Quality you can trust, service you'll love!
            </p>

            <div style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <Link to="/collection" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                color: '#fff',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Explore Collection
                <ArrowRight size={18} />
              </Link>
              <a href="tel:03241344368" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none'
              }}>
                <Phone size={18} />
                0324-1344368
              </a>
            </div>

            <div style={{
              marginTop: '60px',
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap'
            }}>
              {[
                { number: '500+', label: 'Cars Sold' },
                { number: '10+', label: 'Years Experience' },
                { number: '100%', label: 'Satisfaction' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#fff', lineHeight: 1 }}>{stat.number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: '#fafafa' }}>
        <div className="container" style={{ padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(196,30,58,0.1)',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#c41e3a',
              marginBottom: '16px'
            }}>
              Why Choose Us
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#0a0a0a' }}>
              We Make Car Buying <span style={{ color: '#c41e3a' }}>Simple</span>
            </h2>
          </div>

          <div className="features-grid">
            {[
              { icon: Shield, title: 'Verified Quality', description: 'Every car inspected and certified for your peace of mind.', gradient: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 100%)' },
              { icon: Award, title: 'Best Prices', description: 'Direct import means better prices for premium vehicles.', gradient: 'linear-gradient(135deg, #f5f5ff 0%, #e0e0ff 100%)' },
              { icon: Phone, title: '24/7 Support', description: 'Our team is always ready to help you.', gradient: 'linear-gradient(135deg, #f5fff5 0%, #e0ffe0 100%)' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: '#fff',
                padding: '32px 28px',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  width: '65px',
                  height: '65px',
                  background: feature.gradient,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <feature.icon size={28} color="#c41e3a" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', color: '#0a0a0a' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#737373', lineHeight: 1.7 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: 'rgba(196,30,58,0.1)',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#c41e3a',
                marginBottom: '12px'
              }}>Our Collection</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#0a0a0a' }}>
                Featured <span style={{ color: '#c41e3a' }}>Vehicles</span>
              </h2>
            </div>
            <Link to="/collection" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              border: '2px solid #e5e5e5',
              borderRadius: '50px',
              color: '#0a0a0a',
              fontWeight: '600',
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner" />
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="cars-grid">
              {featuredCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fafafa', borderRadius: '20px' }}>
              <Car size={50} color="#d4d4d4" strokeWidth={1} />
              <p style={{ color: '#737373', marginTop: '16px' }}>New inventory coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Cars */}
      {upcomingCars.length > 0 && (
        <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
          <div className="container" style={{ padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(196,30,58,0.2)',
                borderRadius: '50px',
                marginBottom: '16px'
              }}>
                <Clock size={16} color="#c41e3a" />
                <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                  Coming Soon
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#fff' }}>
                Upcoming <span style={{ color: '#c41e3a' }}>Arrivals</span>
              </h2>
            </div>

            <div className="upcoming-grid">
              {upcomingCars.map((car) => (
                <div key={car.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80'}
                      alt={car.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '6px 14px',
                      background: '#c41e3a',
                      borderRadius: '50px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      color: '#fff',
                      textTransform: 'uppercase'
                    }}>
                      Coming Soon
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontSize: '0.7rem', color: '#c41e3a', fontWeight: '600', marginBottom: '6px' }}>
                      {car.brand} • {car.year}
                    </p>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                      {car.title}
                    </h3>
                    <a href="tel:03241344368" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '10px',
                      padding: '10px 18px',
                      background: 'rgba(196,30,58,0.2)',
                      borderRadius: '50px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}>
                      <Phone size={14} />
                      Reserve
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '700', color: '#0a0a0a', marginBottom: '16px' }}>
            Ready to Find Your <span style={{ color: '#c41e3a' }}>Dream Car?</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#737373', marginBottom: '32px' }}>
            Visit our showroom or give us a call!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Visit Us
            </Link>
            <a href="tel:03241344368" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              border: '2px solid #e5e5e5',
              borderRadius: '50px',
              color: '#0a0a0a',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              <Phone size={18} />
              0324-1344368
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
        }
        .upcoming-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .cars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
