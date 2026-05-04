const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const dashboardController = require("../controllers/dashboard");

// dashboard page
router.get("/", isLoggedIn, dashboardController.renderDashboard);

// cancel booking
router.delete("/booking/:id", isLoggedIn, dashboardController.cancelBooking);

module.exports = router;