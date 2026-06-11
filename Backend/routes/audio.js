const express =
  require("express");

const { generateAudioFile } = require("../controllers/audio");

const router =
  express.Router();

router.post("/generateaudio", generateAudioFile);

module.exports = router;