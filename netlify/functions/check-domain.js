const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtain API key from an environment variable

  
const allowedOrigins = 'https://businessasesores.web.app', 'https://buscador.hostweb.workers.dev/'; // Puedes agregar más orígenes si es necesario
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

    // Check the response status code for errors
    if (response.status !== 200) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois' }),
      };
    }

    // Determine domain availability based on API response structure
    let domainAvailability;
    if (response.data.status === 'registered') {
      domainAvailability = 'El dominio está registrado';
    } else if (response.data.available) { // Assuming 'available' property exists
      domainAvailability = 'El dominio está disponible';
    } else {
      // Handle cases where availability is unclear or the response structure is different
      domainAvailability = 'La disponibilidad del dominio no se pudo determinar.';
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: domainAvailability }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};