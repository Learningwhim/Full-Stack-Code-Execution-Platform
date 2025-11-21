const util = require('util');
const {exec} = require('child_process');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const db = require('./db/database');
const { io } = require('./socket-server');
const { getleaderboardForRoomService } = require('./services/roomService');
async function processSubmissions(){
    try { // take 1 row while updating its status in fcfs priority
        const job = await db('submissions').update({status: "In Progress"}).where('submission_id', function (){
            this.select('submission_id').from('submissions').where('status', 'Pending').orderBy('submission_id', 'asc').limit(1);
        }).returning('*');
        if(job.length > 0){
            const current_job = job[0];
            const problem = await db('problems').where('problem_id',current_job.problem_id).first();
            const testcase = await db('testcases').where('problem_id', current_job.problem_id).first();
            console.log("Current job:", current_job);
            console.log("Room ID:", current_job.room_id);
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
             const dockerCommand = `docker run --rm --memory=${problem.memory_limit}m -v "${submission_dir}":/app -w /app --network none learningwhim/cpp-runner:latest sh -c "g++ main.cpp -o main && ./main  < input.txt"`;
             //const dockerCommand = `docker run --rm cpp-runner echo "hello"`;
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
                                }, (problem.time_limit * 1000)+1500);
                            })
                            ]);
                        if(stderr){
                        await db('submissions').update({status: "RunTime Error"}).where('submission_id', current_job.submission_id);
                        }
                        else{
                            const code_output = stdout.trim().replace(/\r\n/g, '\n');
                            
                            const expected_output = (testcase.expected_output).trim().replace(/\r\n/g, '\n');
                            if(code_output == expected_output){
                                await db('submissions').update({status: 'Accepted'}).where('submission_id', current_job.submission_id);
                                const time_now = new Date().getTime();
                                console.log("time");
                                console.log(time_now);
                                if(current_job.room_id){
                                    try {
                                        const time_now = Date.now();
                                        const room = await db('rooms')
                                            .where({ room_id: current_job.room_id })
                                            .first();

                                        await db('room_participants')
                                            .where({ room_id: current_job.room_id, user_id: current_job.user_id })
                                            .increment('score', 10)
                                            .update({ total_time: time_now - new Date(room.created_at).getTime() });

                                        const newLeaderboardData = await getleaderboardForRoomService(current_job.room_id);

                                        console.log("EMITTING → Room:", current_job.roomCode);
                                        const roomCode = current_job.roomCode;
                                        const response = await fetch(`${process.env.VITE_API_URL}/broadcastUpdate`, {
                                            method: 'POST',
                                            headers: {'Content-type': 'application/json'},
                                            body: JSON.stringify({roomCode, newLeaderboardData})
                                        });
                                        //if(!response.ok) throw err;


                                    } catch (err) {
                                        console.error("EMIT ERROR:", err);
                                    }

                                }
                            }
                            else await db('submissions').update({status: 'Wrong Answer'}).where('submission_id', current_job.submission_id);

                        }
                    }
                        
            catch(error){
                console.error("Error arha idhar"+ error);
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