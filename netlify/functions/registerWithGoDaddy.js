const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain; // Dominio a registrar
  const secretHeader = event.headers['x-worker-secret']; // Secreto personalizado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto esperado
  const apiKey = process.env.GODADDY_API_KEY; // API Key de GoDaddy
  const apiSecret = process.env.GODADDY_API_SECRET; // API Secret de GoDaddy

  // Validar el secreto
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Falta el parámetro "domain".' }),
    };
  }

  try {
    // Llamar a la API de GoDaddy para registrar el dominio
    const response = await axios.post(
      `https://api.godaddy.com/v1/domains/purchase`,
      {
        domain,
        consent: {
          agreedAt: new Date().toISOString(),
          agreedBy: "127.0.0.1",
          agreementKeys: ["DNRA"],
        },
      },
      {
        headers: {
          Authorization: `sso-key ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error al registrar el dominio en GoDaddy.',
        error: error.message,
      }),
    };
  }
};
