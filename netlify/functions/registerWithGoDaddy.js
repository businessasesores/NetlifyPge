const axios = require('axios');

// Función para registrar el dominio con GoDaddy
async function registerWithGoDaddy(domain) {
  const apiKeyGoDaddy = process.env.GODADDY_API_KEY;
  const apiSecretGoDaddy = process.env.GODADDY_API_SECRET;

  try {
    const registrationResponse = await axios.post(
      'https://api.godaddy.com/v1/domains/purchase', 
      {
        domain: domain,
        consent: {
          agreementKeys: ['DNRA'], // Asegúrate de usar los términos correctos
          agreedAt: new Date().toISOString(),
          agreedBy: 'user_ip_address', // Sustituye con la IP o identificador válido
        },
      },
      {
        headers: {
          'Authorization': `sso-key ${apiKeyGoDaddy}:${apiSecretGoDaddy}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (registrationResponse.status !== 200) {
      throw new Error(`Error al registrar dominio en GoDaddy: ${registrationResponse.statusText}`);
    }

    return registrationResponse.data;
  } catch (error) {
    throw new Error(`Error al registrar el dominio con GoDaddy: ${error.message}`);
  }
}

module.exports = { registerWithGoDaddy };  // Exporta la función para usarla en check-domain.js
