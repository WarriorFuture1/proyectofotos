import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';

export default function App() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/api/images')
      .then(res => {
        const imageIds = res.data.map(name => name.split('.')[0]);
        setImages(imageIds);
      })
      .catch(err => console.error('Error cargando imágenes', err));
  }, []);

  useEffect(() => {
    if (currentIndex !== null && images[currentIndex]) {
      setSelectedImage(images[currentIndex]);
    } else {
      setSelectedImage(null);
    }
  }, [currentIndex, images]);

  useEffect(() => {
    if (selectedImage) {
      setLoadingComments(true);
      axios.get(`http://localhost:4000/api/frases/${selectedImage}`)
        .then(res => {
          setComments(res.data);
          setLoadingComments(false);
        })
        .catch(() => {
          setComments([]);
          setLoadingComments(false);
        });
    } else {
      setComments([]);
    }
  }, [selectedImage]);

  const addComment = () => {
    if (!newComment.trim()) return;
    axios.post('http://localhost:4000/api/frases', {
      imageId: selectedImage,
      frase: newComment.trim(),
    })
      .then(() => axios.get(`http://localhost:4000/api/frases/${selectedImage}`))
      .then(res => {
        setComments(res.data);
        setNewComment('');
      })
      .catch(() => alert('Error al añadir comentario'));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setCurrentIndex(null);
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      backgroundColor: '#2c2c2c',
      minHeight: '100vh',
      color: 'white',
      width: '100vw',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px', color: 'white' }}>ZULO gallery</h1>
      <Gallery
        images={images}
        onImageClick={(id) => {
          const index = images.indexOf(id);
          if (index !== -1) setCurrentIndex(index);
        }}
      />

      {selectedImage && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              maxWidth: '100vw',
              maxHeight: '100vh',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 10,
                backgroundColor: '#444',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
              aria-label="Cerrar"
              title="Cerrar"
            >
              x
            </button>

            {/* Flecha izquierda */}
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: 20,
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: '#444',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
              aria-label="Anterior"
              title="Anterior"
            >
              {'<'}
            </button>

            {/* Imagen */}
            <img
              src={`http://localhost:4000/images/${selectedImage}.jpg`}
              alt={selectedImage}
              style={{
                flex: '1 1 auto',
                objectFit: 'contain',
                width: '70%',
                height: '100%',
                backgroundColor: 'black',
              }}
              draggable={false}
            />

            {/* Flecha derecha */}
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                top: '50%',
                right: 20,
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: '#444',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
              aria-label="Siguiente"
              title="Siguiente"
            >
              {'>'}
            </button>

            {/* Comentarios */}
            <div
              style={{
                width: '30%',
                backgroundColor: '#fff',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ marginTop: 0, color: 'black' }}>Comentarios</h2>

              {loadingComments ? (
                <p>Cargando...</p>
              ) : comments.length === 0 ? (
                <p>No hay comentarios aún.</p>
              ) : (
                <ul style={{ flexGrow: 1, paddingLeft: '20px', margin: 0, color: 'black' }}>
                  {comments.map((c, i) => (
                    <li key={i} style={{ marginBottom: '10px' }}>{c.frase}</li>
                  ))}
                </ul>
              )}

              <div style={{ marginTop: 'auto' }}>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Añade un comentario..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button
                  onClick={addComment}
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
