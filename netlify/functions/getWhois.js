const axios = require('axios');

// Función para consultar el WHOIS con Apilayer
async function getWhois(domain, apiKey) {
  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Error al consultar WHOIS: ${error.message}`);
  }
}

module.exports = { getWhois };  // Exporta la función para usarla en check-domain.js
