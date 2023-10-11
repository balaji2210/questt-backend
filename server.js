require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

const { DB } = require("./config/db");

const app = express();

const cors = require("cors");
const morgan = require("morgan");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

DB();
mongoose.set("debug", true);

//routes

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const authorRoutes = require("./routes/author.routes");
const booksRoutes = require("./routes/books.routes");
const orderRoutes = require("./routes/order.routes");
const searchRoutes = require("./routes/search.routes");

const { errorHandler } = require("./utils/handler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["https://questt.vercel.app", "https://questt.netlify.app"],
  })
);
app.use(morgan("tiny"));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "Hello" });
});

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use("/author", authorRoutes);

app.use("/book", booksRoutes);

app.use("/order", orderRoutes);

app.use("/search", searchRoutes);

app.use("*", (req, res) => errorHandler(res, "API Not Found", 404));

app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is Running on PORT 4001`);
});
