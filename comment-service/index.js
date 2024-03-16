const express = require('express');
const mongoose = require('mongoose');

const { connectRabbitMQ } = require('./config/rabbitMqConfig');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/comments')
    .then( () => {
        // console.log('Comment database was connected successfully');
        console.log(`
        ==================================================
          MongoDB Database Configured - Comment Database
        ==================================================
    `);
    })
    .catch( (error) => {
        console.log(error.message);
    });

connectRabbitMQ();    

app.listen(3002, () => {
    console.log(`
        ================================================
                    Comment Service Microservice
                        Version: 1.1.1
        ================================================
    `);
});