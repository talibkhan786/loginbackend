const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.send({ message: 'Fill in the details!' });
    }
  
    try {
      const user = await User.findOne({ email: email });
  
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          res.send({ message: 'Login Successful', user: user });
        } else {
          res.send({ message: "Password didn't match" });
        }
      } else {
        res.send({ message: 'User not Registered' });
      }
    } catch (err) {
      res.send(err);
    }
  });

  module.exports = router;