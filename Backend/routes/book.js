const express = require("express");

const { uploadBook, generateBookContent } = require("../controllers/book.js");
const { upload } = require("../middleware/upload.js");

const router = express.Router();

router.post( "/uploads", upload.single("book"), uploadBook );
//router.post("/generate/:id", generateBookContent );

module.exports = router;

