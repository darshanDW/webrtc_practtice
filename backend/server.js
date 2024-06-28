const express = require('express');
const app = express();
const port = 3001;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", socket => {
    console.log("socket connected");

    socket.on("join-room", ({ roomId, type }) => {
        socket.join(roomId);
        console.log(`${type} joined room ${roomId}`);

        if (type === "sender") {
            socket.on('create-offer', offer => {
                console.log(`Offer from sender in room ${roomId}:`, offer);
                socket.broadcast.to(roomId).emit('receive-offer', offer);
            });

        }
        socket.on('create-answer', answer => {
            console.log(1);
            console.log(answer);
            socket.broadcast.to(roomId).emit('receive-answer', answer);

        })

        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    });
});
