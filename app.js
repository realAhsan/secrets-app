//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// express App Setup
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose Setup
mongoose
  .connect("mongodb://127.0.0.1/UsersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// mongoose Scheme & Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

// Get Routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Post routes

app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({
    email: email,
    password: password,
  });

  user.save().then(() => {
    res.render("secrets");
  });
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });

    if (user.password === password) {
      res.render("secrets");
    } else {
      res.send("worng email or paswword try again");
    }
  } catch (err) {
    console.log(err);
  }
});

// Server Startup
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
 
});

