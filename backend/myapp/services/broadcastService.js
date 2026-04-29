const { getIO } = require('../socket-server');

async function triggerLeaderboardBroadcast(roomCode, newLeaderboardData){
    try {
        const io = getIO(); // mandatory

        console.log("Service working");
        console.log("EMITTING TO ROOM:", roomCode);
        console.log("clients:", io.engine.clientsCount);

        io.to(roomCode).emit('leaderboardUpdate', newLeaderboardData);

    } catch(error){
        console.error(error);
    }
}

module.exports = { triggerLeaderboardBroadcast };