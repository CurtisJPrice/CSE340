// Correcting the issue with `next()` by throwing the error properly

async function getNav() {
  try {
    // Simulating fetching navigation items (no database involved)
    return [
      { name: "Home", url: "/" },
      { name: "Inventory", url: "/inv" },
      { name: "Account", url: "/account" },
    ];
  } catch (error) {
    // Throw the error to be caught by the error handler in Express
    throw new Error(error);
  }
}

module.exports = {
  getNav,
  // Other utility functions can be placed here...
};