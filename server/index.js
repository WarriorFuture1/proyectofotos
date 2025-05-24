const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Frase = require('./models/Frase');

const app = express();
const PORT = process.env.PORT || 4000;

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Servir imágenes
const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

// Obtener lista de imágenes
app.get('/api/images', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:fotos') // Usa tu carpeta de Cloudinary si subes allí
      .sort_by('public_id','desc')
      .max_results(200)
      .execute();

    const imagePublicIds = result.resources.map(img => img.public_id);
    res.json(imagePublicIds); // devolverá array tipo: ["galeria/foto1", "galeria/foto2"]
  } catch (err) {
    console.error('Error al obtener imágenes de Cloudinary:', err);
    res.status(500).json({ error: 'No se pudo obtener imágenes' });
  }
});


// Obtener frases por imagen
app.get('/api/frases/:id', async (req, res) => {
  try {
    const frases = await Frase.find({ imagenId: req.params.id }).sort({ fecha: -1 });
    res.json(frases);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener frases' });
  }
});

// Añadir frase
app.post('/api/frases', async (req, res) => {
  const { imageId, frase } = req.body;
  if (!imageId || !frase) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const nuevaFrase = new Frase({ imagenId: imageId, texto: frase });
    await nuevaFrase.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar frase' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
