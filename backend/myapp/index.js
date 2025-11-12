const express = require('express');
const http = require('http');
const app = express();
const PORT =  3000;
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const cors = require('cors');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const testcaseRoutes = require('./routes/testcases');
const authRoutes = require('./routes/users');
const analysisRoute = require('./routes/analysis');
const authMiddleware = require('./middleware/authMiddleware');
const roomRoutes = require('./routes/rooms');

app.use(cors());
app.use(express.json());
 app.use(express.urlencoded({extended: true}));
app.use('/problems', problemRoutes);
app.use('/api',submissionRoutes);
app.use(testcaseRoutes);
app.use('/auth', authRoutes);
app.use(analysisRoute);
app.use('/rooms', roomRoutes);
io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);

    socket.on("join-room", ({userId, roomCode}) => {
        socket.data.userId = userId;
        socket.join(roomCode);
        console.log("user ", userId, " Joined room: ",room);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected ");
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
