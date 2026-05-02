const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

let io; // important

function initIO() {
    io = new Server(server, {
        cors: {
            origin: `${process.env.CLIENT_ORIGIN_URL}`,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        socket.on("join-room", ({roomCode, user_id}) => {
            socket.join(roomCode);
            console.log("user", user_id, "joined room:", roomCode);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error("IO not initialized");
    return io;
}

module.exports = { app, server, initIO, getIO };