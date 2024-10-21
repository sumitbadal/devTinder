const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = re.user;

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
                {toUserId: loggedInUser_id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

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

module.exports = userRouter;