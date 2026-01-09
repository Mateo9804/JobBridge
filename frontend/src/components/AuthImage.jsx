import React, { useState, useEffect, useRef } from 'react';

function AuthImage({ src, alt, className, fallback = '/imagenes/iconoUsuario.png', token }) {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  const blobUrlRef = useRef(null);

  useEffect(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    if (!src) {
      setImageSrc(fallback);
      return;
    }

    if (src.startsWith('data:') || src.startsWith('/')) {
      setImageSrc(src);
      return;
    }

    if (src.includes('/api/') && token) {
      const loadImage = async () => {
        try {
          const response = await fetch(src, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            blobUrlRef.current = objectUrl;
            setImageSrc(objectUrl);
          } else {
            setImageSrc(fallback);
          }
        } catch (error) {
          setImageSrc(fallback);
        }
      };

      loadImage();
    } else {
      setImageSrc(src);
    }

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src, token, fallback]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.target.src !== fallback && e.target.src !== imageSrc) {
          e.target.src = fallback;
        }
      }}
    />
  );
}

export default AuthImage;

