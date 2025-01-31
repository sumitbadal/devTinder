const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).send(`Invalid Credentials`);
        }

        const decodeObj = await jwt.verify(token, "DEV@sumit");
        const { _id } = decodeObj;
        const user = await User.findById(_id);
        if(!user) throw new Error("User not found");
        // console.log(`Logged in user: ${user} ${_id}`, req.cookies);
        req['user'] = user;
        next();
    } catch(error) {
        res.status(400).send(`Error on Authentication: ${error.message}`);
    }
};

module.exports = {
    userAuth,
};