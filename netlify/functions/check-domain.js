const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { domain } = event.queryStringParameters;
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.apilayer.com/whois/query?domain=${domain}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar la solicitud' })
    };
  }
};
