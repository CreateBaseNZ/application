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
// @access  STRICTLY PUBLIC
router.post("/signup/validate", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  let valid = true;
  let error = { email: "", name: "", password: "" };
  // Perform validation
  try {
    account = await Account.validateEmail(email, false);
  } catch (data) {
    if (data.status === "failed") {
      valid = false;
      error.email = data.content;
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  try {
    await User.validateName(name);
  } catch (data) {
    if (data.status === "failed") {
      valid = false;
      error.name = data.content;
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  try {
    await Account.validatePassword(password);
  } catch (data) {
    if (data.status === "failed") {
      valid = false;
      error.password = data.content;
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  if (!valid) return res.send({ status: "failed", content: error });
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /login/submit
// @desc
// @access  STRICTLY PUBLIC
router.post("/login/submit", passport.authenticate("local-account-login", {
  failureRedirect: "/"
}), (req, res) => {
  if (req.body.remember) {
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 365);
  } else {
    req.session.cookie.expires = false;
  }
  return res.redirect("/dashboard");
});

// @route   POST /login/validate
// @desc
// @access  STRICTLY PUBLIC
router.post("/login/validate", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const password = req.body.password;
  let error = { email: "", password: "" };
  // Validate the email
  let account;
  try {
    account = await Account.validateEmail(email);
  } catch (data) {
    if (data.status === "failed") {
      error.email = data.content;
      return res.send({ status: "failed", content: error });
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  // Validate password
  let match;
  try {
    match = await account.validatePassword(password);
  } catch (data) {
    if (data.status === "failed") {
      error.password = data.content;
      return res.send({ status: "failed", content: error });
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  if (!match) {
    error.password = "Invalid password";
    return res.send({ status: "failed", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});


/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */