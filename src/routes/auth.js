const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try{

    const hassPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hassPassword);

    const { emailId, firstName, lastName, gender, skills } = req.body;

    const user = new User({ emailId, password: hassPassword, firstName, lastName, gender, skills });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    console.log("Error check", error.message);
    res.send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try{
    const { emailId, password } = req.body;

    const user = await User.findOne({emailId: emailId});
    if(!user) throw new Error('Invalid Credentials');

    const isValidPassword = await user.validatePassword(password);
    if(isValidPassword){
      const token = await user.getToken();
      res.cookie("token", token);
      res.send("Login Successful");
    }else{
      throw new Error('Invalid Credentials');
    }
  } catch(error){
    res.send(`Error: ${error.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date((Date.now())),
  });

  res.send("Logout Successful");
});

module.exports = authRouter;