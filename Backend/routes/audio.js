const express = require("express");
const { generateChapterAudio } = require("../controllers/audio");
const router = express.Router();

router.post(
  "/generate",
  generateChapterAudio
);

module.exports = router;