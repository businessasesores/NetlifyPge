const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY;

  // CORS validation
  const origin = event.headers.get('Origin');
  const allowedOrigin = 'https://buscador.hostweb.workers.dev';

  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
    };
  }

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

    if (response.status === 200) {
      // Verificar el estado del dominio
      if (response.data.status === 'registered') {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está registrado' })
        };
      } else if (response.data.status === 'available') {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está disponible' })
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Respuesta de la API no válida' })
        };
      }
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};