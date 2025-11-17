const express = require('express');
const http = require('http');
const app = express();
const PORT =  3000;

const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);

    socket.on("join-room", ({userId, roomCode}) => {
        socket.data.userId = userId;
        socket.join(roomCode);
        console.log("user ", userId, " Joined room: ",roomCode);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected ");
    });
});

module.exports = { app, io, server }; 
