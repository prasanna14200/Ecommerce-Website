const axios = require('axios');

const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'google/flan-t5-small';
const HUGGINGFACE_API_URL = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const createPrompt = (question) => `You are an eCommerce customer support assistant. Answer clearly and politely about products, orders, delivery, returns, refunds, shipping, cancellations, and payments.
User: ${question}
Assistant:`;

const callHuggingFace = async (prompt) => {
  const response = await axios.post(
    HUGGINGFACE_API_URL,
    {
      inputs: prompt,
      options: {
        wait_for_model: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  if (response?.data) {
    const data = response.data;
    if (typeof data === 'string') {
      return data;
    }
    return data.generated_text || data[0]?.generated_text || JSON.stringify(data);
  }

  return null;
};

const chatController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a question.' });
    }

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          'HUGGINGFACE_API_KEY is not configured. Set HUGGINGFACE_API_KEY in backend environment variables.',
      });
    }

    const prompt = createPrompt(question);
    const answer = await callHuggingFace(prompt);

    if (!answer) {
      return res.status(502).json({ success: false, message: 'Failed to get a response from the AI service.' });
    }

    return res.json({ success: true, answer: answer.toString().trim() });
  } catch (error) {
    console.error('Chat API error:', error?.response?.data || error.message || error);
    return res.status(500).json({
      success: false,
      message: 'AI chat service failed. Please check your Hugging Face configuration.',
    });
  }
};

module.exports = chatController;
