const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review.js");

let listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    // image: {
    //     filename:String,
    //     url:{
    //         type: String,
    //     default:"https://unsplash.com/photos/two-boats-are-in-the-water-near-a-sandy-beach-LA1JA3zjDdE",
    //     set: (v)=>
    //         v===""
    //         ?"https://unsplash.com/photos/two-boats-are-in-the-water-near-a-sandy-beach-LA1JA3zjDdE"
    //         :v,
    //         },
    //     },

    image: {
        url: String,
        filename : String,
        },

    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    
    reviews:[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Review", 
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    // geometry : {
    //     type: {
    //       type: String, // Don't do `{ location: { type: String } }`
    //       enum: ['Point'], // 'location.type' must be 'Point'
    //       required: true
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true
    //     }
    //   }
}); 

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
        console.log("From review model also deleted"); 
    }
}); 

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;