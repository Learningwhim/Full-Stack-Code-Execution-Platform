const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dockerFileContent = `FROM ubuntu:22.04
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*
COPY main.cpp /app/
RUN g++ /app/main.cpp -o /app/my-program
CMD ["/app/my-program"]`;
function fetchPending(){
    db.all('SELECT * FROM submissions WHERE status="Pending"',[],(err,rows) => {
        if(err) return console.error(err);
       

        rows.forEach(submission => {
            console.log(`Pending submission ${submission.submission_id}`);
            db.run('UPDATE submissions SET status = "In Progress" WHERE submission_id = ?',[submission.submission_id],
                function(error){
                    if(error) console.error(error);  
                    const submission_dir = path.join(__dirname,'temp', submission.submission_id); //storing path abhi ke liye
                    fs.mkdirSync(submission_dir, {recursive: true}); // new directory create hoga if nai exist kr rha jisme store hoga 
                    const main_filepath = path.join(submission_dir, 'main.cpp');
                    fs.writeFileSync(main_filepath, submission.code); // ek code file create kr rhe main.cpp usme us submission ka code copy kr rhe 
                    const docker_filepath = path.join(submission_dir, 'Dockerfile');
                    fs.writeFileSync(docker_filepath, dockerFileContent);
                    const uniqueImageTag = submission.submission_id
                    exec(`docker build ${submission_dir} -t ${uniqueImageTag}`, (error, stdout, stderr) => {
                        if(error) return console.error(error);
                        else if(stderr) return console.error(stderr);
                        exec(`docker run --rm ${uniqueImageTag}`, (error,stdout,stderr)=>{

                        });
                    });
                }
                

            );
        });

    });
}

setInterval(fetchPending, 5000);