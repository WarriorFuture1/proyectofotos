const express = require('express');
const router = express.Router();
const Frase = require('../models/Frase');

// Obtener frases de una imagen
router.get('/:imagenId', async (req, res) => {
  try {
    const frases = await Frase.find({ imagenId: req.params.imagenId }).sort({ fecha: -1 });
    res.json(frases);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener frases' });
  }
});

// Añadir una frase a una imagen
router.post('/:imagenId', async (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ message: 'Texto es requerido' });
  }

  try {
    const nuevaFrase = new Frase({
      imagenId: req.params.imagenId,
      texto
    });
    await nuevaFrase.save();
    res.status(201).json(nuevaFrase);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar frase' });
  }
});

module.exports = router;
