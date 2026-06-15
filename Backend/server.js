const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db");
const bookRoutes = require("./routes/book");
const conversationRoutes = require("./routes/conversation")
const tutorRoutes =require("./routes/tutor");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");


dotenv.config();
const app = express();

connection
  .then(() => {
    console.log("MongoDB Connected");

    app.use(
      cors({
        origin:
          "*",
          credentials: true,
      })
    );
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/documents", documentRoutes);
    app.use("/api/books", bookRoutes);
    app.use("/api/conversation", conversationRoutes);
    app.use("/api/tutor", tutorRoutes);

    app.use((err, req, res, next) => {
      if (err) {
        const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({
          success: false,
          message:
            err.code === "LIMIT_FILE_SIZE"
              ? "File size must be 10MB or less"
              : err.message,
        });
      }

      next();
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
