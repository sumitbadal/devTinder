const express = require("express");
const mongoose = require("mongoose");
const app = express();

const mongoDBURI = "mongodb+srv://sumit:9534149147@cluster0.zucyuib.mongodb.net/";
mongoose.connect(mongoDBURI)
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('Connection error:', err));


app.get("/test", (req, res)=> {
    res.send("Hi this is test");
})
app.listen(3000, () => {
    console.log(`Server running on 3000 port`);
});