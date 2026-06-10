const mongoose = require( "mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Unknown",
    },

    language: {
      type: String,
      default: "English",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    totalChapters: {
  type: Number,
  default: 0
},

processingStatus: {
  type: String,
  enum: [
    "uploaded",
    "chapters_created",
    "conversation_generated",
    "audio_generated"
  ],
  default: "uploaded"
}
  },
  { timestamps: true }
);

module.exports = mongoose.model(
    "Book", 
    bookSchema);