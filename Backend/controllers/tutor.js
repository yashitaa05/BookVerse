const Chapter = require("../models/chapter");
const Question = require("../models/question");
const { askQuestion } = require("../services/tutor");

const askChapterQuestion =
  async (req, res) => {
    try {
      const {
        chapterId,
        question,
      } = req.body;

      const chapter =
        await Chapter.findById(
          chapterId
        );

      if (!chapter) {
        return res.status(404).json({
          success: false,
          message:
            "Chapter not found",
        });
      }

      const answer =
        await askQuestion(
          chapter.content,
          question
        );

      const saved =
        await Question.create({
          chapterId,
          question,
          answer,
        });

      res.json({
        success: true,
        answer,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  askChapterQuestion,
};