// webpack.config.js
const path = require('path');

module.exports = {
  target: 'node', // Importante para Netlify Functions
  entry: './netlify/functions/mercadopago.js', // La ruta a tu función
  output: {
    filename: 'mercadopago.js', // El nombre del archivo de salida
    path: path.resolve(__dirname, '.netlify/functions'), // La carpeta de salida para Netlify
    libraryTarget: 'commonjs2', //  ¡CRUCIAL!  Para compatibilidad con Netlify Functions
  },
  // No necesitas plugins ni loaders especiales para axios y mercadopago
};