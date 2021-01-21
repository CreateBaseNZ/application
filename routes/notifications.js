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

const Notification = require("../models/Notification.js");

/* ==========================================================
MIDDLEWARES
========================================================== */



/* ==========================================================
ROUTES
========================================================== */

router.post("/notifications-unread", /*verifiedContent,*/ async (req, res) => {
  let account = req.user;
  let notification;
  try {
    notification = await Notification.findOne({ owner: account._id, opened: false });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (notification) {
    return res.send({ status: "succeeded", content: true });
  } else {
    return res.send({ status: "succeeded", content: false });
  }
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */