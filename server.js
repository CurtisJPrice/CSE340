const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory (where your .ejs files are stored)
app.set('views', path.join(__dirname, 'views'));

// For static files like CSS or JS
app.use(express.static(path.join(__dirname, 'public')));

// Route example
app.get('/', (req, res) => {
  res.render('index');  // Ensure index.ejs is in the views folder
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});