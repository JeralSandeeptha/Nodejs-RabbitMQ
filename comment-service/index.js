const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/comments')
    .then( () => {
        console.log('Comment database was connected successfully');
    })
    .catch( (error) => {
        console.log(error.message);
    });

app.listen(3002, () => {
    console.log('Comment service is running at port 3002');
});