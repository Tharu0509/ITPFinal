const dotenv = require("dotenv");
const OpenAI = require("openai");
const { generateCropPrompt } = require("../utils/promptGenerator.js");
const { getCropImage } = require("./imageService.js");

dotenv.config({ debug: false });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getCropInfo(cropName) {
  const prompt = generateCropPrompt(cropName);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content;

    let cropData;
    try {
      cropData = JSON.parse(content);
    } catch (err) {
      console.error("JSON Parse Error:", err.message, "Content:", content);
      throw new Error("Invalid JSON response from OpenAI");
    }

    cropData.image_url = await getCropImage(cropName);
    return cropData;
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    throw new Error("Failed to generate crop info");
  }
}

module.exports = { getCropInfo };
