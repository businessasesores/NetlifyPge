const axios = require('axios');  // Usamos axios para hacer la solicitud

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;  // Obtener el dominio desde la URL de la solicitud
  const apiKey = process.env.API_KEY;  // Obtener la API Key desde las variables de entorno de Netlify

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro "domain" es obligatorio.' }),
    };
  }

  try {
    // Realizamos la solicitud a la API de Whois usando la API Key
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,  // Usamos la API Key configurada en las variables de entorno
      },
    });

    if (response.data) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Consulta Whois exitosa.',
          data: response.data,  // Devuelve los datos completos de la API
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No se encontraron resultados para el dominio.' }),
      };
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error en la consulta de Whois.',
        details: error.message,  // Devuelve los detalles del error si ocurre
      }),
    };
  }
};


