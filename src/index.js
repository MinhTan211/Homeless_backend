const express = require("express");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const path = require("path");
const route = require("./routes");
const db = require("./config/db/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "mr-tan",
  api_key: "917666993337169",
  api_secret: "LKC2wkdfPCkatsFgef-DSdB-YXQ",
});

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());
//todo: middlewares, body-parser
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "1000mb",
  })
);

//todo: connect db

db.connect();

//! HTTP NODEJS, debug HTTP
//! nodemon refactor the run to npm start
//! HTTP redirect support
app.use(morgan("combined"));

//todo: routes
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
