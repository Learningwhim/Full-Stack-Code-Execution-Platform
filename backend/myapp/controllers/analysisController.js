const analyzeService = require('../services/analysisService');

const analyzeController = async( req, res) => {
    try{
        const code = req.body.code;
        console.log(code);
        const response = await analyzeService(code);
        res.json(response);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "failed to send anaylze req"});
    }
}

module.exports = analyzeController;
