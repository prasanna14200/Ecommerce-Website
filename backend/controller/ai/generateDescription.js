const axios = require('axios');

const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'google/flan-t5-small';
const HUGGINGFACE_API_URL = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const buildProductText = (details) => {
  const parts = [];
  if (details.productName) parts.push(`Product: ${details.productName}`);
  if (details.brandName) parts.push(`Brand: ${details.brandName}`);
  if (details.category) parts.push(`Category: ${details.category}`);
  if (details.price) parts.push(`Price: ${details.price}`);
  if (details.sellingPrice) parts.push(`Selling price: ${details.sellingPrice}`);
  if (details.features) parts.push(`Features: ${details.features}`);
  if (details.description) parts.push(`Details: ${details.description}`);
  if (details.additionalInfo) parts.push(`Additional info: ${details.additionalInfo}`);
  return parts.join('\n');
};

const createPrompt = (detailsText) =>
  `Write a short, SEO-friendly eCommerce product description using the details below. Use engaging language and highlight the product benefits. Keep the description concise and easy to read.\n\n${detailsText}\n\nDescription:`;

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

const generateDescriptionController = async (req, res) => {
  try {
    const {
      productName,
      brandName,
      category,
      price,
      sellingPrice,
      features,
      description,
      additionalInfo,
      productDetails,
    } = req.body;

    if (!productDetails && !productName && !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product details or a product description.',
      });
    }

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          'HUGGINGFACE_API_KEY is not configured. Set HUGGINGFACE_API_KEY in backend environment variables.',
      });
    }

    const detailsText = productDetails || buildProductText({
      productName,
      brandName,
      category,
      price,
      sellingPrice,
      features,
      description,
      additionalInfo,
    });

    const prompt = createPrompt(detailsText);
    const generated = await callHuggingFace(prompt);

    if (!generated) {
      return res.status(502).json({ success: false, message: 'Failed to get a response from the AI service.' });
    }

    return res.json({ success: true, description: generated.toString().trim() });
  } catch (error) {
    console.error('Generate Description API error:', error?.response?.data || error.message || error);
    return res.status(500).json({
      success: false,
      message: 'AI description service failed. Please check your Hugging Face configuration.',
    });
  }
};

module.exports = generateDescriptionController;
