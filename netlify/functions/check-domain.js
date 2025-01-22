const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain; // Obtener el dominio desde la query string
  const apiKey = process.env.API_KEY;  // Tu API Key de WhoisXMLAPI o la que estés utilizando
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
    // Consulta a la API WHOIS
    const response = await axios.get(`https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=${domain}&apiKey=${apiKey}&outputFormat=JSON`);
    
    // Analiza la respuesta y proporciona los datos necesarios
    if (response.data && response.data.WhoisRecord) {
      const isAvailable = response.data.WhoisRecord.domainName === null; // El dominio es disponible si WhoisRecord no contiene datos
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: isAvailable ? 'available' : 'registered',
          domain: domain,
          whoisData: response.data.WhoisRecord,
        }),
      };
    }

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Dominio no encontrado o error en la consulta.' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error al consultar Whois.' }),
    };
  }
};


