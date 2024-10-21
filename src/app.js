const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173/",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

app.patch("/userUpdate/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try{
      const ALLOWED_UPDATES =[
        "about", "lastName", "gender", "skills"
      ];
  
      const isUpdateAllowed = Object.keys(data).every((k) => {
        ALLOWED_UPDATES.includes(k);
      });

      if(!isUpdateAllowed) throw new Error("Updates not allowed");
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
          returnDocument: "after",
          runValidators: true
      });
      console.log(user);
      res.send(`User updated successfully: ${user}`);
    } catch(error){
      res.status(400).send(`update Failed: ${error.message}`);
    }
});

connectDB().then( () => {
  console.log("DB connected successfully");
  app.listen(3000, () => {
      console.log(`Server running on 3000 port`);
  });
})
.catch((error) => {
  console.log(error);
});

app.get("/test", (req, res)=> {
    res.send("Hi this is test");
})
