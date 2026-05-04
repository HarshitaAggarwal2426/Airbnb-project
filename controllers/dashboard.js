const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderDashboard = async (req, res) => {
  const userId = req.user._id;

  // user bookings
  const userBookings = await Booking.find({ user: userId })
    .populate("listing");

  // host bookings
  const userListings = await Listing.find({ owner: userId });
  const isOwner = userListings.length > 0;
  const listingIds = userListings.map(l => l._id);

  const hostBookings = await Booking.find({
    listing: { $in: listingIds }
  }).populate("listing").populate("user");

  res.render("dashboard/index", { userBookings, hostBookings, isOwner });
};

module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  const today = new Date();

  // ❌ prevent cancelling past bookings
  if (booking.checkIn < today) {
    req.flash("error", "Cannot cancel past bookings");
    return res.redirect("/dashboard");
  }

  await Booking.findByIdAndDelete(id);

  req.flash("success", "Booking cancelled");
  res.redirect("/dashboard");
};

// module.exports.cancelBooking = async (req, res) => {
//   const { id } = req.params;

//   await Booking.findByIdAndDelete(id);

//   req.flash("success", "Booking cancelled");
//   res.redirect("/dashboard");
// };