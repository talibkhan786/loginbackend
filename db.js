const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

// Immediately invoke the connectToDatabase function to establish the connection
connectToDatabase();

// Define a separate function to fetch and populate the global variables
const fetchData = async () => {
  try {
    const data = await mongoose.connection.db.collection('foodData2').find({}).toArray();
    const foodCategory = await mongoose.connection.db.collection('foodCategory').find({}).toArray();

    global.food_items = data;
    global.foodCategory = foodCategory;

    console.log('Data fetched successfully');
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

// Invoke the fetchData function after connecting to the database
mongoose.connection.once('open', () => {
  fetchData();
});

router.post('/db', async (req, res) => {
  try {
    // Check if the global variables are populated before returning the response
    if (global.food_items && global.foodCategory) {
      res.status(200).json({ message: 'Data fetched successfully', foodItems: global.food_items, foodCategory: global.foodCategory });
    } else {
      throw new Error('Food data not available');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
