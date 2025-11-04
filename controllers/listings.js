const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.index = async (req, res) => {
  const { search } = req.query;
  let listings;

  if (search) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });
  } else {
    listings = await Listing.find({});
  }

  res.render("listings/index", { allListings: listings, search });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New Listing Created");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
  try {
    const { title, description, price, location, country } = req.body.listing;

    // 🗺️ 1. Get coordinates for the location using Geoapify
    const geoResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        location
      )}&apiKey=${process.env.MAP_TOKEN}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.features || geoData.features.length === 0) {
      req.flash("error", "Invalid location. Please enter a valid place.");
      return res.redirect("/listings/new");
    }

    // Extract coordinates (longitude, latitude)
    const coordinates = geoData.features[0].geometry.coordinates;

    // 🏡 2. Create a new listing with image, location, and geometry
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = {
      type: "Point",
      coordinates: coordinates, // [lng, lat]
    };

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "You are not the owner of this listing");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  // const { image, ...data } = req.body.listing;
  // await Listing.findByIdAndUpdate(id, data);
  // // await Listing.save();
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
