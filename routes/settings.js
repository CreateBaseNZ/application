/* ==========================================================
MODULES
========================================================== */

const express = require("express");

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
MIDDLEWARES
========================================================== */

const verifiedContent = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.verification.status) {
      return next();
    } else {
      return res.send({ status: "failed", content: "Account is not verified" });
    }
  } else {
    return res.send({ status: "failed", content: "Account is not logged in" });
  }
};

/* ==========================================================
ROUTES
========================================================== */

router.post("/settings", /*verifiedContent,*/ async (req, res) => {
  let account = req.user;
  let user;
  try {
    user = await User.findOne({ owner: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: { account, user } });
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */