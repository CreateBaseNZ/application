/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

/* ==========================================================
VARIABLES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

/* ==========================================================
DATABASE
========================================================== */

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

/* ==========================================================
SERVER
========================================================== */

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));

/* ==========================================================
MIDDLEWARES
========================================================== */

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Security
app.use(helmet({ contentSecurityPolicy: false }));
// X-XSS Header
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");
  next();
});

/* ==========================================================
AUTHENTICATION
========================================================== */

// Session
app.use(session({
  secret: process.env.SESSION_SECRET, saveUninitialized: true,
  resave: true, rolling: true, sameSite: "none"
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require("./configs/passport.js");

/* ==========================================================
ROUTERS
========================================================== */

const generalRouter = require("./routes/general.js");
app.use(generalRouter);

const accountRouter = require("./routes/account.js");
app.use(accountRouter);

const dashboardRouter = require("./routes/dashboard.js");
app.use(dashboardRouter);

const settingsRouter = require("./routes/settings.js");
app.use(settingsRouter);

const notificationsRouter = require("./routes/notifications.js");
app.use(notificationsRouter);

/* ==========================================================
END
========================================================== */