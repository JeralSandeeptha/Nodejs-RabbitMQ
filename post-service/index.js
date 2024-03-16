const express = require('express');
const mongoose = require('mongoose');

const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/post/', postRoutes);

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


