console.log("conversation.js loaded");

const Chapter = require("../models/chapter");
const Conversation = require("../models/conversation");
const { splitIntoChunks } = require("../services/chunk");
const { generateConversation } = require("../services/gemini");
const { extractConcepts } = require("../services/concepts");
const { calculateCoverage } = require("../services/coverage");

const generateChapter = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GENERATE CHAPTER HIT");
    console.log("Request Body:", req.body);

    const {
      chapterId,
      mode = "friendly",
      language = "English",
      difficulty = "college",
    } = req.body;

    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "chapterId is required",
      });
    }

    console.log("Searching chapter:", chapterId);

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    console.log("Chapter Found");
    console.log("Title:", chapter.title);
    console.log(
      "Content Length:",
      chapter.content?.length || 0
    );

    const chunks = splitIntoChunks(chapter.content);

    console.log("Total Chunks:", chunks.length);

    let finalText = "";

    for (const [index, chunk] of chunks.entries()) {
      console.log(
        `Processing Chunk ${index + 1}/${chunks.length}`
      );

      console.log(
        "Chunk Size:",
        chunk.length
      );

      const generated =
        await generateConversation(
          chunk,
          mode,
          language,
          difficulty
        );

      finalText += generated + "\n\n";

      console.log(
        `Chunk ${index + 1} Completed`
      );
    }

    console.log("Generating Concepts...");

    const concepts = await extractConcepts(
      chapter.content
    );

    console.log(
      "Concepts Found:",
      concepts.length
    );

    const coverage = calculateCoverage(
      concepts,
      finalText
    );

    console.log(
      "Coverage Score:",
      coverage
    );

    console.log(
      "Saving Conversation..."
    );

    const saved =
      await Conversation.create({
        chapterId,
        mode,
        language,
        difficulty,
        generatedText: finalText,
        coverageScore: coverage,
      });

    console.log(
      "Conversation Saved:",
      saved._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Conversation generated successfully",
      coverage,
      conversation: saved,
    });
  } catch (err) {
    console.error("=================================");
    console.error("GENERATE CHAPTER ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack:
        process.env.NODE_ENV === "development"
          ? err.stack
          : undefined,
    });
  }
};

module.exports = {
  generateChapter,
};