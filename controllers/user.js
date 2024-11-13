const User = require("../models/users.js");

// ---------- Signup User (GET)
module.exports.signupGetUser = (req, res) => {
  res.render("users/signup.ejs");
};

// ---------- Signup User (POST)
module.exports.signupPostUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } else {
      throw new Error("User already exist!");
    }
  } catch (err) {
    req.flash("error", err.message + "!");
    res.redirect("/signup");
  }
};

// ---------- Login User (GET)
module.exports.loginGetUser = (req, res) => {
  res.render("users/login.ejs");
};

// ---------- Login User (POST)
module.exports.loginPostUser = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  res.redirect(res.locals.redirectUrl ? res.locals.redirectUrl : "/listings");
};

// ---------- Logout Route (GET)
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
