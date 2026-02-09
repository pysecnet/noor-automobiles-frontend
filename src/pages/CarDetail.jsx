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
  const [imageLoaded, setImageLoaded] = useState(false);
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
      setImageLoaded(false);
    }
  };

  const prevImage = () => {
    if (car?.images?.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
      setImageLoaded(false);
    }
  };

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

  const getOptimizedImage = (url, width = 800) => {
    if (!url) return 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80';
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    }
    return url;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Vehicle Not Found</h2>
        <p style={{ color: '#737373', marginBottom: '24px' }}>The vehicle you're looking for doesn't exist.</p>
        <Link to="/collection" className="btn btn-primary">Browse Collection</Link>
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
    { icon: Calendar, label: 'Year', value: car.year || 'N/A' },
    { icon: Gauge, label: 'Mileage', value: car.mileage || 'N/A' },
    { icon: Settings, label: 'Transmission', value: car.transmission || 'N/A' },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel_type || 'Petrol' },
    { icon: Palette, label: 'Color', value: car.color || 'N/A' },
    { icon: Car, label: 'Body Type', value: car.body_type || 'N/A' }
  ];

  const currentImage = car.images?.[selectedImageIndex] || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80';

  return (
    <div style={{ paddingTop: '80px', overflowX: 'hidden' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <Link to="/collection" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#737373', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            Back to Collection
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section style={{ padding: '24px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div className="car-detail-wrapper">
            {/* Left: Gallery */}
            <div className="car-detail-gallery">
              {/* Main Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '75%',
                background: '#f5f5f5',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer'
              }} onClick={() => setShowLightbox(true)}>
                {!imageLoaded && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#f5f5f5', zIndex: 1
                  }}>
                    <div style={{
                      width: '40px', height: '40px', border: '3px solid #e5e5e5',
                      borderTopColor: '#c41e3a', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                    }} />
                  </div>
                )}
                <img
                  src={getOptimizedImage(currentImage, 1000)}
                  alt={car.title}
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease'
                  }}
                />
                
                {/* Status Badge */}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px', padding: '6px 14px',
                  background: status.bg, color: status.text, fontSize: '0.7rem',
                  fontWeight: '600', textTransform: 'uppercase', borderRadius: '8px', zIndex: 2
                }}>
                  {car.status}
                </div>

                {/* Click to enlarge */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px', padding: '8px 14px',
                  background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.75rem',
                  fontWeight: '500', borderRadius: '8px', zIndex: 2
                }}>
                  Click to enlarge
                </div>

                {/* Image Counter */}
                {car.images?.length > 1 && (
                  <div style={{
                    position: 'absolute', bottom: '12px', right: '12px', padding: '8px 14px',
                    background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.8rem',
                    fontWeight: '500', borderRadius: '8px', zIndex: 2
                  }}>
                    {selectedImageIndex + 1} / {car.images.length}
                  </div>
                )}

                {/* Nav Arrows */}
                {car.images?.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      width: '40px', height: '40px', background: 'rgba(255,255,255,0.9)',
                      border: 'none', borderRadius: '50%', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                    }}><ChevronLeft size={22} /></button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      width: '40px', height: '40px', background: 'rgba(255,255,255,0.9)',
                      border: 'none', borderRadius: '50%', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                    }}><ChevronRight size={22} /></button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {car.images?.length > 1 && (
                <div style={{
                  display: 'flex', gap: '8px', marginTop: '12px',
                  overflowX: 'auto', paddingBottom: '8px'
                }}>
                  {car.images.map((img, i) => (
                    <div key={i} onClick={() => { setSelectedImageIndex(i); setImageLoaded(false); }} style={{
                      flexShrink: 0, width: '70px', height: '52px', background: '#f5f5f5',
                      overflow: 'hidden', cursor: 'pointer', borderRadius: '8px',
                      border: i === selectedImageIndex ? '3px solid #c41e3a' : '3px solid transparent',
                      opacity: i === selectedImageIndex ? 1 : 0.6
                    }}>
                      <img src={getOptimizedImage(img, 100)} alt="" loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Videos */}
              {car.videos?.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#737373', marginBottom: '12px' }}>Videos</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {car.videos.map((video, i) => (
                      <LazyVideo key={i} src={video} style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="car-detail-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#c41e3a' }}>{car.brand}</span>
                <span style={{ color: '#d4d4d4' }}>•</span>
                <span style={{ fontSize: '0.75rem', color: '#737373' }}>{car.model}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: '700', color: '#0a0a0a',
                marginBottom: '20px', lineHeight: 1.3, wordBreak: 'break-word'
              }}>
                {car.title}
              </h1>

              {/* Engine */}
              {car.engine && (
                <div style={{
                  padding: '14px 16px', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                  color: '#fff', marginBottom: '20px', borderRadius: '12px'
                }}>
                  <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Engine</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', wordBreak: 'break-word' }}>{car.engine}</p>
                </div>
              )}

              {/* Specs Grid */}
              <div className="specs-grid">
                {specs.map((spec, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', background: '#f8f8f8', borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', background: '#fff', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <spec.icon size={14} color="#c41e3a" />
                    </div>
                    <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.55rem', color: '#737373', textTransform: 'uppercase' }}>{spec.label}</p>
                      <p style={{
                        fontWeight: '600', color: '#0a0a0a', fontSize: '0.75rem',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {car.description && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#737373', marginBottom: '10px' }}>About This Vehicle</h3>
                  <p style={{ color: '#525252', lineHeight: 1.7, fontSize: '0.85rem', wordBreak: 'break-word' }}>{car.description}</p>
                </div>
              )}

              {/* Features */}
              {car.features?.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: '#737373', marginBottom: '10px' }}>Features</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {car.features.map((feature, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '5px 10px', background: '#f0fdf4', color: '#166534',
                        fontSize: '0.7rem', fontWeight: '500', borderRadius: '6px'
                      }}>
                        <Check size={10} />{feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA - FIXED FOR RESPONSIVENESS */}
              <div style={{
                marginTop: '24px', padding: '16px',
                background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                borderRadius: '14px', color: '#fff',
                overflow: 'hidden'
              }}>
                <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>Interested?</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '14px' }}>Contact Us</p>
                
                {/* Buttons - Stack on mobile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setShowInquiry(true)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', background: '#fff', color: '#c41e3a',
                    fontSize: '0.8rem', fontWeight: '600', border: 'none', borderRadius: '10px', 
                    cursor: 'pointer', width: '100%'
                  }}>
                    <MessageSquare size={16} />
                    Send Inquiry
                  </button>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="tel:03241344368" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '12px', background: 'rgba(255,255,255,0.15)', color: '#fff',
                      fontSize: '0.8rem', fontWeight: '600', border: 'none',
                      borderRadius: '10px', textDecoration: 'none', flex: 1
                    }}>
                      <Phone size={14} />
                      Call
                    </a>
                    <a href={`https://wa.me/923241344368?text=${encodeURIComponent('Hi! I am interested in ' + car.title)}`}
                      target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '12px', background: '#25D366', color: '#fff',
                      fontSize: '0.8rem', fontWeight: '600', border: 'none', 
                      borderRadius: '10px', textDecoration: 'none', flex: 1
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 3000, padding: '20px'
        }} onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} style={{
            position: 'absolute', top: '20px', right: '20px', width: '50px', height: '50px',
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><X size={28} color="#fff" /></button>

          {car.images?.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{
                position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}><ChevronLeft size={28} color="#fff" /></button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}><ChevronRight size={28} color="#fff" /></button>
            </>
          )}

          <img src={getOptimizedImage(currentImage, 1200)} alt={car.title}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} />

          {car.images?.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
              padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontSize: '0.9rem', fontWeight: '500', borderRadius: '30px'
            }}>
              {selectedImageIndex + 1} / {car.images.length}
            </div>
          )}
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 2000, padding: '16px'
        }}>
          <div style={{
            background: '#fff', maxWidth: '450px', width: '100%',
            maxHeight: '90vh', overflow: 'auto', borderRadius: '16px'
          }}>
            <div style={{
              padding: '16px', borderBottom: '1px solid #f5f5f5',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#737373', marginBottom: '2px' }}>Inquiry For</p>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.title}</h3>
              </div>
              <button onClick={() => setShowInquiry(false)} style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', borderRadius: '10px', 
                fontSize: '1.3rem', color: '#737373', flexShrink: 0, marginLeft: '12px'
              }}>×</button>
            </div>

            {submitted ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{
                  width: '50px', height: '50px', margin: '0 auto 16px', background: '#dcfce7',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><Check size={26} color="#22c55e" /></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>Inquiry Sent!</h3>
                <p style={{ color: '#737373', marginBottom: '16px', fontSize: '0.9rem' }}>We'll get back to you soon.</p>
                <button onClick={() => { setShowInquiry(false); setSubmitted(false); }}
                  style={{ padding: '10px 24px', background: '#c41e3a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} style={{ padding: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>Your Name *</label>
                  <input type="text" required value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e5e5', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>Email *</label>
                  <input type="email" required value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e5e5', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>Phone</label>
                  <input type="tel" value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e5e5', borderRadius: '8px', fontSize: '0.95rem' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px' }}>Message *</label>
                  <textarea required rows={3} value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e5e5', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={submitting} style={{
                  width: '100%', padding: '12px', background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                  color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
                }}>{submitting ? 'Sending...' : 'Send Inquiry'}</button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        * { box-sizing: border-box; }
        
        .car-detail-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .car-detail-gallery { 
          width: 100%; 
          min-width: 0;
        }
        .car-detail-info { 
          width: 100%; 
          min-width: 0;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        
        @media (max-width: 900px) {
          .car-detail-wrapper {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        
        @media (max-width: 400px) {
          .specs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CarDetail;
