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

    audioType: {
      type: String,
      enum: [
        "friendly",
        "teacher",
        "podcast",
        "story",
      ],
    },

    audioUrl: String,

    language: String,

    duration: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Audio",
  audioSchema
);