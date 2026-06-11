const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db");
const bookRoutes = require("./routes/book");
const conversationRoutes = require("./routes/conversation")

dotenv.config();
const app = express();

connection
  .then(() => {
    console.log("MongoDB Connected");

    app.use(cors());
    app.use(express.json());
    app.use("/api/books", bookRoutes);
    app.use("/api/conversation", conversationRoutes);
    app.use("/audios",express.static("audios"));
    // console.log(require.resolve("./routes/book"));

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
