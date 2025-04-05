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

// Build the grid for classification (just a simulation for now)
async function buildClassificationGrid(data) {
  // This is just a mock function. Replace it with actual logic.
  return data.map(item => ({
    model: item.inv_make + ' ' + item.inv_model,
    price: item.inv_price,
    miles: item.inv_miles
  }));
}

module.exports = {
  handleErrors,
  getNav,
  buildClassificationGrid,
};