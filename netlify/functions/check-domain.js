const axios = require('axios');

exports.handler = async (event) => {
  console.log('Objeto de evento:', JSON.stringify(event, null, 2));

  // Verificación del origen de la solicitud
  const origen = event.request.headers.get('Origin');
  const origenPermitido = 'https://buscador.hostweb.workers.dev';
  if (origen !== origenPermitido) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Prohibido: Origen de la solicitud no permitido' }),
    };
  }

  // Extraer el dominio de los parámetros de la cadena de consulta
  const dominio = event.queryStringParameters.domain;

  // Realizar la solicitud a la API de Whois usando Axios
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

    // Analizar la respuesta de la API para determinar la disponibilidad
    const estaDisponible = !response.data.available;

    return {
      statusCode: 200,
      body: JSON.stringify({ disponible: estaDisponible })
    };
  } catch (error) {
    console.error('Error al verificar el dominio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio: ' + error.message })
    };
  }
};