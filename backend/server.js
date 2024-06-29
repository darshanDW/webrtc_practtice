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


        if (type === "sender") {
            console.log("sender join")
            socket.on('create-offer', offer => {
                console.log("offer created")
                socket.broadcast.to(roomId).emit('receive-offer', offer);
                console.log("offer send")
            });

        }
        else { console.log("reciever join"); }
        socket.on('create-answer', answer => {
            console.log("answer created")
            socket.broadcast.to(roomId).emit('receive-answer', answer);
            console.log("answer send");

        })
        socket.on('ice-candidate', candidate => {
            console.log("candidate created");
            socket.to(roomId).emit('recieve-candidate', candidate);
            console.log("candidate send")
        })

        socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
    });

}); 
