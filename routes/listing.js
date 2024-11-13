const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ---------- Index Route & Create Route
router
  .route("/")
  .get(wrapAsync(listingControllers.indexListing))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingControllers.createListing)
  );

// ---------- New Route
router.get("/new", isLoggedIn, listingControllers.newListing);

// ---------- Show Route & Update Route & Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// ---------- Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

module.exports = router;
