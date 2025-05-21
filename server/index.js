const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// === SERVIR IMÁGENES DESDE LA CARPETA ===
const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

// === ENDPOINT: obtener lista de imágenes ===
app.get('/api/images', (req, res) => {
  fs.readdir(imagesPath, (err, files) => {
    if (err) {
      console.error('Error al leer carpeta de imágenes:', err);
      return res.status(500).json({ error: 'No se pudo leer la carpeta' });
    }

    // Solo archivos .jpg/.png
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png)$/i.test(file)
    );

    res.json(imageFiles);
  });
});

const frases = {}; 

app.get('/api/frases/:id', (req, res) => {
  const { id } = req.params;
  res.json(frases[id] || []);
});

app.post('/api/frases', (req, res) => {
  const { imageId, frase } = req.body;
  if (!imageId || !frase) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  if (!frases[imageId]) frases[imageId] = [];
  frases[imageId].push({ frase });
  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
