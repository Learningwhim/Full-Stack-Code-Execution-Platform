const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/submit', (req,res) => {
    console.log(req.body);
    res.json({status: "Pending..."});
});

app.get('/status/:submission_id', (req,res)=> {
    res.json({"status": "Processing...", "id_checked": req.params.submission_id});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});