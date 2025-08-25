const util = require('util');
const {exec} = require('child_process');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const db = require('./database');

async function processSubmissions(){
    try { // take 1 row while updating its status in fcfs priority
        const job = await db('submissions').update({status: "In Progress"}).where('submission_id', function (){
            this.select('submission_id').from('submissions').where('status', 'Pending').orderBy('submission_id', 'asc').limit(1);
        }).returning('*');
        if(job.length > 0){
            const current_job = job[0];
            const problem = await db('problems').where('problem_id',current_job.problem_id).first();
            const testcase = await db('testcases').where('problem_id', current_job.problem_id).first();
            if(!problem) console.error({error: "Problem not found"});
            else {
            // make a temporary path for directory
            const submission_dir = path.join(__dirname,'temp', `${current_job.submission_id}`);
            // ab  make a directory 
            fs.mkdirSync(submission_dir, {recursive: true});
            const filepath = path.join(submission_dir, 'main.cpp');
            fs.writeFileSync(filepath, (current_job.code).replace(/\\n/g, '\n'));
            const inputFilePath = path.join(submission_dir, 'input.txt');
            fs.writeFileSync(inputFilePath, (testcase.input || '').trim().replace(/\r\n/g, '\n'));
             const dockerCommand = `docker run --rm --memory=${problem.memory_limit}m -v "${submission_dir}":/app -w /app --network none cpp-runner sh -c "g++ main.cpp -o main && ./main  < input.txt"`;
            console.log("--- FILE VERIFICATION ---");
                try {
                    const files = fs.readdirSync(submission_dir);
                    console.log("Files in temp dir:", files);
                    const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
                    console.log("Content of input.txt:", `"${inputFileContent}"`);
                } catch (e) {
                    console.log("Error reading verification files:", e);
                }
                console.log("-------------------------");
            console.log("DEBUG: Executing Docker Command:", dockerCommand);
            console.log(`Starting execution for job #${current_job.submission_id} with time limit: ${problem.time_limit}s`);
                try{
                        const { stdout, stderr } = await Promise.race([
                            execPromise(dockerCommand),
                            new Promise((_, reject) => {
                                setTimeout(() => {
                                reject(new Error('Time Limit Exceeded'));
                                }, problem.time_limit * 1000);
                            })
                            ]);
                        if(stderr){
                        await db('submissions').update({status: "RunTime Error"}).where('submission_id', current_job.submission_id);
                        }
                        else{
                            const code_output = stdout.trim().replace(/\r\n/g, '\n');
                            
                            const expected_output = (testcase.expected_output).trim().replace(/\r\n/g, '\n');
                            // ADD THESE LOGS
                                console.log("--- JUDGE DEBUG ---");
                                console.log("Raw STDOUT from code:", `"${stdout}"`);
                                console.log("Raw Expected from DB:", `"${testcase.expected_output}"`);
                                console.log("Normalized STDOUT:", `"${code_output}"`);
                                console.log("Normalized Expected:", `"${expected_output}"`);
                                console.log("-------------------");
                            if(code_output == expected_output){
                                await db('submissions').update({status: 'Accepted'}).where('submission_id', current_job.submission_id);
                            }
                            else await db('submissions').update({status: 'Wrong Answer'}).where('submission_id', current_job.submission_id);

                        }
                    }
                        
            catch(error){
                let status = 'Compilation Error';
                let output = error.stderr;
                if (error.message.includes('Time Limit Exceeded')) {
                    status = 'Time Limit Exceeded';
                    output = error.message;
    }
                await db('submissions').update({status: status, output: output}).where('submission_id', current_job.submission_id);
            }
        }

        }
        else if(job.length == 0) console.log("No Pending submissions found");
    }catch(error){
        console.error(error);
    }
}

setInterval(processSubmissions , 5000);