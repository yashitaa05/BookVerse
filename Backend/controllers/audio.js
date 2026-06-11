const Conversation = require("../models/conversation" );

const Audio = require("../models/audio");

const { generateAudio } = require(" ../services/audio "); 

const generateAudioFile =
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
        });
      }

      const audioPath =
        await generateAudio(
          conversation.generatedText,
          conversation._id
        );

      const audio =
        await Audio.create({
          chapterId:
            conversation.chapterId,

          conversationId:
            conversation._id,

          audioType:
            conversation.mode,

          audioUrl:
            audioPath,
        });

      res.json({
        success: true,
        audio,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };

module.exports = {
  generateAudioFile,
};