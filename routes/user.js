const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

// ---------- Signup Route (GET) & (POST)
router
  .route("/signup")
  .get(userController.signupGetUser)
  .post(wrapAsync(userController.signupPostUser));

// ---------- Login Route (GET) & (POST)
router
  .route("/login")
  .get(userController.loginGetUser)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginPostUser
  );

// ---------- Logout Route (GET)
router.get("/logout", userController.logoutUser);

module.exports = router;
