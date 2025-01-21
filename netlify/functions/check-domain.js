const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain; // Manejar caso donde domain no esté definido
  const authToken = process.env.AUTH_TOKEN; // Clave secreta para autenticar con el Worker
  const apiKey = process.env.API_KEY; // Clave secreta para la API de Apilayer
  const allowedOrigin = 'https://businessasesores.web.app'; // Origen permitido
  const origin = event.headers.origin;
  const incomingAuthHeader = event.headers['authorization']; // Leer el encabezado Authorization

  console.log('Origin:', origin);
  console.log('Domain:', domain);

  // Verificar que el origen sea permitido
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  // Verificar que el encabezado Authorization esté presente y sea válido
  if (!incomingAuthHeader || incomingAuthHeader !== `Bearer ${authToken}`) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Token inválido o ausente.' }),
    };
  }

  // Validar que el parámetro domain exista
  if (!domain) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Falta el parámetro domain en la solicitud.' }),
    };
  }

  // Validar el formato del dominio
  const domainRegex = /^[a-z0-9]+(-*[a-z0-9]+)*(\.([a-z0-9]+(-*[a-z0-9]+)*))*$/i;
  if (!domainRegex.test(domain)) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Formato de dominio inválido.' }),
    };
  }

  try {
    // Solicitar información del dominio a la API de Apilayer
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { 'apikey': apiKey }, // Usar la clave secreta para la API de Apilayer
    });

    if (response.status === 200 && response.data) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        body: JSON.stringify(response.data),
      };
    } else {
      console.error('Error en la respuesta de Apilayer:', response.status, response.data);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        body: JSON.stringify({ error: 'Error al obtener datos del dominio desde la API externa.' }),
      };
    }
  } catch (error) {
    console.error('Error en la solicitud a Apilayer:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Error interno al procesar la solicitud del dominio.' }),
    };
  }
};
