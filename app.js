if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const MongoStore = require("connect-mongo");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ---------- Connection with MongoDB

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
let dbUrl = process.env.ATLASDB_URL;
console.log("MongoDB URL: ", process.env.ATLASDB_URL);

main()
  .then((res) => {
    console.log("Connected with MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// ---------- Server Things Setup

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo Session Store...!", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ---------- All Listings Routes
app.use("/listings", listingRouter);

// ---------- All Reviews Routes
app.use("/listings/:id/reviews", reviewRouter);

// ---------- All User Routes
app.use("/", userRouter);

// ---------- Listening for all requests that aren't matched from above routes

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ---------- Errors Handling (middleware)

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong...!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ---------- Server Listening Port 3000

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});
