const express =
  require("express");

const {
  askChapterQuestion,
} = require(
  "../controllers/tutor"
);

const router =
  express.Router();

router.post(
  "/ask",
  askChapterQuestion
);

module.exports = router;