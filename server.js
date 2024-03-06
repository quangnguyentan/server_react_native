const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const initRouter = require("./routes/index");
const PORT = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser());
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: "http://localhost:8081/",

    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
connectDB();
initRouter(app);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
