const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    slug: String,
    name: String
});

module.exports = mongoose.model('Category', categorySchema);