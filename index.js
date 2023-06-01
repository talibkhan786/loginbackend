// Importing the required modules
const express = require('express');
const bodyParser = require('body-parser');

// Creating an instance of Express
const app = express();

// Parsing incoming JSON data
app.use(bodyParser.json({ extended: true }));

// Parsing incoming URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Rest of your code...


// Importing the required modules
const mongoose = require('mongoose');

// Connect to MongoDB using async/await
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

// Calling the connectToDatabase function
connectToDatabase();

// Creating Schema

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const User = new mongoose.model("User", userSchema)




  //Routes

//Login
app.post("/login",async (req, res) => {
  const { email, password } = req.body
  
  try{
    const user = await User.findOne({ email: email })
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not Registered" })
    }
    } catch (err) {
      res.send(err);
    }
  })

//Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const newUser = new User({
        name,
        email,
        password
      });

      await newUser.save();
      res.send({ message: "Successfully Registered, Please login now" });
    }
  } catch (err) {
    res.send(err);
  }

})



app.listen(9001, () => {
  console.log("BE started at port 9001")
})
