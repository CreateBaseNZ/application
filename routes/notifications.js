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

router.post("/inbox", /*verifiedContent,*/ async (req, res) => {
  let account = req.user;
  let notifications;
  try {
    notifications = await Notification.find({ owner: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: notifications });
});

router.post("/notification-opened", /*verifiedContent,*/ async (req, res) => {
  let account = req.user;
  let id = mongoose.Types.ObjectId(req.body.id);
  let notification;
  try {
    notification = await Notification.findOne({ _id: id, owner: account._id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Check if notification is found
  if (!notification) return res.send({ status: "failed", content: "No notification found" });
  // Update opened
  notification.opened = true;
  // Save
  try {
    await notification.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({status: "succeeded", content: ""});
});

router.post("/notification-change-status", /*verifiedContent,*/ async (req, res) => {
  // Declare variables
  let account = req.user;
  let id = mongoose.Types.ObjectId(req.body.id);
  let status = req.body.status;
  // Update notification
  let notification;
  try {
    notification = await Notification.reformStatus({ id, owner: account._id, status });
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: notification });
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */