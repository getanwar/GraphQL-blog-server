const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    email: String, 
    postId: String,
    website: String,
    authorId: String,
    comment: String
});

module.exports = mongoose.model('Comment', commentSchema);