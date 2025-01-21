const axios = require('axios');

exports.handler = async (event) => {
  // Obtener el dominio de los parámetros de la query
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY;
  const allowedOrigin = 'https://businessasesores.web.app';  // Origen permitido
  const origin = event.headers.origin;

  // Log de la solicitud para depuración
  console.log('Origin:', origin);
  console.log('Domain:', domain);

  // Verificar que el origen de la solicitud sea el permitido
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
    };
  }

  // Validar que el formato del dominio sea correcto
  const domainRegex = /^[a-z0-9]+(-*[a-z0-9]+)*(\.([a-z0-9]+(-*[a-z0-9]+)*))*$/i;
  if (!domainRegex.test(domain)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Formato de dominio inválido' })
    };
  }

  try {
    // Hacer la solicitud a la API de Whois para obtener la información del dominio
    console.log('Haciendo solicitud a la API de Whois para:', domain);
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { 'apikey': apiKey }  // Pasar la API Key en el header
    });

    // Verificar la respuesta de la API
    if (response.status === 200 && response.data && typeof response.data.status === 'string') {
      return {
        statusCode: 200,
        body: JSON.stringify(response.data)  // Retornar los datos del dominio
      };
    } else {
      console.error('Error status:', response.status);
      console.error('Error response:', response.data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al obtener datos del dominio.' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar la solicitud del dominio.' })
    };
  }
};
