const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;

  const listing = await Listing.findById(id).populate("bookings");

  const checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0);
  const checkOutDate = new Date(checkOut);
  checkOutDate.setHours(0, 0, 0, 0);

 const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkInDate < today) {
    req.flash("error", "Cannot book a date in the past!");
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Validate dates
  if (checkInDate >= checkOutDate) {
    req.flash("error", "Invalid date selection");
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Prevent owner booking
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listings/${id}`);
  }

const existingBooking = await Booking.findOne({
  listing: id,
  user: req.user._id,
});

if (existingBooking) {
  req.flash("error", "You already booked this listing");
  return res.redirect(`/listings/${id}`);
}

const isBooked = await Booking.findOne({
  listing: id,
  checkIn: { $lt: checkOutDate },
  checkOut: { $gt: checkInDate },
}); 

  if (isBooked) {
    req.flash("error", "Selected dates are already booked!");
    return res.redirect(`/listings/${id}`);
  }

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
  });

  await newBooking.save();

  listing.bookings.push(newBooking);
  await listing.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};