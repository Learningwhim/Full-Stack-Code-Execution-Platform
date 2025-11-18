const express = require('express');
const http = require('http');
const app = express();
const PORT =  3000;

const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: `${process.env.CLIENT_ORIGIN_URL}`,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);
    socket.on("join-room", ({roomCode, user_id}) => {
        socket.data.userId = user_id;
        socket.join(roomCode);
        console.log("user ", user_id, " Joined room: ",roomCode);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected ");
    });
});


module.exports = { app, io, server }; 
