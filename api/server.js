require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const connectDb = require("../db/connect");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const connect = connectDb(process.env.MongoDbUri);

const __dirname = path.resolve();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "server.html"));
});

// error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Invalid Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
