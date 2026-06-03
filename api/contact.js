export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, interest, message } = request.body || {};

    if (!name || name.trim().length < 2) {
      return response.status(400).json({
        error: 'Please enter your name.'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({
        error: 'Please enter a valid email address.'
      });
    }

    if (!interest) {
      return response.status(400).json({
        error: 'Please select an area of interest.'
      });
    }

    if (!message || message.trim().length < 10) {
      return response.status(400).json({
        error: 'Please enter a longer message.'
      });
    }

    const submission = {
      name: name.trim(),
      email: email.trim(),
      interest: interest.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString()
    };

    console.log('New generosity contact form submission:', submission);

    return response.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return response.status(500).json({
      error: 'Unable to send message right now.'
    });
  }
}
