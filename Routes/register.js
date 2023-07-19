const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
  
      if (user) {
        res.send({ message: 'User already registered' });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
  
        const newUser = new User({
          name,
          email,
          password: hashedPassword, // Store the hashed password
        });
  
        await newUser.save();
        res.send({ message: 'Successfully Registered, Please login now' });
      }
    } catch (err) {
      res.send(err);
    }
  });

  module.exports = router;