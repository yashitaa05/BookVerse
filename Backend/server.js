const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db");
const bookRoutes = require("./routes/book");

dotenv.config();
const app = express();

connection
  .then(() => {
    console.log("MongoDB Connected");

    app.use(cors());
    app.use(express.json());
    app.use("/api/books", bookRoutes);
    console.log(require.resolve("./routes/book"));
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
