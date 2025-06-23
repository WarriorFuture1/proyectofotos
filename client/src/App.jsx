import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE || 'https://res.cloudinary.com/tu_cloud_name/image/upload';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Nuevo estado para el popup de desbloqueo
  const [unlocked, setUnlocked] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [error, setError] = useState('');

  // Cambia esta palabra por la que quieras usar como clave
  const PASSWORD = 'zulo';

  // Solo carga imágenes si está desbloqueado
  useEffect(() => {
    if (unlocked) {
      axios.get(`${API_BASE_URL}/api/images`)
        .then(res => setImages(res.data))
        .catch(() => setImages([]));
    }
  }, [unlocked]);

  useEffect(() => {
    if (selectedImage) {
      setLoadingComments(true);
      axios.get(`${API_BASE_URL}/api/frases/${selectedImage}`)
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
    if (!newComment.trim() || !selectedImage) return;
    axios.post(`${API_BASE_URL}/api/frases`, {
      imageId: selectedImage,
      frase: newComment.trim(),
    })
      .then(() => axios.get(`${API_BASE_URL}/api/frases/${selectedImage}`))
      .then(res => {
        setComments(res.data);
        setNewComment('');
      })
      .catch(() => alert('Error al añadir comentario'));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[prevIndex]);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[nextIndex]);
  };

  const openImage = (id) => {
    setSelectedImage(id);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  // Maneja el desbloqueo
  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputWord.trim().toLowerCase() === PASSWORD) {
      setUnlocked(true);
      setError('');
    } else {
      setError('Palabra incorrecta');
    }
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
      {/* Popup de desbloqueo */}
      {!unlocked && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
        }}>
          <form
            onSubmit={handleUnlock}
            style={{
              background: '#fff',
              padding: '40px 30px',
              borderRadius: '12px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '300px'
            }}
          >
            <h2 style={{ color: '#222', marginBottom: 20 }}>Introduce la palabra para entrar</h2>
            <input
              type="password"
              value={inputWord}
              onChange={e => setInputWord(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '18px',
                marginBottom: '10px',
                width: '100%'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Entrar
            </button>
            {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
          </form>
        </div>
      )}

      <h1 style={{ textAlign: 'center', marginBottom: '0px', marginTop: '10px', color: 'white' }}>ZULO gallery</h1>
      
      {unlocked && (
        <Gallery
          images={images}
          onImageClick={openImage}
        />
      )}

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
            {/* ...botones, imagen y comentarios igual que antes... */}
            {/* ...existing code... */}
          </div>
        </div>
      )}
    </div>
  );
}