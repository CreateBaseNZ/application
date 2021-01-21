/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;

/* ==========================================================
OTHER MODELS
========================================================== */



/* ==========================================================
MODEL
========================================================== */

const NotificationSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: [String], required: true },
  date: { type: String, required: true },
  opened: { type: Boolean, required: true },
  status: { type: String, required: true }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

NotificationSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION

    // CREATE NOTIFICATION
    const notification = new this(object);
    if (save) {
      try {
        await notification.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(notification);
  });
}

/* ==========================================================
METHODS
========================================================== */



/* ==========================================================
EXPORT
========================================================== */

module.exports = Notification = mongoose.model("notifications", NotificationSchema);

/* ==========================================================
END
========================================================== */