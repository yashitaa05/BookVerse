const path = require("path");
const multer = require("multer");

const allowedExtensions = new Set([".pdf", ".docx", ".txt"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^\w.\-() ]+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const documentUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.has(extension) &&
      allowedMimeTypes.has(file.mimetype)
    ) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Unsupported file type. Upload a PDF, DOCX, or TXT document."
      )
    );
  },
});

module.exports = { documentUpload };
