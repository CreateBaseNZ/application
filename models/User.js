/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;

/* ==========================================================
MODEL
========================================================== */

const UserSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  address: {
    recipient: { type: String, default: "" },
    unit: { type: String, default: "" },
    streetNumber: { type: String, default: "" },
    streetName: { type: String, default: "" },
    suburb: { type: String, default: "" },
    city: { type: String, default: "" },
    postcode: { type: String, default: "" },
    country: { type: String, default: "" }
  }
});

/* ==========================================================
STATICS
========================================================== */

// @func  build
// @type  STATICS - PROMISE - ASYNC
// @desc  
UserSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    try {
      await this.validateName(object.name);
    } catch (data) {
      return reject(data);
    }
    // CREATE USER
    const user = new this(object);
    if (save) {
      try {
        await user.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(user);
  });
};

/* ----------------------------------------------------------
VALIDATION
---------------------------------------------------------- */

// @func  validateName
// @type  STATICS - PROMISE
// @desc  
UserSchema.statics.validateName = function (name) {
  return new Promise((resolve, reject) => {
    let regex = /^[A-Za-z0-9_-\s]+$/;
    // Check for name input
    if (!name) return reject({ status: "failed", content: "name is required" });
    // Check if name is valid
    if (!regex.test(String(name).toLowerCase())) return reject({ status: "failed", content: "invalid name" });
    // Success handler
    return resolve();
  });
}

/* ==========================================================
EXPORT
========================================================== */

module.exports = User = mongoose.model("users", UserSchema);

/* ==========================================================
END
========================================================== */