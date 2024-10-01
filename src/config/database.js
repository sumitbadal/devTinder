const mongoose = require("mongoose");

// const connectDB = async () => {
//     await mongoose.connect("mongodb+srv://saimsumitindia:0arrScn4FRME1QC0@namastenodejs.xyuzf.mongodb.net/");
// }

// connectDB()
//     .then( () => {
//         console.log("DB connected successfully");
//     })
//     .catch((error) => {
//         console.log(error);
//     });

const mongoDBURI = "mongodb+srv://saimsumitindia:0arrScn4FRME1QC0@namastenodejs.xyuzf.mongodb.net/testApi";
mongoose.connect(mongoDBURI)
  .then(() => console.log('Connected!'));

