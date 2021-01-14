/* ==========================================================
MODULES
========================================================== */

const passport = require("passport");
const LocalStrategy = require("passport-local");

/* ==========================================================
MODELS
========================================================== */

const Account = require("./../models/Account.js");

/* ==========================================================
SESSIONS
========================================================== */

passport.serializeUser((account, done) => done(null, account.id));

passport.deserializeUser((id, done) => {
  Account.findById(id, (error, account) => done(error, account));
});

/* ==========================================================
LOCAL STRATEGY - ACCOUNT SIGNUP
========================================================== */

const LocalAccountSignup = new LocalStrategy({
  // By default, local strategy uses username and password, we will override with email
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true // Allow us to pass back the entire request to the callback
}, (req, email, password, done) => {
  process.nextTick(async () => {
    // Declare and initialise variables
    const name = req.body.name;
    // Create an account instance
    const object = { type: "user", email, password, name: req.name };
    let account;
    try {
      account = await Account.build(object);
    } catch (data) {
      return done(null, false);
    }
    // SUCCESS HANDLER
    return done(null, account);
  });
});

// Enable use of the local strategy
passport.use("local-account-signup", LocalAccountSignup)

/* ==========================================================
END
========================================================== */