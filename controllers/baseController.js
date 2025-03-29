// controllers/baseController.js

// Simulate the base controller (used in the home page route)
const baseController = {};

// Simulate building the homepage
baseController.buildHome = async (req, res, next) => {
  const nav = await require("../utilities").getNav();  // Using utility function to simulate navigation
  
  res.render("home", {
    title: "Home",
    nav,
  });
};

module.exports = baseController;