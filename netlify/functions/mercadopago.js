const mercadopago = require('mercadopago');

exports.handler = async (event, context) => {
  try {
    console.log("Intentando configurar Mercado Pago...");

    // Configura las credenciales de Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });

    console.log("Mercado Pago configurado.");

    // Obtén los datos del pago desde la solicitud
    const { body } = event;

    // Verifica si el cuerpo de la solicitud existe
    if (!body) {
      console.error("Error: No se recibieron datos de pago.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se recibieron datos de pago." }),
      };
    }

    const paymentData = JSON.parse(body);

    console.log("Datos de pago recibidos:", paymentData);

    // Crea el pago en Mercado Pago
    const payment = await mercadopago.payments.create(paymentData);

    console.log("Respuesta de Mercado Pago:", payment);

    return {
      statusCode: 200,
      body: JSON.stringify(payment),
    };
  } catch (error) {
    console.error("Error en la función de Mercado Pago:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error }),
    };
  }
};