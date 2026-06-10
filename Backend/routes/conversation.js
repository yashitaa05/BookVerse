const express = require("express");

const { generateChapter } = require("../controllers/conversation");
const router = express.Router();

router.post( "/generate", generateChapter );

module.exports = router;