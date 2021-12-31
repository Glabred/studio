const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const products = require('./data/stripe-products-ids.json')
const { responseHeaders, isProduction } = require('./helpers/shared.js')

const spaceProduct = isProduction ? products.live.space : products.test.space
const cleaningProduct = isProduction ? products.live.cleaning : products.test.cleaning

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Successful preflight call.' }),
    }
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body)

    const quantity = body.quantity || 1
    const customer = body.customer
    const start = body.startTime
    const end = body.endTime
    const bookingId = body.bookingId

    if (!customer || !bookingId) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'Body is missing [customer] or [bookingId] attributes.' }),
      }
    }

    const data = {
      customer,
      metadata: {
        start_time: start,
        end_time: end,
        booking_id: bookingId,
      },
      line_items: [
        {
          price: spaceProduct.price,
          quantity,
        },
        {
          price: cleaningProduct.price,
          quantity: 1,
        },
      ],
      phone_number_collection: { enabled: true },
      mode: 'payment',
      success_url: `${process.env.URL}/booking-success.html`,
      cancel_url: `${process.env.URL}/booking-cancel.html`,
      expires_at: Math.floor(Date.now() / 1000) + 3650, // 1 hour(ish) from event
    }

    const session = await stripe.checkout.sessions.create(data)

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        session,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      }),
    }
  }
}