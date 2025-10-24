const { pixabayClient } = require("./pixabayClient.js");

async function getCropImage(cropName) {
  const refinedQuery = `${cropName} crop plant`;
  console.log(refinedQuery);

  try {
    const response = await pixabayClient.get("/", {
      params: { q: refinedQuery },
    });

    const images = response.data?.hits || [];
    return images.length > 0
      ? images[0].webformatURL
      : "https://placehold.co/400x300?text=No+Image&font=roboto&font_size=24";
  } catch (err) {
    console.error("Pixabay error:", err.message);
    return "https://placehold.co/400x300?text=No+Image&font=roboto&font_size=24";
  }
}

module.exports = { getCropImage };
