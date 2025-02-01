const path = require('path');

module.exports = {
  target: 'node', // Importante para Netlify Functions
  entry: './netlify/functions/mercadopago.js', // Ruta a tu función
  output: {
    filename: 'mercadopago.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'netlify/functions'), // Carpeta de salida
    libraryTarget: 'commonjs2', // Importante para Netlify Functions
  },
  // Esta sección es crucial para incluir las dependencias
  externals: {
    'mercadopago': 'commonjs mercadopago', // Incluye mercadopago
  },
};