import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, Palette, Car, Check, Phone, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`);
        setCar(response.data);
        setInquiryForm(prev => ({
          ...prev,
          message: `I am interested in the ${response.data.title}. Please provide more details.`
        }));
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/inquiries', {
        ...inquiryForm,
        car_id: car.id
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (car?.images?.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images?.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setShowLightbox(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, car]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '16px' }}>
          Vehicle Not Found
        </h2>
        <p style={{ color: '#737373', marginBottom: '24px' }}>
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/collection" className="btn btn-primary">
          Browse Collection
        </Link>
      </div>
    );
  }

  const statusColors = {
    available: { bg: '#dcfce7', text: '#166534' },
    reserved: { bg: '#fef3c7', text: '#92400e' },
    sold: { bg: '#fee2e2', text: '#dc2626' },
    upcoming: { bg: '#ede9fe', text: '#7c3aed' }
  };
  const status = statusColors[car.status] || statusColors.available;

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Gauge, label: 'Mileage', value: car.mileage || 'N/A' },
    { icon: Settings, label: 'Transmission', value: car.transmission || 'N/A' },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type || 'Petrol' },
    { icon: Palette, label: 'Color', value: car.color || 'N/A' },
    { icon: Car, label: 'Body Type', value: car.body_type || 'N/A' }
  ];

  const currentImage = car.images?.[selectedImageIndex] || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80';

  return (
    <div style={{ paddingTop: '90px' }}>
      {/* Breadcrumb */}
      <div style={{
        padding: '24px 0',
        borderBottom: '1px solid #f5f5f5'
      }}>
        <div className="container">
          <Link 
            to="/collection"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#737373',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.color = '#0a0a0a'}
            onMouseLeave={e => e.target.style.color = '#737373'}
          >
            <ArrowLeft size={16} />
            Back to Collection
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ padding: '60px 0 120px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '60px',
            alignItems: 'start'
          }}>
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div 
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: '#f5f5f5',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowLightbox(true)}
              >
                <img
                  src={currentImage}
                  alt={car.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  padding: '8px 16px',
                  background: status.bg,
                  color: status.text,
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderRadius: '8px'
                }}>
                  {car.status}
                </div>

                {/* Image Counter */}
                {car.images?.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    borderRadius: '8px'
                  }}>
                    {selectedImageIndex + 1} / {car.images.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {car.images?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '44px',
                        height: '44px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      <ChevronLeft size={24} color="#0a0a0a" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '44px',
                        height: '44px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      <ChevronRight size={24} color="#0a0a0a" />
                    </button>
                  </>
                )}

                {/* Click hint */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  padding: '8px 16px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  borderRadius: '8px'
                }}>
                  Click to enlarge
                </div>
              </div>

              {/* Thumbnail Strip */}
              {car.images?.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px',
                  overflowX: 'auto',
                  paddingBottom: '8px'
                }}>
                  {car.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      style={{
                        flexShrink: 0,
                        width: '80px',
                        height: '60px',
                        background: '#f5f5f5',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        border: i === selectedImageIndex ? '3px solid #c41e3a' : '3px solid transparent',
                        opacity: i === selectedImageIndex ? 1 : 0.6,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={img}
                        alt={`${car.title} ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Videos Section */}
              {car.videos?.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#737373',
                    marginBottom: '16px'
                  }}>
                    Videos
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {car.videos.map((video, i) => (
                      <video
                        key={i}
                        src={video}
                        controls
                        style={{
                          width: '100%',
                          maxWidth: '400px',
                          borderRadius: '12px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#c41e3a'
                }}>
                  {car.brand}
                </span>
                <span style={{ color: '#d4d4d4' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#737373'
                }}>
                  {car.model}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '600',
                color: '#0a0a0a',
                marginBottom: '24px',
                lineHeight: 1.2
              }}>
                {car.title}
              </h1>

              {/* Engine */}
              {car.engine && (
                <div style={{
                  padding: '20px 24px',
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                  color: '#fff',
                  marginBottom: '32px',
                  borderRadius: '12px'
                }}>
                  <p style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '8px'
                  }}>
                    Engine
                  </p>
                  <p style={{
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    {car.engine}
                  </p>
                </div>
              )}

              {/* Specifications */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginBottom: '32px'
              }}>
                {specs.map((spec, i) => (
                  <div 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      background: '#f8f8f8',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: '#fff',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <spec.icon size={20} color="#c41e3a" />
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.7rem',
                        color: '#737373',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {spec.label}
                      </p>
                      <p style={{
                        fontWeight: '600',
                        color: '#0a0a0a',
                        fontSize: '0.95rem'
                      }}>
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {car.description && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#737373',
                    marginBottom: '16px'
                  }}>
                    About This Vehicle
                  </h3>
                  <p style={{
                    color: '#525252',
                    lineHeight: 1.8,
                    fontSize: '1rem'
                  }}>
                    {car.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {car.features?.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#737373',
                    marginBottom: '16px'
                  }}>
                    Features
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    {car.features.map((feature, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          background: '#f0fdf4',
                          color: '#166534',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          borderRadius: '8px'
                        }}
                      >
                        <Check size={16} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div style={{
                padding: '32px',
                background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                color: '#fff',
                borderRadius: '16px'
              }}>
                <p style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  Interested in this vehicle?
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  Contact Us for Details
                </p>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setShowInquiry(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      background: '#fff',
                      color: '#c41e3a',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageSquare size={18} />
                    Send Inquiry
                  </button>
                  
                   <a href="tel:03241344368"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      background: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '10px',
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={18} />
                    0324-1344368
                  </a>
                  
                    <a href={`https://wa.me/923241344368?text=Hi! I am interested in ${encodeURIComponent(car.title)}. Please provide more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      background: '#25D366',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '10px',
                      textDecoration: 'none'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <X size={28} color="#fff" />
          </button>

          {/* Navigation Arrows */}
          {car.images?.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={32} color="#fff" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={32} color="#fff" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={currentImage}
            alt={car.title}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />

          {/* Image Counter */}
          {car.images?.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '500',
              borderRadius: '30px'
            }}>
              {selectedImageIndex + 1} / {car.images.length}
            </div>
          )}
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: '20px'
          }}>
            <div style={{
              padding: '28px 32px',
              borderBottom: '1px solid #f5f5f5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#737373',
                  marginBottom: '4px'
                }}>
                  Inquiry For
                </p>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#0a0a0a'
                }}>
                  {car.title}
                </h3>
              </div>
              <button
                onClick={() => setShowInquiry(false)}
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e5e5',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: '#737373',
                  borderRadius: '12px'
                }}
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div style={{
                padding: '60px 32px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={35} color="#22c55e" />
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  Inquiry Sent!
                </h3>
                <p style={{ color: '#737373', marginBottom: '24px' }}>
                  We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => {
                    setShowInquiry(false);
                    setSubmitted(false);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '14px 32px', borderRadius: '12px' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} style={{ padding: '32px' }}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    style={{ borderRadius: '12px', padding: '14px 16px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    style={{ borderRadius: '12px', padding: '14px 16px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={{ borderRadius: '12px', padding: '14px 16px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input form-textarea"
                    required
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    style={{ borderRadius: '12px', padding: '14px 16px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .container > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CarDetail;
