const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/MajorProject";

main()
  .then(() => {
    console.log("connected to DB");
  }) 
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner : new mongoose.Types.ObjectId("678d1194b648ca2b22135455") })); //map give a new array with added owner property inside each individual listing object of sampledata
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
