const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (path) => {
  const buffer = fs.readFileSync(path);

  const data = await pdf(buffer);

  return data.text;
};

module.exports = { extractTextFromPDF };