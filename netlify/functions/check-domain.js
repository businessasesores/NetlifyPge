
const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
   const origin = event.request?.headers?.get('Origin'); // Usamos el operador de encadenamiento opcional para evitar errores si headers es undefined
    const allowedOrigin = 'https://buscador.hostweb.workers.dev';


  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000
    });

      // CORS validation (optional, assuming CORS is configured on Netlify)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' }),
      };
    }

    if (response.status === 200) {
  // Suponiendo que la propiedad que indica el estado del dominio es "status"
  if (response.data.status === 'registered') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'El dominio está registrado' })
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'El dominio no está disponible o no se encontró información' })
    };
  }
} else {
  console.error('Error en la API de Whois:', response.data);
  return {
    statusCode: response.status,
    body: JSON.stringify({ error: `Error al obtener datos de Whois: ${response.statusText}` })
  };
}
};