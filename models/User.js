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
  displayName: { type: String, required: true },
  displayEmail: { type: String, default: "" },
  address: {
    unit: { type: String, default: "" },
    street: { type: String, default: "" },
    suburb: { type: String, default: "" },
    city: { type: String, default: "" },
    postcode: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  location: { type: String, default: "" }
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

// @func  reform
// @type  STATICS - PROMISE - ASYNC
// @desc  
UserSchema.statics.reform = function (object = {}, save = true) {
  return new Promise (async (resolve, reject) => {
    // Fetch the user
    let user;
    try {
      user = await this.findOne({owner: object.id});
    } catch (error) {
      return reject({status: "error", content: error});
    }
    // Update user
    for (const property in object.update) {
      if (property === "name") {
        try {
          await this.validateName(object.update.name);
        } catch (data) {
          return reject(data);
        }
      }
      user[property] = object.update[property];
    }
    // Save user
    if (save) {
      try {
        await user.save();
      } catch (error) {
        return reject({status: "error", content: error});
      }
    }
    // Success handler
    return resolve(user);
  });
}

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