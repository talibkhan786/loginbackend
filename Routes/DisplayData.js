const express = require('express');
const router = express.Router();

router.post('/foodData', (req, res) => {
  try {
    if (global.food_items && global.foodCategory) {
      //console.log(global.food_items, global.foodCategory);
      res.send({ foodItems: global.food_items, foodCategory: global.foodCategory });
    } else {
      throw new Error('Food data not available.');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
