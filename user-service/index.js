const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const { consumeDataCreatePost, consumeDataDeletePost } = require('./config/consumeRabbitMQ');

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/users')
    .then( () => {
        // console.log('User database was connected successfully');
    console.log(`
        ==================================================
           MongoDB Database Configured - User Database
        ==================================================
    `);
    })
    .catch( (error) => {
        console.log(error.message);
    });

consumeDataCreatePost();
consumeDataDeletePost();

app.listen(3001, () => {
    // console.log('User service is running at port 3001');
    console.log(`
        ================================================
                    User Service Microservice
                        Version: 1.1.1
        ================================================
    `);
});