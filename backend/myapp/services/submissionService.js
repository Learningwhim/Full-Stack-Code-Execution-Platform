const db = require("../db/database");
async function addSubmission(submission) {
    try {
        const result = await db('submissions').insert({
            problem_id: submission.problem_id,
            user_id: submission.user_id,
            code: submission.code,
            language: submission.language,
            status: "Pending",
        }).returning('submission_id'); 
        return result;
    }
    catch(error){
        console.error("server error");
        throw error;
    }
}
module.exports = addSubmission;