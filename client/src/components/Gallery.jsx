import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Gallery({ onImageClick }) {
  const [images, setImages] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    axios.get('http://localhost:4000/api/images')
      .then(res => setImages(res.data))
      .catch(err => console.error('Error cargando imágenes', err));
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const img of images) {
        const id = img.split('.')[0];
        try {
          const res = await axios.get(`http://localhost:4000/api/frases/${id}`);
          counts[id] = res.data.length;
        } catch {
          counts[id] = 0;
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
      {images.map((fileName, i) => {
        const imageId = fileName.split('.')[0];
        return (
          <div
            key={i}
            onClick={() => onImageClick(imageId)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: '12px',
              transition: 'transform 0.2s',
            }}
          >
            <img
              src={`http://localhost:4000/images/${fileName}`}
              alt={imageId}
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
              💬 {commentsCount[imageId] || 0}
            </div>
          </div>
        );
      })}
    </div>
  );
}
