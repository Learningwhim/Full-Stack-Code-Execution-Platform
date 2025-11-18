
const { io } = require('../socket-server')
async function triggerLeaderboardBroadcast(roomCode, newLeaderboardData){
    try {
        console.log("Service working");
        //console.log(roomCode, newLeaderboardData);
        io.to(roomCode).emit('leaderboardUpdate', newLeaderboardData);
    }catch(error){
        throw error;
    }
}
module.exports = {triggerLeaderboardBroadcast}