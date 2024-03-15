const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/posts')
    .then( () => {
        console.log('Post database was connected successfully');
    })
    .catch( (error) => {
        console.log(error.message);
    });

app.listen(3003, () => {
    console.log('Post service is running at port 3003');
});