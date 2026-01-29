if(process.env.NODE_EN !="production" ){              //NODE_EN it is new environment variable
  require("dotenv").config();
}

const express=require("express");
app=express();
const path=require("path");
const methodOverride=require("method-override");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const ExpressError=require("./util/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/MajorProject";

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);



const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600,          //in seconds refres karne par bbar bar sesssion update na ho 24 hours tak
})

store.on("error",()=>{
  console.log("Error in Mongo Store Session");
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
       expires: Date.now + 7 * 24*  60 * 60 * 1000,   // aaj se 7 din bad tak time in milli second
       maxAge: 7 * 24 * 60 * 60 * 1000,
       httpOnly: true,                        //to prevent cross-scripting attacks
  },
}; 


//home rout
// app.get("/",(req,res)=>{
//   res.send("Hello I am root");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{                  //only req.locals ko hi ejs tempelate mein access kar pate hai user,flash inko nhi
  res.locals.success = req.flash("success");  //succes,error,curUser are variable that ve created inside locals
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/registerUser", async (req, res) => {

  let fakeUser = new User({
  
  email: "student@gmail.com",
  
  username: "delta-student",  //username is automatically defined by passportLocalMongoose in schema
  
  });
  
  let newUser = await User.register(fakeUser, "helloworld");
  
  res.send(newUser);
  
  });

app.use("/listings",listingRouter);  //"/listings" this is parent path
app.use("/listings/:id/reviews",reviewRouter); //"/listings/:id/reviews" this parent path
app.use("/",userRouter);

//route for all other requests
app.get("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

//Eroor handler
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"}=err;  //deafault value error does not have any statuscode and message
    
    res.status(statusCode).render("error.ejs",{err})
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("listening at port 8080");
})

//authantication process of checking valid user hai ya nhi includes signup.lognin and logout process
//authorization is process of alowing which services a particular user can use