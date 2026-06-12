const mongoose = require("mongoose");

const questionSchema =
  new mongoose.Schema(
    {
      chapterId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },

      question: String,

      answer: String,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Question",
  questionSchema
);