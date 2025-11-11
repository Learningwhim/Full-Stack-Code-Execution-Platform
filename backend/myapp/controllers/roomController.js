const { createRoomService, joinRoomService, getRoomService} = require('../services/roomService');

const createRoomController = async (req , res) => {
    try {
        console.log("hello");
        const user_id = req.user.user_id;
        const {problemIds} = req.body;
        const room_code = await createRoomService(problemIds, user_id);
        res.status(201).json({ room_code: room_code });
    }catch(error){
        res.status(500).json({error: "failed to create room request"});
    }
} 
const joinRoomController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const roomCode = req.body.roomCode;
        const room = await joinRoomService(user_id, roomCode);
        if(room) {
            res.status(201).json({roomCode: roomCode});
        }
        else res.status(404).json({error: "room not found"});
    }catch(error){
        console.error(error);
    res.status(500).json({error: "failed to join room"});
    }
}
const getRoomController = async (req , res) =>{
    try{
        const {room_code} = req.params;
        const room = await getRoomService(room_code);
        if(room){
            
        }else{
            res.status(404).json({error: "Invalid room code"})
        }
    }catch(error){
        res.status(500).json({error: "failed to get room"})
    }
}

module.exports = {createRoomController, joinRoomController, getRoomController};
