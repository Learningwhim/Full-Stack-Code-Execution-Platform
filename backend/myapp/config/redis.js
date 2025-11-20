//console.log("REDIS FILE LOADED:", import.meta.url);
console.log(">> USING REDIS FILE:", __filename);
const { createClient } = require('redis');
require("dotenv").config();

//import dotenv from 'env';
//const {dotenv} = require('dotenv');
//dotenv.config();

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.on('error', (err) => console.log("redis error: ", err));
redis.on('connect', () => console.log("Redis connected"));
async function initRedis() {
    await redis.connect();
}
// await redis.connect();

module.exports = {redis, initRedis};
