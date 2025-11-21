const { triggerLeaderboardBroadcast } = require('../services/broadcastService');

const handleWorkerbroadcast = async (req, res) => {
    try{
        const roomCode = req.body.roomCode;
        const newLeaderboardData = req.body.newLeaderboardData
        console.log("Controller working");
        const response = await triggerLeaderboardBroadcast(roomCode, newLeaderboardData);
        if(response.ok){
            res.status(200).json("OK");
        }
        else throw error;
    }catch(error){
        res.status(500).json({error: "unable to put service req"});
    }
}

module.exports = {handleWorkerbroadcast}