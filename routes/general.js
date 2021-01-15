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
MIDDLEWARES
========================================================== */

const strictlyPublicAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  } else {
    return next();
  }
}

/* ==========================================================
ROUTES
========================================================== */

// @route   GET /
// @desc
// @access  STRICTLY PUBLIC
router.get("/", strictlyPublicAccess, (req, res) => res.sendFile("home.html", options));

// @route   GET /dashboard
// @desc
// @access  VERIFIED PRIVATE
router.get("/dashboard", (req, res) => res.sendFile("dashboard.html", options));

// @route   GET /projects
// @desc
// @access  VERIFIED PRIVATE
router.get("/projects", (req, res) => res.sendFile("projects.html", options));

// @route   GET /inbox
// @desc
// @access  VERIFIED PRIVATE
router.get("/inbox", (req, res) => res.sendFile("inbox.html", options));

// @route   GET /orders
// @desc
// @access  VERIFIED PRIVATE
router.get("/orders", (req, res) => res.sendFile("orders.html", options));

// @route   GET /settings
// @desc
// @access  VERIFIED PRIVATE
router.get("/settings", (req, res) => res.sendFile("settings.html", options));

// @route   GET /logout
// @desc
// @access  VERIFIED PRIVATE
router.get("/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */