const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");

const notFound = require("./middleware/not-found");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const connectDB = require("./db/connect");
const cors = require("cors");

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

global.oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    next();
});

app.use("/api/v1", router);

app.use(notFound);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(3000, console.log("Server is listening on port 3000"));
    } catch (error) {
        console.log(error);
    }
};

start();
