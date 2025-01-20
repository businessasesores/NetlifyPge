const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2)); // Log the event object for debugging

  // Check for missing or invalid event structure
  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' }),
    };
  }

  // Extract authorization header (assuming Bearer token format)
  const authorization = event.request.headers.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Extract the token from the authorization header
  const token = authorization.split(' ')[1];

  // Verify the token against the environment variable (assuming Netlify)
  const expectedToken = process.env.AUTH_TOKEN;
  if (token !== expectedToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Extract the domain from the query string parameters
  const domain = event.queryStringParameters.domain;

  // Optional domain validation (add logic here if needed)

  // Make the request to the Whois API using Axios
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error verifying domain' }),
    };
  }
};