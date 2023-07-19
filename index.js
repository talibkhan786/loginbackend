// Importing the required modules
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const jwtSecret = "maynameistalibkhan";

// Importing the required modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Creating an instance of Express
const app = express();

// Parsing incoming JSON data
app.use(express.json());

// Parsing incoming URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,");
  next();
});

// Creating Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Routes

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({ message: "Fill in the details!" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, jwtSecret);

        res.send({
          message: "Login Successful",
          user: user,
          authToken: authToken,
        });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not Registered" });
    }
  } catch (err) {
    res.send(err);
  }
});

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt

      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Store the hashed password
      });

      await newUser.save();
      res.send({ message: "Successfully Registered, Please login now" });
    }
  } catch (err) {
    res.send(err);
  }
});

// Importing the required routes
const displayDataRoutes = require("./Routes/DisplayData");
const dbRoutes = require("./db");

// Using the routes
app.use("/api", displayDataRoutes);
app.use("/api", dbRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(9001, () => {
  console.log("Backend started at port 9001");
});
