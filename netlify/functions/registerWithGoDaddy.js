const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain;
  const secretHeader = event.headers['x-worker-secret']; // Obtenemos el header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // El secreto esperado
  const apiKey = process.env.GODADDY_API_KEY;
  const apiSecret = process.env.GODADDY_API_SECRET;

 
  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Debe proporcionar un dominio' }),
    };
  }

  try {
    const response = await axios.post(
      `https://api.godaddy.com/v1/domains/purchase`,
      {
        domain: domain,
        consent: {
          agreedAt: new Date().toISOString(),
          agreedBy: "127.0.0.1",
          agreementKeys: ["DNRA"],
        },
        contactAdmin: {
          nameFirst: "Bussines",
          nameLast: "asesores",
          email: "gaposetra@gmail.com",
          phone: "+573022114662",
          country: "CO",
        },
      },
      {
        headers: {
          "Authorization": `sso-key ${apiKey}:${apiSecret}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: "Error al registrar el dominio en GoDaddy.",
        error: error.response?.data || error.message,
      }),
    };
  }
};
