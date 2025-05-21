const mongoose = require('mongoose');

const fraseSchema = new mongoose.Schema({
  imagenId: String,       // ID o nombre de la imagen
  texto: String,          // Frase escrita por el usuario
  fecha: { type: Date, default: Date.now }  // Fecha automática
});

module.exports = mongoose.model('Frase', fraseSchema);
