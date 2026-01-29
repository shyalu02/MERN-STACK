const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn} = require("../middleware.js");

const userControllers = require("../controllers/users.js");

router
    .route("/signup")
    .get(userControllers.renderSignupForm)
    .post(wrapAsync(userControllers.signup));

router
    .route("/login")
    .get(wrapAsync(userControllers.renderLoginForm))
    .post(saveRedirectUrl,
        passport.authenticate("local",{    //local is type of method to authentiacate
            failureRedirect: "/login",     //fail hone par konse webpage show karna hai
            failureFlash: true,           //to show failure message
        }),
        wrapAsync(userControllers.login));    

router.get("/logout",userControllers.logout);

module.exports = router;