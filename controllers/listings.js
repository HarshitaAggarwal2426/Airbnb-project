const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.index = async (req, res) => {
  const { search } = req.query;
  let query = {};
    let noResults = false;

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
  }

  const listings = await Listing.find(query).lean();

  if (search && listings.length === 0) {
    noResults = true;
    listings = await Listing.find({}).lean();
  }

  res.render("listings/index.ejs", { allListings: listings, search,noResults, });
};

// module.exports.showListing = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");
//   if (!listing) {
//     req.flash("error", "Listing you requested for does not exist");
//     return res.redirect("/listings");
//   }
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// };

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  // ✅ FETCH BOOKINGS
  const bookings = await Booking.find({ listing: id });

  // ✅ CONVERT TO DISABLED DATES
  let bookedDates = [];

  bookings.forEach((b) => {
    let current = new Date(b.checkIn);
    while (current < b.checkOut) {
      bookedDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  });

  res.render("listings/show.ejs", { listing, bookedDates });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const { title, description, price, location, country } = req.body.listing;

    //  1. Get coordinates for the location using Geoapify
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
    const [lng, lat] = geoData.features[0].geometry.coordinates;

    if (typeof lng !== "number" || typeof lat !== "number") {
      req.flash("error", "Invalid location data");
      return res.redirect("/listings/new");
    }

    //  2. Create a new listing with image, location, and geometry
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = {
      type: "Point",
      coordinates: [lng, lat], // [lng, lat]
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

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Check if location changed OR geometry missing
    const newLocation = req.body.listing.location;
    if (!listing.geometry || listing.location !== newLocation) {
      const geoResponse = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          newLocation
        )}&apiKey=${process.env.MAP_TOKEN}`
      );
      const geoData = await geoResponse.json();

      if (geoData.features && geoData.features.length > 0) {
        const [lng, lat] = geoData.features[0].geometry.coordinates;
        listing.geometry = { type: "Point", coordinates: [lng, lat] };
      } else {
        req.flash("error", "Unable to get coordinates for this location");
        return res.redirect(`/listings/${id}/edit`);
      }
    }

    // Update all other fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = newLocation;
    listing.country = req.body.listing.country;
    listing.category = req.body.listing.category;

    // Update image if uploaded
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.searchNearby = async (req, res) => {
  let { lng, lat, radius } = req.query;

  lng = parseFloat(lng);
  lat = parseFloat(lat);

  const maxDistance = radius ? parseInt(radius) : 1000000;

  if (!lng || !lat) {
    req.flash("error", "Location required!");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    geometry: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  console.log("Listings found:", listings.length);

  if (listings.length === 0) {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", {
      allListings,
      noResults: true,  
    });
  }

  res.render("listings/index.ejs", {
    allListings: listings,
    noResults: false,
  });
};