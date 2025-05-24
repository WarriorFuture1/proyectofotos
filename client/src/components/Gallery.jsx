import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/tu_cloud_name/image/upload';

// Función para obtener URL miniatura con ancho 250px (ajústalo si quieres)
const getThumbnailUrl = (publicId) => `${CLOUDINARY_BASE_URL}/c_scale,w_250/${publicId}.jpg`;

export default function Gallery({ onImageClick }) {
  const [images, setImages] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/images`)
      .then(res => setImages(res.data))
      .catch(err => console.error('Error cargando imágenes', err));
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const publicId of images) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/frases/${publicId}`);
          counts[publicId] = res.data.length;
        } catch {
          counts[publicId] = 0;
        }
      }
      setCommentsCount(counts);
    };

    if (images.length) fetchCounts();
  }, [images]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px'
    }}>
      {images.map((publicId, i) => (
        <div
          key={i}
          onClick={() => onImageClick(publicId)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '12px',
            transition: 'transform 0.2s',
          }}
        >
          <img
            src={getThumbnailUrl(publicId)}
            alt={publicId}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.3s',
              borderRadius: '12px',
            }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            💬 {commentsCount[publicId] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
