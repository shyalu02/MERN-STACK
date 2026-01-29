const express = require("express");
const router = express.Router({mergeParams: true});// id aa rhi hai parent se
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js");

//Review post route
router.post("/",            // "/"" this is child path
    isLoggedIn,
    validateReview,
    wrapAsync(reviewControllers.createReview));

//Review delete route

router.delete("/:reviewId",  // "/:reviewId" this is child path
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview));

module.exports = router;