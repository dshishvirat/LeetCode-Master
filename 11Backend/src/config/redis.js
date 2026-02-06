const { createClient } = require('redis')

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11459.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 11459
    }
});

module.exports = redisClient