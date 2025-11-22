const db = require('../db/database');
async function addTestcases(testcase){
    try {
        console.log("recieved req call");
        await db('testcases').insert({
            problem_id: testcase.problem_id,
            input: testcase.input,
            expected_output: testcase.expected_output
        });
    }catch(error){
        throw error;
    }
}

module.exports = {addTestcases};