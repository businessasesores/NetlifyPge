 const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtain API key from an environment variable

  // Declare and assign the allowedOrigin variable
  const allowedOrigin = 'https://businessasesores.web.app'; 

  // Access headers using the new event structure
  const origin = event.headers['origin']; 

  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
    };
  }

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
      timeout: 5000, // Set a timeout for the API request
    });

  if (response.status === 200) {
  // Ajusta esta parte según la estructura de la respuesta de tu API de Whois
  if (response.data.status === 'registered') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'El dominio está registrado' })
    };
  } else (message) {
    return  {
      statusCode: 200,
      body: JSON.stringify({ message: 'El dominio está disponible' })
    };
  }
} else {
  console.error('Error en la API de Whois:', response.data);
  return {
    statusCode: response.status,
    body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
  };
}