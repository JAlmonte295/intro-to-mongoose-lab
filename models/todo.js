const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: String,
    Number: Number,
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;