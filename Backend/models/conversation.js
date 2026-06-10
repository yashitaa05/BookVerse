const mongoose = require("mongoose");

const conversationSchema =
  new mongoose.Schema(
    {
      chapterId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },

      mode: {
        type: String,
        enum: [
          "friendly",
          "teacher",
          "podcast",
          "story",
        ],
      },

      language: {
        type: String,
        default: "English",
      },

      difficulty: {
        type: String,
        enum: [
          "child",
          "teen",
          "college",
          "expert",
        ],
        default: "college",
      },

      generatedText: String,

      coverageScore: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);