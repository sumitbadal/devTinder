const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
    },
    {timestamps: true}
);

const chatSchema = new mongoose.Schema({
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ]
    },
    messages: [messageSchema]
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;