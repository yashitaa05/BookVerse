const Book = require("../models/book.js");
const Conversation = require("../models/conversation.js");
const Chapter = require("../models/chapter");

const { extractTextFromPDF } = require("../services/pdf.js");
const { splitIntoChapters } = require("../services/chapter.js");
const { generateConversation } = require("../services/gemini.js");

// Upload Book
const uploadBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const text = await extractTextFromPDF(req.file.path);

    const book = await Book.create({
      title: req.body.title || "Untitled Book",
      fileUrl: req.file.path,
    });

    // Split chapters
    const chapters = splitIntoChapters(text);

    // Save chapters
    for (let i = 0; i < chapters.length; i++) {
      await Chapter.create({
        bookId: book._id,
        chapterNumber: i + 1,
        title: chapters[i].title,
        content: chapters[i].content,
        wordCount: chapters[i].content.split(" ").length,
      });
    }

    // Update book info
    book.totalChapters = chapters.length;
    book.processingStatus = "chapters_created";

    await book.save();

    res.status(201).json({
      success: true,
      book,
      totalChapters: chapters.length,
      extractedText: text.substring(0, 1000),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate AI Content
const generateBookContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.body;

    if (!mode) {
      return res.status(400).json({
        success: false,
        message:
          "mode is required. Example: friendly, teacher, podcast, story",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Get chapters from DB
    const chapters = await Chapter.find({
      bookId: book._id,
    }).sort({ chapterNumber: 1 });

    if (!chapters.length) {
      return res.status(404).json({
        success: false,
        message: "No chapters found",
      });
    }

    const results = [];

    for (const chapter of chapters) {
      const generatedText =
        await generateConversation(
          chapter.content,
          mode
        );

      const savedConversation =
        await Conversation.create({
          chapterId: chapter._id,
          mode,
          generatedText,
        });

      results.push(savedConversation);
    }

    book.processingStatus =
      "conversation_generated";

    await book.save();

    res.status(200).json({
      success: true,
      mode,
      totalChapters: chapters.length,
      conversations: results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadBook,
  generateBookContent,
};

