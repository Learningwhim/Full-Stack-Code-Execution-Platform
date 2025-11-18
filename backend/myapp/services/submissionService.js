const db = require("../db/database");
async function addSubmission(submission) {
    try {
        if(!submission.roomCode){
        const result = await db('submissions').insert({
            problem_id: submission.problem_id,
            user_id: submission.user_id,
            code: submission.code,
            language: submission.language,
            status: "Pending",
        }).returning('submission_id');
        return result;
        }else {
            const room = await db('rooms').where({ room_code : submission.roomCode}).select('room_id').first();
            if (!room) throw new Error(`No room with that roomCode: ${submission.roomCode} found!`);
            const result = await db('submissions').insert({
            problem_id: submission.problem_id,
            user_id: submission.user_id,
            code: submission.code,
            language: submission.language,
            status: "Pending",
            room_id: room.room_id,
            roomCode: submission.roomCode
        }).returning('submission_id');
        return result;
        }
        
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

async function getSubmissionStatusService (submission_id) {
  return await db("submissions")
    .where({ submission_id: submission_id })
    .select("status")
    .first();
};
module.exports = {addSubmission, getSubmissionStatusService};