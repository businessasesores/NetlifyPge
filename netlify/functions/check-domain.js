const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2));

   const authorization = event.request.headers.get('Authorization'); // Modificado
   const expectedToken = process.env.AUTH_TOKEN;

  if (!event || !event.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' })
    };
  }

  // 2. Obtener el dominio de la solicitud
  const domain = event.queryStringParameters.domain;

  // 3. Validación del dominio (opcional)
  // Puedes agregar aquí validaciones más robustas si es necesario
  // Por ejemplo, para asegurar que el dominio tenga un formato válido

  // 4. Realizar la solicitud a la API de Whois
  try {
    const apiKey = process.env.API_KEY;
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
    console.error('Error al verificar el dominio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio' })
    };
  }
};