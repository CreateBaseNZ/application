/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");

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

app.use(passport.initialize());
app.use(passport.session());
require("./configs/passport.js");

/* ==========================================================
ROUTERS
========================================================== */

const generalRouter = require("./routes/general.js");
app.use(generalRouter);

const homeRouter = require("./routes/home.js");
app.use(homeRouter);

/* ==========================================================
END
========================================================== */