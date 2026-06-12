const express = require("express");

const { uploadBook, generateBookContent, getBooks, getBookById, deleteBook } = require("../controllers/book.js");
const { upload } = require("../middleware/upload.js");

const router = express.Router();

router.post( "/uploads", upload.single("book"), uploadBook );
router.post("/generate/:id", generateBookContent );
router.get("/", getBooks);
router.get("/:id", getBookById);
router.delete("/:id", deleteBook);

module.exports = router;
