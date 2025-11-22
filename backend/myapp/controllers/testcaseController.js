const { addTestcases } = require('../services/testcaseService');
const createTestcase = async (req, res) => {
    try {
        console.log("recieved req ");
    const testcase = req.body;
    await addTestcases(testcase);
    }catch(error){
        res.status(500).json({error: "Failed to add testcase"});
    }
    
}
module.exports = {createTestcase};