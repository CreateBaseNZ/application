/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const passport = require("passport");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();

/* ==========================================================
MODELS
========================================================== */

const Account = require("../models/Account.js");
const User = require("../models/User.js");

/* ==========================================================
ROUTES
========================================================== */

// @route   POST /signup/submit
// @desc    TEMPORARY current success redirect is pointing towards
//          dashboard, but ideally, it redirects to verification page,
//          and failure redirect ideally points to signup.
// @access  STRICTLY PUBLIC
router.post("/signup/submit", passport.authenticate("local-account-signup", {
  successRedirect: "/dashboard", failureRedirect: "/"
}));

// @route   POST /signup/validate
// @desc
// @access  PUBLIC
router.post("/signup/validate", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  // Perform validation
  const promises = [Account.validateEmail(email, false), User.validateName(name), Account.validatePassword(password)];
  try {
    await Promise.all(promises);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /login/submit
// @desc
// @access  PUBLIC


/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */