const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractConcepts = async (
  chapterText
) => {
  try {
    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Analyze this chapter and extract all important concepts.

Return ONLY valid JSON.

Example:

[
  "Concept 1",
  "Concept 2",
  "Concept 3"
]

Chapter:
${chapterText}
`,
      });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.log(
      "Concept Extraction Error:",
      error.message
    );

    return [];
  }
};

module.exports = {
  extractConcepts,
};