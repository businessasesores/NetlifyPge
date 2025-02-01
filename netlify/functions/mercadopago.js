const mercadopago = require('mercadopago'); // Importación (CommonJS)

exports.handler = async (event, context) => {
  try {
    console.log("Intentando configurar Mercado Pago..."); // Log para depuración

    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });

    console.log("Mercado Pago configurado."); // Log para depuración

    const { body } = event;
    const paymentData = JSON.parse(body);

    console.log("Datos de pago recibidos:", paymentData); // Log para depuración

    const payment = await mercadopago.payments.create(paymentData);

    console.log("Respuesta de Mercado Pago:", payment); // Log para depuración

    return {
      statusCode: 200,
      body: JSON.stringify(payment),
    };
  } catch (error) {
    console.error("Error en la función de Mercado Pago:", error); // Log detallado del error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error }),
    };
  }
};