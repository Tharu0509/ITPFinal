function generateCropPrompt(cropName) {
  return `
You are a farming assistant AI. A user entered the crop: "${cropName}".

Return ONLY a valid JSON object. Do NOT include triple backticks, explanation, or markdown formatting. Just pure JSON like:

{
  "crop": "string",
  "water_requirement": "string",
  "soil_type": "string",
  "ideal_weather": "string",
  "soil_moisture": "string",
  "growth_stages": ["string", "..."]
}
`.trim();
}

module.exports = { generateCropPrompt };
