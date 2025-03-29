// controllers/baseController.js

const baseController = {};

// Assuming buildHome is an async function
baseController.buildHome = async function (req, res, next) {
  try {
    // Your logic here (e.g., render a view)
    res.render("home", { title: "Home Page" });  // Replace this with actual view rendering logic
  } catch (err) {
    next(err);  // Pass any error to the next middleware
  }
};

module.exports = baseController;