const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;
        if(authHeaders){
        const parts  = authHeaders.split(' ');
        if(parts[0] == 'Bearer'){
            const token = parts[1];
            const decodedPayload =  jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            // console.log("Header received:", req.headers.authorization);
            // console.log("Decoded User:", decodedPayload);

            next();
        }else{
            return res.status(401).json({error: "Unauthorized"});
            
        }
        }
        else { return res.status(401).json({error: "Unauthorized"}); }
    }catch(error){
        return res.status(401).json({error: "Unauthorized"});
        
    }
}

module.exports = authMiddleware;