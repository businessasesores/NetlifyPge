const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY;

  // CORS validation
  const origin = event.headers.get('Origin');
  const allowedOrigin = 'https://businessasesores.web.app';

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
      // Assuming the API returns a "status" property indicating registration
      if (response.data.status === 'registered') {
        return {
          statusCode: 200,
          body: JSON.stringify({
            domain: response.data.domain,
            status: 'registrado',
            // Otras propiedades relevantes
          })
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({
            domain: response.data.domain,
            status: 'disponible'
          })
        };
      }
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};