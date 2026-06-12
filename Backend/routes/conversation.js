console.log("Conversation route loaded");
const express = require("express");

const { generateChapter, getChapterConversations } = require("../controllers/conversation");
const router = express.Router();

router.post( "/generate", generateChapter );
router.get( "/chapter/:chapterId", getChapterConversations );

module.exports = router;