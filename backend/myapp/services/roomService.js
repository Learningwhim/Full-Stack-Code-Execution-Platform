const db = require('../db/database');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);

async function createRoomService(problemIds,user_id){
    return await db.transaction(async trx => {
        try {
        const room_code = nanoid();
        const response = await trx('rooms').insert({
            room_code: room_code,
            creator_id: user_id
        });
        
        await Promise.all(problemIds.map((problem_id) => 
            trx('room_problems').insert({
                room_id: response.room_id,
                problem_id: problem_id,
            })
        ));
        return room_code;
    }catch(error){
        console.error('Failed to create room');
        throw error;
    }
    });
    
}

module.exports = createRoomService;