const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: {
        type: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } ],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);