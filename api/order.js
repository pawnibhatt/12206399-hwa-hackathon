export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, address, quantity } = request.body || {};

    if (!name || !email || !address) {
      return response.status(400).json({ error: 'Name, email, and address are required.' });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return response.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const orderId = 'SNFL-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    // In a real integration this would forward to a payment/provider.
    // Here we acknowledge receipt and return a confirmation.
    return response.status(200).json({
      ok: true,
      orderId,
      message: `Thanks ${name}! Your order for ${quantity || 1} Sniffle${quantity > 1 ? 's' : ''} has been received.`,
    });
  } catch (err) {
    return response.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
