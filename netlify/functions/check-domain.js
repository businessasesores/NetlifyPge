const axios = require('axios');

exports.handler = async (event) => {
  // Log the event object for debugging (optional)
  console.log('Event Object:', JSON.stringify(event, null, 2));

  // Validate required parameters
  if (!validateRequest(event)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Solicitud inválida: Falta el parámetro "domain".' })
    };
  }

  // Extract domain and origin
  const { domain, origin } = event.queryStringParameters;

  // Check allowed origin
  if (!isAllowedOrigin(origin)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' }),
    };
  }

  try {
    // Make API request with timeout
    const response = await axios.get(buildWhoisUrl(domain), {
      headers: { 'apikey': process.env.API_KEY },
      timeout: 5000
    });

    if (response.status === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Consulta a Whois realizada con éxito',
          data: response.data
        })
      };
    } else {
      console.error('Error en la API de Whois:', response.data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
      };
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};

// Helper functions for cleaner code
function validateRequest(event) {
  return event && event.queryStringParameters && event.queryStringParameters.domain;
}

function isAllowedOrigin(origin) {
  return origin === 'https://buscador.hostweb.workers.dev';
}

function buildWhoisUrl(domain) {
  return `https://api.apilayer.com/whois/query?domain=${domain}`;
}
