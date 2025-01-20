
const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
   const origin = event.request?.headers?.get('Origin'); // Usamos el operador de encadenamiento opcional para evitar errores si headers es undefined
    const allowedOrigin = '//buscador.hostweb.workers.dev';


  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

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

