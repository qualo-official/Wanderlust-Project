const Listing = require("../models/listing");

// ---------- Index Listing

module.exports.indexListing = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ---------- New Listing

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

// ---------- Show Listing

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exit!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// ---------- Create Listing

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// ---------- Edit Listing

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exit to edit!");
    return res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_250,w_300")
  res.render("listings/edit.ejs", { listing, originalUrl });
};

// ---------- Update Listing

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing is updated!");
  res.redirect(`/listings/${id}`);
};

// ---------- Delete Listing

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  console.log(delListing);
  req.flash("success", "Listing is deleted!");
  res.redirect("/listings");
};
