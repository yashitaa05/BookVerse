const {
  GoogleGenAI,
} = require("@google/genai");

const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });

const askQuestion =
  async (
    chapterContent,
    question
  ) => {
    const prompt = `
You are a personal teacher.

Answer ONLY from the chapter content.

If answer does not exist in chapter,
say:

"This information is not present in the chapter."

Chapter:

${chapterContent}

Question:

${question}
`;

    const response =
      await ai.models.generateContent({
        model:
          "gemini-2.5-flash",

        contents: prompt,
      });

    return response.text;
  };

module.exports = {
  askQuestion,
};