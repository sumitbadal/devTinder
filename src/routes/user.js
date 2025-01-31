const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        // }).populate("fromUserId", ["firstName", "lastName"]);
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    } catch(error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: error.message });
    }
});

userRouter.get("/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        console.log(connectionRequests);
        const data = connectionRequests.map((raw) => {
            if(raw.fromUserId._id.toString() === loggedInUser._id.toString()){
                return raw.toUserId;
            }
            return raw.fromUserId;
        });

        res.json({ data });
    } catch(error) {
        res.status(400).send({message: error.message});
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
         
        const connectionRequests =  await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");
        
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((ele) => {
            hideUserFromFeed.add(ele.fromUserId.toString());
            hideUserFromFeed.add(ele.toUserId.toString());
        });

        const users = await User.find({
            $and: [ 
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id }} 
            ]
        }).select(USER_SAFE_DATA).skip((page - 1) * limit).limit(limit);
        res.send(users);
    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = userRouter;