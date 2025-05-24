const handleSubmit = async (e) => {
  e.preventDefault();
  if (!texto.trim()) return;

  try {
    console.log('Enviando datos:', { imageId, frase: texto.trim() }); // Log para depuración
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, frase: texto.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error en la respuesta del servidor:', errorData);
      throw new Error('Error al añadir comentario');
    }

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