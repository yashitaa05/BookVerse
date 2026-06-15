const fs = require("fs/promises");
const path = require("path");
const Document = require("../models/Document");
const { extractText } = require("../utils/extractText");

const cleanupFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn("Failed to delete uploaded temp file:", error.message);
  }
};

const uploadDocument = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    filePath = req.file.path;
    const extractedText = (await extractText(filePath, req.file.originalname)).trim();

    if (!extractedText) {
      return res.status(422).json({
        success: false,
        message: "No readable text could be extracted from this document",
      });
    }

    const document = await Document.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase().slice(1),
      extractedText,
      textLength: extractedText.length,
    });

    res.status(201).json({
      success: true,
      document,
      extractedText,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Document extraction failed: ${error.message}`,
    });
  } finally {
    await cleanupFile(filePath);
  }
};

const saveTextDocument = async (req, res) => {
  try {
    const { title = "Pasted text", text } = req.body;
    const extractedText = String(text || "").trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const document = await Document.create({
      userId: req.user._id,
      originalName: title.trim() || "Pasted text",
      fileType: "text",
      extractedText,
      textLength: extractedText.length,
    });

    res.status(201).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("originalName fileType textLength createdAt");

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Document deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  saveTextDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
