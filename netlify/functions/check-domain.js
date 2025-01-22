const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY;

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El parámetro "domain" es obligatorio.' }),
    };
  }

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/check?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error en el servidor o en la consulta.' }),
    };
  }
};
