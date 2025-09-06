const { createRoomService, getRoomService} = require('../services/roomService');

const createRoomController = async (req , res) => {
    try {
        const user_id = req.user.user_id;
        const {problemIds} = req.body;
        const room_code = await createRoomService(problemIds, user_id);
        res.status(201).json({ room_code: room_code });

    }catch(error){
        res.status(500).json({error: "failed to create room request"});
    }
}
const getRoomController = async (req , res) =>{
    try{
        const {room_code} = req.body;
        const room = await getRoomService(room_code);
        if(room){
            

        }else{
            alert("Invalid room code");
            res.status(404).json({error: "Invalid room code"})
        }
    }catch(error){
        res.status(500).json({error: "failed to get room"})
    }
}
module.exports = {createRoomController, getRoomController};
