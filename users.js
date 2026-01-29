const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser =await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
        });
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    }catch(e){
        req.flash("error","this username is already taken please use different username");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=async (req,res)=>{
    res.render("users/login.ejs");    
};

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome!  You are loged in");
    let redirect = res.locals.redirectUrl || "/listings";  //direct login karne par is isLoggedIn wala middleware trigger nhi hua matlab res.locals.redirectUrl mein redirectUrl undefined hai kyunki originalUrl save hi nhi hua
    res.redirect(redirect);   //login hone per passport by default session object ko reset kar dega
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Yoy are logged out!");
        res.redirect("/listings");
    }); 
};