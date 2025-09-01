const db = require('../db/database');

async function findUserByEmailService(email){
    try {
        const response = await db('users').where('email', email).returning('*').first();
        return response;
    }catch(error){
        throw error;
    }
}

async function createUserService(email, passwordHash){
    try{
        await db('users').insert({
            email: email,
            password_hash: passwordHash
        });
    }catch(error){
        console.error("Failed to create user");
        throw error;
    }
}

module.exports = { findUserByEmailService , createUserService};