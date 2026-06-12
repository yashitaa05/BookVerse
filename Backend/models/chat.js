const mongoose =
  require("mongoose");

const chatSchema =
  new mongoose.Schema(
    {
      chapterId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },

      messages: [
        {
          role: String,
          content: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ChatSession",
    chatSchema
  );