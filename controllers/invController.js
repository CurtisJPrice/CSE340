// controllers/invController.js

// Simulate inventory model and utility functions (no PostgreSQL involved)
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;

  // Simulating inventory data (normally from the database)
  const data = [
    { classification_name: "SUV", make: "Toyota", model: "Rav4", year: 2022, miles: 15000, price: 25000 },
    { classification_name: "SUV", make: "Honda", model: "CR-V", year: 2023, miles: 5000, price: 27000 }
  ];

  // Simulate a classification grid
  const grid = data.map(item => ({
    make: item.make,
    model: item.model,
    year: item.year,
    miles: item.miles,
    price: item.price
  }));

  // Get navigation items from the utilities
  let nav = await utilities.getNav();
  const className = data[0].classification_name;  // Assuming all items have the same classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    error: null,
  });
};

/* ***************************
 *  Add Classification
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add Vehicle
 * ************************** */
invCont.buildAddVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let buildClassificationList = await utilities.buildClassificationList();  // Mock data for classification list
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    buildClassificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process New classification
 * *************************************** */
invCont.newClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  // Simulating the classification registration result
  const newClassificationResult = classification_name ? true : false;

  if (newClassificationResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added!`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the registration of a new classification failed."
    );
    res.status(501).render("inv/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process New Vehicle
 * *************************************** */
invCont.newVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let buildClassificationList = await utilities.buildClassificationList();  // Mock data for classification list
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  // Simulating the vehicle registration result
  const newVehicleResult = inv_make && inv_model && inv_price ? true : false;

  if (newVehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added!`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the registration of a new vehicle failed."
    );
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      buildClassificationList,
      errors: null,
    });
  }
};

module.exports = invCont;