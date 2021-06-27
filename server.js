const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/category", require("./routes/api/category"));
app.use("/api/outcome", require("./routes/api/outcome"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
