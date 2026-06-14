const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db");
const bookRoutes = require("./routes/book");
const conversationRoutes = require("./routes/conversation")
const tutorRoutes =require("./routes/tutor");
const audioRoutes = require("./routes/audio")


dotenv.config();
const app = express();

connection
  .then(() => {
    console.log("MongoDB Connected");

    app.use(cors());
    app.use(express.json());

    app.use("/api/books", bookRoutes);
    app.use("/api/conversation", conversationRoutes);
    app.use("/api/audios/static", express.static("audios"));
    app.use("/api/audio", audioRoutes);
    app.use("/api/tutor", tutorRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
