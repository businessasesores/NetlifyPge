const axios = require('axios');

exports.handler = async (event) => {
  // 1. Verify Authorization (Security Improvement)
  const authorization = event.headers.get('Authorization');
  const expectedToken = process.env.AUTH_TOKEN; // Access token from environment variable

  if (!authorization || authorization !== `Bearer ${expectedToken}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  // 2. Retrieve Domain Name from Query String
  const domain = event.queryStringParameters.domain;

  // 3. Validate Domain Name (Optional)
  // You can add basic validation here to ensure a valid domain name format

  // 4. Retrieve API Key from Environment Variable (Security Improvement)
  const apiKey = process.env.API_KEY;

  // 5. Make Whois API Request
  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio' })
    };
  }
};
