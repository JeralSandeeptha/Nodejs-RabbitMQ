const express = require('express');
const mongoose = require('mongoose');

const commentRoutes = require('./routes/commenRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1/comment', commentRoutes);

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

app.listen(3002, () => {
    console.log(`
        ================================================
                    Comment Service Microservice
                        Version: 1.1.1
        ================================================
    `);
});