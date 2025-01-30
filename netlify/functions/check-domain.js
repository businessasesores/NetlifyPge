const { getWhois } = require('./getWhois');  // Importa la función de WHOIS
const { registerWithGoDaddy } = require('./registerWithGoDaddy');  // Importa la función para registrar el dominio

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');  // Obtiene el dominio de los parámetros
    const secretHeader = request.headers.get('x-worker-secret');  // Obtiene el header personalizado
    const expectedSecret = env.WORKER_SECRET; // El secreto esperado
    const apiKey = env.API_KEY; // API Key para Apilayer
    const register = url.searchParams.get('register'); // Parámetro para registrar el dominio

    // Validar el header del secreto
    if (secretHeader !== expectedSecret) {
      return new Response(JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }), { status: 403 });
    }

    // Validar que el dominio esté presente
    if (!domain) {
      return new Response(JSON.stringify({ message: 'Falta el parámetro "domain".' }), { status: 400 });
    }

    try {
      let response;

      // Si se activa el registro de dominio
      if (register === 'true') {
        response = await registerWithGoDaddy(domain);  // Llamar a la función de registro
        return new Response(JSON.stringify(response), { status: 200 });
      }

      // Si no, consultamos el WHOIS con la API de Apilayer
      response = await getWhois(domain, apiKey);  // Llamar a la función de WHOIS
      return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
      return new Response(JSON.stringify({
        message: 'Error al procesar la solicitud.',
        error: error.message,
      }), { status: 500 });
    }
  }
};
