/* ==========================================================
MODULES
========================================================== */

const express = require("express");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();
const email = require("../configs/email.js");

/* ==========================================================
MIDDLEWARES
========================================================== */

const strictlyPublicAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return res.redirect("/dashboard");
    } else {
      return res.redirect("/verification");
    }
  } else {
    return next();
  }
}

const strictlyUnverifiedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return res.redirect("/dashboard");
    } else {
      return next();
    }
  } else {
    return res.redirect("/");
  }
}

const verifiedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.redirect("/verification");
    }
  } else {
    return res.redirect("/");
  }
};

/* ==========================================================
ROUTES
========================================================== */

// @route   POST /test/send-email
// @desc
// @access  VERIFIED ADMIN
router.post("/test/send-email", async (req, res) => {
  // Validate inputs
  // TO DO
  // Build email object
  let object = undefined;
  try {
    object = await email.build(req.body);
  } catch (data) {
    return res.send(data);
  }
  // Send the email
  try {
    await email.send(object);
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