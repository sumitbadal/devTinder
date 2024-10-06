const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utills/validation");
const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        console.log(`Logged in user: ${user}`);
        res.send(`Reading Cookies, ${user}`);
    }catch(error){
        res.send(`Error: ${error.message}`);
    }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfile(req)) throw new Error("Updates not allowed, invalid edit request");
        
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        
        res.send(loggedInUser);
    } catch (error) {
        res.status(400).send(`ERROR: ${error.message}`);
    }
});

module.exports = profileRouter;