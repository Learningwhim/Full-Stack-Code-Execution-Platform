const { findUserByEmailService,  createUserService } = require('../services/authService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createUserController = async (req, res) => {
    try {
        const { email, password }= req.body;
            const user = await findUserByEmailService(email);
            if(!user){
            const passwordHash = await bcrypt.hash(password, 10);
            await createUserService(email, passwordHash);
            res.status(201).json({message: "Account created succesfully"});
            }
            else{
                res.status(409).json({message : "Account with this email already registered"});
            }
    }catch(error){
        console.error("Failed to create account");
        res.status(500).json({error: "Failed to create account"});
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await findUserByEmailService(email);
        if(user){
            const hash = user.password_hash;
            if(await bcrypt.compare(password, hash)){
                const secret = process.env.JWT_SECRET;
                const userDetails = {user_id: user.user_id, email: email};
                const token = jwt.sign(userDetails,secret);
                res.status(200).send(token);
            }else{
                res.status(401).json({error: "Incorrect password"});
            }
        }else{
            console.error("User not found");
            res.status(401).json({error: "Reference error"});
        }
        
    }catch(error){
        res.status(500).json({error: "Failed to fetch user data"});
    }
}

module.exports = {createUserController, loginUser};