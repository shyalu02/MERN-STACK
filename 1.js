const express = require("express");
const router = express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const ListingControllers = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
   .route("/")
   .get(wrapAsync(ListingControllers.index))
   .post(                                                     
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingControllers.createListing));
    
//new route
router.get("/new",isLoggedIn,ListingControllers.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(ListingControllers.showListing))
    .put(                                // "/:id" this is child path
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(ListingControllers.updateListing))
    .delete(                              // "/:id" this is child path
        isLoggedIn,
        isOwner,
        wrapAsync(ListingControllers.destroyListing));    

//edit Route
router.get(
    "/:id/edit",                           // "/:id/edit" this is child path
    isLoggedIn,
    isOwner,
    wrapAsync(ListingControllers.renderEditform));


module.exports = router;


/*    
//index route
router.get("/",wrapAsync(ListingControllers.index));             // "/" this is child path

//new route
router.get("/new",isLoggedIn,ListingControllers.renderNewForm);       // "/new" this is child path

//show route
router.get("/:id",wrapAsync(ListingControllers.showListing));       // "/:id" this is child path

//Create Route
router.post(
    "/",                                                          // "/" this is child path
    isLoggedIn,
    validateListing,
    wrapAsync(ListingControllers.createListing));

//edit Route
router.get(
    "/:id/edit",                           // "/:id/edit" this is child path
    isLoggedIn,
    isOwner,
    wrapAsync(ListingControllers.renderEditform));

//Update route 
router.put(
    "/:id",                                 // "/:id" this is child path
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(ListingControllers.updateListing));


//Delete route
router.delete(
    "/:id",                              // "/:id" this is child path
    isLoggedIn,
    isOwner,
    wrapAsync(ListingControllers.destroyListing));
*/
