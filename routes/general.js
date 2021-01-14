/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const path = require("path");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();
const options = { root: path.join(__dirname, "../views") };

/* ==========================================================
ROUTES
========================================================== */

// @route   GET /
// @desc
// @access  PUBLIC
router.get("/", (req, res) => res.sendFile("home.html", options));

// @route   GET /dashboard
// @desc
// @access  PRIVATE
router.get("/dashboard", (req, res) => res.sendFile("dashboard.html", options));

// @route   GET /projects
// @desc
// @access  PRIVATE
router.get("/projects", (req, res) => res.sendFile("projects.html", options));

// @route   GET /inbox
// @desc
// @access  PRIVATE
router.get("/inbox", (req, res) => res.sendFile("inbox.html", options));

// @route   GET /orders
// @desc
// @access  PRIVATE
router.get("/orders", (req, res) => res.sendFile("orders.html", options));

// @route   GET /settings
// @desc
// @access  PRIVATE
router.get("/settings", (req, res) => res.sendFile("settings.html", options));

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */