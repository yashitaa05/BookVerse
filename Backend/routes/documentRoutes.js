const express = require("express");
const {
  uploadDocument,
  saveTextDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const { documentUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/upload", documentUpload.single("document"), uploadDocument);
router.post("/", saveTextDocument);
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);

module.exports = router;
