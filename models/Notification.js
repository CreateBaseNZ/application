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
  messange: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: Boolean, required: true }
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