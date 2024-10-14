const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)) return req.status(400).json({message: `Invalid status type: ${status}`});

        const toUser = await User.findById(toUserId);
        if(!toUser) return req.status(404).json({message: `User not found`});

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if(existingConnectionRequest) return req.status(400).json({message: `Connection Request already exists`});

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        res.json({
            message: `Connection request sent successfully`,
            data,
        });

    } catch (error) {
        res.status(400).send(`ERROR: ${error.message}`);
    }
});

module.exports = requestRouter;