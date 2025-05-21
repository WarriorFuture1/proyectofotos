import React, { useEffect, useState } from 'react';

export default function ImageModal({ imageId, onClose }) {
  const [frases, setFrases] = useState([]);
  const [texto, setTexto] = useState('');

  const API = `http://localhost:4000/api/frases/${imageId}`;

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setFrases(data));
  }, [imageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto) return;

    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });

    setTexto('');
    const res = await fetch(API);
    const updated = await res.json();
    setFrases(updated);
  };

  return (
    <div style={{ background: '#000000aa', padding: '20px', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <button onClick={onClose}>Cerrar</button>
      <h2>Frases para: {imageId}</h2>
      <ul>
        {frases.map((f, i) => (
          <li key={i}>{f.texto}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe una frase" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
