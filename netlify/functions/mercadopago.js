const mercadopago = require('mercadopago');

exports.handler = async (event, context) => {
  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
  });

  const { body } = event;
  const paymentData = JSON.parse(body);

  try {
    const payment = await mercadopago.payments.create(paymentData);

    return {
      statusCode: 200,
      body: JSON.stringify(payment)
    };
  } catch (error) {
    console.error("Error en la función de Mercado Pago:", error); // Imprime el error completo en la consola
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error }) // Devuelve un mensaje de error más detallado
    };
  }
};