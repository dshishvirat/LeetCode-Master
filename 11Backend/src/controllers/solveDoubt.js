const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  const { messages, title, description, testCases, startCode } = req.body;

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages,
      config: {
        systemInstruction: `
You are a DSA tutor.
Problem: ${title}
Description: ${description}
Examples: ${JSON.stringify(testCases)}
Start Code: ${JSON.stringify(startCode)}
        `,
      },
    });

    return res.status(200).json({
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI quota exceeded. Please wait or upgrade plan.",
      });
    }

    return res.status(500).json({
      message: "AI service failed. Try again later.",
    });
  }
};

module.exports = solveDoubt;
