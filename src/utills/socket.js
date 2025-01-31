const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');

let io;
const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join("_"))
        .digest('hex');
}

function initializeSocket(server) {
    io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle event here
        socket.on("joinChat", ({firstName, userId, targetUserId}) =>{
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(`${firstName} joining room ${roomId}`); 
            socket.join(roomId);
        })
        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) =>{
            
            try{
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(`sending message to room ${roomId}`);

                // Save message to database
                let chat = await Chat.findOne({
                    participants: {
                        $all: [userId, targetUserId]
                    }
                });

                if(!chat){
                    console.log(`if`)
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }else{
                    console.log(`else`, !chat.messages)
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();
                io.to(roomId).emit("messageReceived", {firstName, text});
            } catch(error){
                console.log(error);
            }

        });

        socket.on('disconnect', () => {
            // console.log('User disconnected');
        });

        // Add your custom socket event handlers here
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIO
};