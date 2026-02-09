import { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width = 800, 
  style = {}, 
  className = '',
  onClick,
  priority = false 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getOptimizedSrc = (url, w) => {
    if (!url) return '';
    
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', `/upload/w_${w},q_auto,f_auto/`);
    }
    
    if (url.includes('unsplash.com')) {
      return `${url.split('?')[0]}?w=${w}&q=80&auto=format`;
    }
    
    return url;
  };

  const optimizedSrc = getOptimizedSrc(src, width);

  return (
    <div 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...style 
      }}
      className={className}
      onClick={onClick}
    >
      {!loaded && !error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            border: '3px solid #e5e5e5',
            borderTopColor: '#c41e3a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f8f8f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.8rem'
        }}>
          No Image
        </div>
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;
