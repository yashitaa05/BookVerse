const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const difficultyPrompts = {
  child:
    "Explain for a 10 year old child using very simple language and examples.",

  teen:
    "Explain for a teenager using relatable examples.",

  college:
    "Explain for a college student with sufficient detail.",

  expert:
    "Explain deeply and professionally without simplifying concepts.",
};

const generateConversation = async (
  chapterText,
  mode = "friendly",
  language = "English",
  difficulty = "college"
) => {
  let prompt = "";

  const difficultyGuide =
    difficultyPrompts[difficulty] ||
    difficultyPrompts.college;

  switch (mode) {
    case "teacher":
      prompt = `
You are an expert teacher.

Language: ${language}

Difficulty:
${difficultyGuide}

Rules:
- Do not heavily summarize
- Preserve important information
- Explain concepts step by step
- Give examples
- Keep explanations engaging

Chapter:
${chapterText}
`;
      break;

    case "podcast":
      prompt = `
Convert this chapter into a podcast discussion.

Language: ${language}

Difficulty:
${difficultyGuide}

Characters:
Host
Expert

Rules:
- Natural conversation
- Cover important concepts
- Ask interesting questions
- Keep engaging
- Preserve information

Chapter:
${chapterText}
`;
      break;

    case "story":
      prompt = `
Convert this chapter into a storytelling experience.

Language: ${language}

Difficulty:
${difficultyGuide}

Rules:
- Explain through stories
- Preserve concepts
- Easy to understand
- Engaging narrative

Chapter:
${chapterText}
`;
      break;

    case "friendly":
      prompt = `
Convert this chapter into a friendly conversation.

Language: ${language}

Difficulty:
${difficultyGuide}

Characters:
Friend
Guide

Rules:
- Conversational tone
- Easy understanding
- Preserve important details
- Avoid excessive summarization

Chapter:
${chapterText}
`;
      break;

    default:
      prompt = `
Convert this chapter into an educational conversation.

Language: ${language}

Difficulty:
${difficultyGuide}

Chapter:
${chapterText}
`;
  }

  try {
    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    return response.text;
  } catch (error) {
    console.error(
      "Gemini Error:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  generateConversation,
};