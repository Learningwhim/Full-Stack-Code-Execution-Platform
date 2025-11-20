const express = require('express');
// const http = require('http'); since hamne ye sab socker-server me shift kar diya
// const app = express();
const PORT =  3000;
const { app, io, server} = require('./socket-server');
// const { Server } = require('socket.io');
// const server = http.createServer(app);
// const io = new Server(server);
const { initRedis } = require("./config/redis.js");

//await initRedis();  // connect only once on startup

const cors = require('cors');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const testcaseRoutes = require('./routes/testcases');
const authRoutes = require('./routes/users');
const analysisRoute = require('./routes/analysis');
const authMiddleware = require('./middleware/authMiddleware');
const roomRoutes = require('./routes/rooms');
const broadcastRoute = require('./routes/broadcast');
app.use(cors({
    origin: `${process.env.CLIENT_ORIGIN_URL}`,
    methods: ["GET", "POST"]
}));
app.use(express.json());
 app.use(express.urlencoded({extended: true}));
app.use('/problems',problemRoutes);
app.use(submissionRoutes);
app.use(testcaseRoutes);
app.use('/auth', authRoutes);
app.use(analysisRoute);
app.use('/rooms', roomRoutes);
app.use(broadcastRoute);

async function startServer() {
    await initRedis();   // NOW allowed  
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();