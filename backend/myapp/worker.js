

function fetchPending(){
    db.all('SELECT * FROM submissions WHERE status="Pending"',[],(err,rows) => {
        if(err) return console.error(err);

        rows.forEach(row => {
            console.log(`Pending submissions ${row.submission_id}`);
            row.status = "In Progress";
            db.run('UPDATE submissions SET status = "ACCEPTED" WHERE submission_id = ?',[row.submission_id],
                function(error){
                    if(error)
                }
            )
        });

    })
}

setInterval(fetchPending, 5000);