const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain; // Obtener el dominio desde la query string
  const apiKey = process.env.API_KEY;  // Tu API Key para hacer la consulta a la API de Whois
  const allowedOrigin = 'https://businessasesores.web.app';  // El origen permitido para solicitudes

  // Verificamos que la solicitud provenga de un origen permitido (tu frontend)
  const origin = event.headers.origin;
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,  // Forbidden si el origen no está permitido
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  // Aseguramos que el dominio se haya proporcionado en la consulta
  if (!domain) {
    return {
      statusCode: 400,  // Bad request si no se proporciona el dominio
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'El parámetro "domain" es obligatorio.' }),
    };
  }

  try {
    // Realizamos la consulta a la API de Whois para verificar el dominio
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Si la respuesta es positiva (dominio registrado)
    if (response.data.status === 'registered') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result: 'registered', domain: domain }),
      };
    }
    
    // Si el dominio está disponible (no registrado)
    if (response.data.status === 'available') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result: 'available', domain: domain }),
      };
    }

    // Si no se pudo determinar el estado, regresamos un error
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'No se pudo determinar el estado del dominio.' }),
    };

  } catch (error) {
    // En caso de un error con la consulta (error general)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error en la consulta de Whois. El dominio no fue encontrado o hubo un problema.' }),
    };
  }
};

