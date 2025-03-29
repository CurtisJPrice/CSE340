// server.js

const express = require("express");
const app = express();
const path = require("path");
const inventoryRoutes = require("./routes/inventoryRoute");
const utilities = require("./utilities/");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the inventory routes
app.use("/inventory", inventoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});