const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  textLength: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
