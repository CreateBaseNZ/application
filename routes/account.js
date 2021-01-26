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
// @desc    
// @access  STRICTLY PUBLIC
router.post("/signup/submit", passport.authenticate("local-account-signup", {
  successRedirect: "/verification", failureRedirect: "/"
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
  if (req.user.verification.status) {
    return res.redirect("/dashboard");
  } else {
    return res.redirect("/verification");
  }
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

// @route   POST /change-password/request
// @desc
// @access  STRICTLY PUBLIC
router.post("/change-password/request", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  // Validate email
  let account;
  try {
    account = await Account.validateEmail(email, true);
  } catch (data) {
    return res.send(data);
  }
  // Process the change password request
  try {
    await Account.forgotPassword(account);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /change-password/submit
// @desc
// @access  STRICTLY PUBLIC
router.post("/change-password/submit", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const password = req.body.password;
  const code = req.body.code;
  // Change password
  try {
    await Account.changePassword({ email, password, code });
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /verify-account/request
// @desc
// @access  STRICTLY PUBLIC
router.post("/verify-account/request", async (req, res) => {
  // Declare variables
  const email = req.user.email;
  // Send email verification
  try {
    await Account.sendVerificationEmail(email);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /verify-account/submit
// @desc
// @access  STRICTLY PUBLIC
router.post("/verify-account/submit", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const code = req.body.code;
  // Verify account
  try {
    await Account.verify({ email, code });
  } catch (data) {
    return res.send(data);
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