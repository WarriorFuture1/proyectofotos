import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/tu_cloud_name/image/upload';

export default function Gallery({ images, onImageClick }) {
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    const fetchCommentsCount = async () => {
      const counts = {};
      for (const publicId of images) {
        try {
          const res = await axios.get(`http://localhost:4000/api/frases/${publicId}`);
          counts[publicId] = res.data.length;
        } catch {
          counts[publicId] = 0;
        }
      }
      setCommentsCount(counts);
    };

    if (images.length) {
      fetchCommentsCount();
    }
  }, [images]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    }}>
      {images.map((publicId) => (
        <div
          key={publicId}
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
            src={`${CLOUDINARY_BASE_URL}/${publicId}.jpg`}
            alt={publicId}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.3s',
              borderRadius: '12px',
            }}
            draggable={false}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '14px',
            userSelect: 'none',
          }}>
            💬 {commentsCount[publicId] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
