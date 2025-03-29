// server.js

const express = require('express');
const app = express();
const inventoryRoute = require('./routes/inventoryRoute');  // Assuming your routes are in "routes/inventoryRoute.js"
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');  // Ensure this is set to the view engine you use (e.g., EJS, Pug)

// Serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/inventory', inventoryRoute);  // This is where we link the inventory routes

// Root route (check if this is defined)
app.get('/', (req, res) => {
  res.send('Welcome to the Inventory App');
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});