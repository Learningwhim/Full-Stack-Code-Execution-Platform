const db = require('../db/database');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);

async function createRoomService(problemIds,user_id){
    return await db.transaction(async trx => {
        try {
        console.log("controller");
        const room_code = nanoid();
        const [response] = await trx('rooms').insert({
            room_code: room_code,
            creator_id: user_id
        }).returning('*');
        await Promise.all(problemIds.map((problem_id) => 
            trx('room_problems').insert({
                room_id: response.room_id,
                problem_id: problem_id,
            })
        ));
        console.log(room_code);
        return room_code;
    }catch(error){
        console.error('Failed to create room');
        throw error;
    }
    });
}

async function joinRoomService(user_id, roomCode){
    try {
        const room = await db('rooms').where({room_code: roomCode}).first();
        console.log(room);
        if(room){
            const alreadyexists = await db('room_participants').where({room_id: room.room_id, user_id: user_id}).first();
            if(!alreadyexists)
            await db('room_participants').insert({
                room_id: room.room_id,
                user_id: user_id
            });
        }
        else{
            
            throw new Error("room not found");
        }
        return room;
    }catch(error){
        console.error(error);
        throw error;
    }
}
async function getRoomService(roomCode){
    try{
        console.log("service hit hua");
        const room = await db('rooms').where({room_code: roomCode}).first();
        if(!room) return null;
        const [room_problems, room_participants] = await Promise.all([
        db('room_problems').where({room_id: room.room_id}).join('problems','room_problems.problem_id', 'problems.problem_id').select(
                                                                                                                                    'room_problems.problem_id',
                                                                                                                                    'problems.title',
                                                                                                                                    'problems.statement',
                                                                                                                                    'problems.time_limit',
                                                                                                                                    'problems.memory_limit'
                                                                                                                                    ),
        db('room_participants').where({ room_id: room.room_id }).join('users', 'room_participants.user_id', 'users.user_id').select(
                                                                                                        'room_participants.participant_id',
                                                                                                        'room_participants.score',
                                                                                                        'room_participants.total_time',
                                                                                                        'users.email'
                                                                                                    )
        ]);                                                                                           
        const roomConcatenated = {
            roomDetails: room,
            room_problems: room_problems,
            room_participants: room_participants
        }                                                                                                
        return roomConcatenated;
    }catch(error){
        console.error("room not found");
        throw error;
    }
}
async function getleaderboardForRoomService (room_id) {
    try {
        return await db('room_participants').where({ 'room_participants.room_id': room_id }).join('users', 'room_participants.user_id', 'users.user_id').select(
                                                                                                        'room_participants.participant_id',
                                                                                                        'room_participants.score',
                                                                                                        'room_participants.total_time',
                                                                                                        'users.email'
                                                                                                    ).orderBy('room_participants.score','desc');
    }catch(error){
        console.error(error);
        throw error;
    }
}

module.exports = {createRoomService,joinRoomService, getRoomService, getleaderboardForRoomService};