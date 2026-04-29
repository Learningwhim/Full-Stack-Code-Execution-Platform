
const { io } = require('../socket-server')
async function triggerLeaderboardBroadcast(roomCode, newLeaderboardData){
    try {
        console.log("Service working");
        console.log("EMITTING TO ROOM:", roomCode);
        //console.log(roomCode, newLeaderboardData);
        //io.to(roomCode).emit('leaderboardUpdate', newLeaderboardData);
        io.emit('leaderboardUpdate', newLeaderboardData);
    }catch(error){
        throw error;
    }
}
module.exports = {triggerLeaderboardBroadcast}