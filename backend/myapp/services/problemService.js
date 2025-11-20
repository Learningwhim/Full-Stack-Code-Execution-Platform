const db = require("../db/database");
const {redis} = require('../config/redis');

async function getProblems(){
    try {
        // await redis.set("test:key", "hello");

        // const value = await redis.get("test:key");
        // console.log("Redis says:", value);

        const key = 'allProblems';
        let cached = await redis.get(key);
        if(cached) return JSON.parse(cached);

        const problems = await db('problems').select('problem_id','title');
        await redis.set(key, JSON.stringify(problems), {
            EX: 300,
        });
        return problems;
    }catch(error){
        console.error("ACTUAL ERROR IN getProblems():", error);
    throw error;
    }
    
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
        const key = `problem${problem_id}`;
        let cached = await redis.get(key);
        console.log(cached);
        if(cached) return JSON.parse(cached);

        const problem = await db('problems').where('problem_id', problem_id).select('*').first();
        console.log("redis se nai uthaya");
        await redis.set(key, JSON.stringify(problem), {
            EX: 300,
        })
        return problem;
    }catch(error){
        throw error;
    }
}


module.exports = {addProblem, getProblems, getProblemByIdService};