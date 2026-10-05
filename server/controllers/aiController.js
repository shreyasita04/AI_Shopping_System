const { GoogleGenAI } = require("@google/genai");
const Product = require("../models/Product");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Please provide a message.",
      });
    }

    const products = await Product.find().lean();

    const productInformation = products
      .map(
        (product) =>
          `Name: ${product.name}, Price: ₹${product.price}, Description: ${
            product.description || "No description"
          }, Rating: ${product.rating || 0}`
      )
      .join("\n");

    const prompt = `
You are an AI shopping assistant for an e-commerce website called AI Shopping.

Your job is to help customers find products from the available product catalog.

IMPORTANT RULES:
- Recommend products ONLY from the product catalog provided below.
- Never invent products.
- Never invent prices.
- If no product matches the customer's request, say that no matching product was found.
- Mention the product name and price when recommending a product.
- Be helpful and concise.
- If the customer asks something unrelated to shopping, politely bring the conversation back to shopping.

AVAILABLE PRODUCTS:
${productInformation}

CUSTOMER MESSAGE:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const aiMessage = response.text;

    const recommendedProducts = products.filter((product) =>
      aiMessage.toLowerCase().includes(product.name.toLowerCase())
    );

    res.status(200).json({
      message: aiMessage,
      products: recommendedProducts,
    });
  } catch (error) {
    console.error("Gemini AI error:", error);

    res.status(500).json({
      message: "Failed to get AI response.",
      error: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};