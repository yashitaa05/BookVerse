const Conversation = require("../models/conversation");
const Audio = require("../models/audio");
const { generateAudio } = require("../services/audio");

const generateChapterAudio =
  async (req, res) => {
    try {
      const {
        conversationId,
      } = req.body;

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found",
        });
      }

      const audioBase64 =
        await generateAudio(
          conversation.generatedText
        );

      const audio =
        await Audio.create({
          chapterId:
            conversation.chapterId,

          conversationId:
            conversation._id,

          audioType:
            conversation.mode,

          language:
            conversation.language,

          audioBase64,
        });

      res.json({
        success: true,
        audio,
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
  generateChapterAudio,
};