export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, address, phone, payment, quantity } = request.body || {};

    if (!name || !email || !address || !phone) {
      return response.status(400).json({ error: 'All fields are required.' });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return response.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const orderId = 'SNFL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const qty = parseInt(quantity, 10) || 1;
    const total = 20 * qty;

    return response.status(200).json({
      ok: true,
      orderId,
      message: `Thanks ${name}! Your order ${orderId} for ${qty} Sniffle${qty > 1 ? 's' : ''} + free 150g treat pack has been booked (total $${total}).`,
    });
  } catch (err) {
    return response.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
