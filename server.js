require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const dbconnection = require("./database");
const path = require("path");

// Routes imports

const multer = require('multer');



const authenticationRoutes = require("./routes/authenticationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const accessKeyRoutes = require("./routes/acessKeyRoutes");
const examRoutes = require("./routes/examRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/authentication", authenticationRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/accessKeys",accessKeyRoutes);
app.use("/api/exam-papers",examRoutes);
app.use("/api/subjects",subjectRoutes)
// Database connection
dbconnection();

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
