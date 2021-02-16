/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const mongoose = require("mongoose");
const gridFsStream = require("gridfs-stream");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();
const upload = require("../configs/upload.js");
let GridFS;

mongoose.createConnection(process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  });

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

// @route   POST /settings/update-account
// @desc
// @access  VERIFIED CONTENT
router.post("/settings/update-account", verifiedContent, async (req, res) => {
  // Declare variables
  let account = req.user;
  let update = req.body;
  // Update user
  try {
    await User.reform({ id: account._id, update });
  } catch (data) {
    // Delete the uploaded avatar if failed
    // TO DO
    return res.send(data);
  }
  // Success handler
  return res.send({status: "succeeded", content: ""});
});

// @route   POST /settings/update-profile
// @desc
// @access  VERIFIED CONTENT
router.post("/settings/update-profile", upload.single("avatar"), verifiedContent, async (req, res) => {
  // Declare Variables
  let update = req.body;
  // Check if there is a new upload
  if (req.file) update.avatar = req.file.id;
  // Update the user instance
  try {
    await User.reform({ id: req.user._id, update });
  } catch (data) {
    // Delete the uploaded avatar if failed
    // TO DO
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

// @route   POST /settings/update-notification
// @desc
// @access  VERIFIED CONTENT
router.post("/settings/update-notification", verifiedContent, async (req, res) => {
  // Declare variables
  let account = req.user;
  let update = req.body;
  // Update newsletter
  if (update.newsletter !== undefined) {
    if (update.newsletter) {
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
  // Success handler
  return res.send({status: "succeeded", content: ""});
});

// @route   POST /settings/fetch-avatar
// @desc
// @access  VERIFIED CONTENT
router.get("/settings/fetch-avatar", verifiedContent, async (req, res) => {
  // Declare Variables
  const id = req.user._id;
  // Fetch user
  let user;
  try {
    user = await User.findOne({ owner: id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  if (user.avatar) {
    // Fetch image
    let image = undefined;
    // If so, Send File to Front-End
    try {
      image = await GridFS.files.findOne({ _id: user.avatar });
    } catch (error) {
      return res.send({ status: "error", content: error });
    }
    if (image) {
      let readstream = GridFS.createReadStream(image.filename);
      return readstream.pipe(res);
    }
  }
  // Else, Return Temporary Profile Picture
  try {
    file = await GridFS.files.findOne({ filename: "default-avatar" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  let readstream = GridFS.createReadStream(file.filename);
  return readstream.pipe(res);
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */