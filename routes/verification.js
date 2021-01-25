/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const mongoose = require("mongoose");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();

/* ==========================================================
MODELS
========================================================== */

const Account = require("../models/Account.js");

/* ==========================================================
MIDDLEWARES
========================================================== */

const strictlyUnverifiedContent = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return res.send({ status: "error", content: "Invalid access" });
    } else {
      return next();
    }
  } else {
    return res.send({ status: "error", content: "Invalid access" });
  }
}

/* ==========================================================
ROUTES
========================================================== */

router.post("/verification/resend-code", strictlyUnverifiedContent, async (req, res) => {
  // Declare variables
  let email = req.user.email;
  // Send verification email
  try {
    await Account.sendVerificationEmail(email);
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