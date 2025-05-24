import React, { useEffect, useState } from 'react';

export default function ImageModal({ imageId, onClose }) {
  const [frases, setFrases] = useState([]);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/frases/${imageId}`;

  useEffect(() => {
    const fetchFrases = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('Error al cargar frases');
        const data = await res.json();
        setFrases(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las frases');
      }
    };

    fetchFrases();
  }, [API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, frase: texto.trim() }),
      });

      if (!res.ok) throw new Error('Error al añadir comentario');

      setTexto('');
      const updatedRes = await fetch(API);
      if (!updatedRes.ok) throw new Error('Error al actualizar frases');
      const updated = await updatedRes.json();
      setFrases(updated);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo añadir el comentario');
    }
  };

  return (
    <div style={{ background: '#000000aa', padding: '20px', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <button onClick={onClose}>Cerrar</button>
      <h2>Frases para: {imageId}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {frases.map((f, i) => (
          <li key={i}>{f.texto}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una frase"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}