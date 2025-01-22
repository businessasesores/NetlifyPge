const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain; // Obtener el dominio de la solicitud
  const authToken = process.env.AUTH_TOKEN; // Token secreto almacenado en Netlify como variable de entorno
  const apiKey = process.env.API_KEY; // Clave API para la API de Whois almacenada en Netlify como variable de entorno
  const allowedOrigin = 'https://businessasesores.web.app'; // Frontend autorizado (tu dominio de Firebase Hosting)
  const origin = event.headers.origin; // Origen de la solicitud
  const incomingAuthHeader = event.headers['authorization']; // Leer el encabezado Authorization

  // 1. Verificar que el origen de la solicitud es permitido
  if (origin !== allowedOrigin) {
    console.log('Origen no permitido: ', origin);
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  // 2. Verificar que el token de autenticación es válido
  if (!incomingAuthHeader || incomingAuthHeader !== `Bearer ${authToken}`) {
    console.log('Token inválido o ausente');
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Token inválido o ausente.' }),
    };
  }

  // 3. Validar que el parámetro 'domain' esté presente
  if (!domain) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      body: JSON.stringify({ error: 'Falta el parámetro domain en la solicitud.' }),
    };
  }

  // 4. Validar el formato del dominio
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
    // 5. Realizar la solicitud a la API externa (Apilayer o WhoisXML)
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { 'apikey': apiKey }, // Usar la API Key configurada en las variables de entorno de Netlify
    });

    // 6. Verificar la respuesta y devolver los datos
    if (response.status === 200 && response.data) {
      console.log('Respuesta de la API:', response.data);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        },
        body: JSON.stringify(response.data), // Devolver los datos de Whois (registrado/no registrado)
      };
    } else {
      console.error('Error en la respuesta de la API:', response.status, response.data);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        body: JSON.stringify({ error: 'Error al obtener datos del dominio desde la API externa.' }),
      };
    }
  } catch (error) {
    console.error('Error en la solicitud a la API de Whois:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: JSON.stringify({ error: 'Error interno al procesar la solicitud del dominio.' }),
    };
  }
};
