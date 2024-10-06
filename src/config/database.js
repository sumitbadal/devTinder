const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sumit:9534149147@cluster0.zucyuib.mongodb.net/testApi");
}

module.exports = connectDB;

