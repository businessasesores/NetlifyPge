const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const secretHeader = event.headers['x-worker-secret'];
  const expectedSecret = process.env.WORKER_SECRET;
  const apiKey = process.env.API_KEY;
  const apiKeyNameCom = process.env.API_KEY_NAMECOM;

  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    const nameComPromise = axios.post(
      'https://api.name.com/v4/domains:check',
      { domainNames: [domain] },
      { headers: { Authorization: `Bearer ${apiKeyNameCom}` } }
    );

    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: nameComResponse.data.results[0].available ? 'available' : 'unavailable',
        apilayer: apilayerResponse.data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando la solicitud.', error: error.message }),
    };
  }
};
