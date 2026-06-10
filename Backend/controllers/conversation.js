console.log("conversation.js loaded");
const Chapter = require("../models/chapter");
const Conversation = require("../models/conversation");
const { splitIntoChunks } = require("../services/chunk");

const { generateConversation } = require("../services/gemini" );
const { extractConcepts } = require("../services/concepts" );
const { calculateCoverage } = require("../services/coverage");

const generateChapter =
  async (req, res) => {

  const generateChapter = async (req, res) => {
  console.log("GENERATE CHAPTER HIT");
  console.log(req.body);

  return res.json({
    success: true,
    controller: true
  });
};

    try {
      const {
        chapterId,
        mode,
        language,
        difficulty,
      } = req.body;

      const chapter =
        await Chapter.findById(
          chapterId
        );

      if (!chapter) {
        return res
          .status(404)
          .json({
            success:
              false,
          });
      }

      const chunks =
        splitIntoChunks(
          chapter.content
        );

      let finalText = "";

      for (
        const chunk of chunks
      ) {
        const generated =
          await generateConversation(
            chunk,
            mode,
            language,
            difficulty
          );

        finalText +=
          generated + "\n\n";
      }

      const concepts =
        await extractConcepts(
          chapter.content
        );

      const coverage =
        calculateCoverage(
          concepts,
          finalText
        );

      const saved =
        await Conversation.create({
          chapterId,
          mode,
          language,
          difficulty,
          generatedText:
            finalText,
          coverageScore:
            coverage,
        });

      res.json({
        success: true,
        coverage,
        conversation:
          saved,
      });
  //   } catch (err) {
  //     console.log(err);

  //     res.status(500).json({
  //       success: false,
  //     });
  //   }
  // };

    } catch (err) {
  console.error("ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
}
};

module.exports = {
  generateChapter,
};