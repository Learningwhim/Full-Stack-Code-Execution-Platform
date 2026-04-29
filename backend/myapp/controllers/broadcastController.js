const { triggerLeaderboardBroadcast } = require('../services/broadcastService');

const handleWorkerbroadcast = async (req, res) => {
    try {
        const { roomCode, newLeaderboardData } = req.body;
        console.log("BODY:", req.body);
        console.log("Controller working");
        console.log("HTTP INSTANCE:", process.pid);
        await triggerLeaderboardBroadcast(roomCode, newLeaderboardData);

        res.status(200).json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "unable to broadcast" });
    }
};

module.exports = {handleWorkerbroadcast}