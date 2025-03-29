// server.js (or app.js)
const express = require('express');
const app = express();
const inventoryRoute = require('./routes/inventoryRoute');  // Your inventory routes

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set your view engine (for example, EJS or Pug)
app.set('view engine', 'ejs');  // Or 'pug', depending on what you're using

// Use inventory routes
app.use('/inventory', inventoryRoute);  // Make sure this is the correct path to your inventory routes

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Inventory App');
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
