const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    audioType: String,

    language: String,

    audioBase64: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Audio",
  audioSchema
);