require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const dbconnection = require("./database");
const path = require("path");

// Routes imports

const multer = require('multer');





const accessKeyRoutes = require("./routes/acessKeyRoutes");
const examRoutes = require("./routes/examRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: 'https://study-max-admin.vercel.app',

    optionsSuccessStatus: 200,
  })
);

// Routes


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
