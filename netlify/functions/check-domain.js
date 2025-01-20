const axios = require('axios');

exports.handler = async (event) => {
  console.log('Objeto de evento:', JSON.stringify(event, null, 2));

  try {
    // Validamos que la solicitud tenga el parámetro 'domain'
    if (!event || !event.queryStringParameters || !event.queryStringParameters.domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Solicitud inválida: Falta el parámetro "domain".' })
      };
    }

    // Extraemos el dominio de la solicitud y verificamos el origen
    const { domain, origin } = event.queryStringParameters;
    const allowedOrigin = 'https://buscador.hostweb.workers.dev';

    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
      };
    }

    // Construimos la URL de la API de Whois y realizamos la solicitud
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.apilayer.com/whois/query?domain=${domain}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          apikey: apiKey
        },
        timeout: 5000
      });

      // Si la solicitud a la API fue exitosa, retornamos los datos
      if (response.status === 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Consulta a Whois realizada con éxito',
            data: response.data
          })
        };
      } else {
        // Manejamos errores de la API de Whois
        console.error('Error en la API de Whois:', response.data);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
        };
      }
    } catch (error) {
      // Manejamos errores generales
      console.error('Error al realizar la solicitud:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error interno del servidor' })
      };
    }
  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
