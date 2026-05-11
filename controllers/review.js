const Listing = require("../models/listing");
const Review = require("../models/reviews");
const Booking = require("../models/booking");

module.exports.createReview = async (req, res) => {

  const { id } = req.params;

  //  check verified booking
  const booking = await Booking.findOne({
    listing: id,
    user: req.user._id,
  });

  if (!booking) {
    req.flash("error", "Only verified guests can review");
    return res.redirect(`/listings/${id}`);
  }

  //  prevent duplicate review
  const alreadyReviewed = await Review.findOne({
    author: req.user._id,
    _id: { $in: (await Listing.findById(id)).reviews }
  });

  if (alreadyReviewed) {
    req.flash("error", "You already reviewed this listing");
    return res.redirect(`/listings/${id}`);
  }
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
};
