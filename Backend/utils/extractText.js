const fs = require("fs/promises");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const extractText = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();

  if (extension === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdf(buffer);
    return data.text || "";
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  }

  if (extension === ".txt") {
    return fs.readFile(filePath, "utf8");
  }

  throw new Error("Unsupported file type");
};

module.exports = { extractText };
