exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;

  if (!domain) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'El parámetro "domain" es obligatorio.' }),
    };
  }

  try {
    // Lógica para verificar el dominio
    const result = await verificarDominio(domain); // Implementa esta función

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Permitir todas las solicitudes
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error interno del servidor.' }),
    };
  }
};

// Implementa la lógica para verificar el dominio
async function verificarDominio(domain) {
  // Aquí puedes agregar la lógica de verificación de dominio.
  // Por ejemplo, usando un servicio de WHOIS.
  return { result: 'available' }; // Ejemplo de respuesta
}

