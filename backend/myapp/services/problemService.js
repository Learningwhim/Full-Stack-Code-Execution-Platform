const db = require("../db/database");
async function getProblems(){
    const problems = await db('problems').select('problem_id','title');
    return problems;
}
async function addProblem(problem){ // inserts problem in db
        try {
            const result = await db('problems').insert({
                title: problem.title,
                statement: problem.statement,
                time_limit: problem.time_limit,
                memory_limit: problem.memory_limit,
            }).returning('*'); return result;
        }
        catch(error){
            console.error("Failed to add problem", error);
            throw error;
        }
}
async function getProblemByIdService(problem_id) {
    try {
        const problem = await db('problems').where('problem_id', problem_id).select('*').first();
        return problem;
    }catch(error){
        throw error;
    }
}


module.exports = {addProblem, getProblems, getProblemByIdService};