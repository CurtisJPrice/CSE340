// utilities/index.js

// Example of handleErrors function
async function handleErrors(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);  // Execute the passed function
    } catch (error) {
      next(error);  // Pass the error to the next middleware (error handler)
    }
  };
}

// Simulate fetching navigation items (no database involved)
async function getNav() {
  try {
    return [
      { name: "Home", url: "/" },
      { name: "Inventory", url: "/inv" },
      { name: "Account", url: "/account" },
    ];
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  handleErrors,
  getNav,
  // Other utility functions can be placed here...
};