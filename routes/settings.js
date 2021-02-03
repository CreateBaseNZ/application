/* ==========================================================
MODULES
========================================================== */

const express = require("express");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();
const upload = require("../configs/upload.js");

/* ==========================================================
MODELS
========================================================== */

const Account = require("../models/Account.js");
const User = require("../models/User.js");
const Mail = require("../models/Mail.js");

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
  // Check newsletter subscription status
  let mail;
  try {
    mail = await Mail.findOne({ email: account.email });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  notification = { newsletter: mail ? true : false };
  // Success handler
  return res.send({ status: "succeeded", content: { account, user, notification } });
});

router.post("/settings/update", /*verifiedContent,*/ async (req, res) => {
  // Declare variables
  let account = req.user;
  let accountUpdate = req.body.accountUpdate;
  let userUpdate = req.body.userUpdate;
  let notificationUpdate = req.body.notificationUpdate;
  // Update account
  if (accountUpdate) {
    try {
      await Account.reform({id: account._id, update: accountUpdate});
    } catch (data) {
      return res.send(data);
    }
  }
  // Update user
  if (userUpdate) {
    try {
      await User.reform({id: account._id, update: userUpdate});
    } catch (data) {
      return res.send(data);
    }
  }
  // Update notification
  if (notificationUpdate) {
    // Update newsletter
    if (notificationUpdate.newsletter !== undefined) {
      if (notificationUpdate.newsletter) {
        try {
          await Mail.subscribe({ email: account.email, owner: account._id });
        } catch (data) {
          return res.send(data);
        }
      } else {
        try {
          await Mail.unsubscribe({ email: account.email });
        } catch (daya) {
          return res.send(data);
        }
      }
    }
  }
  // Success handler
  return res.send({status: "succeeded", content: ""});
});

router.post("/settings/update-profile", upload.single(""), verifiedContent, async (req, res) => {
  
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */