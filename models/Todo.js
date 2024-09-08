const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: { type: String, required: true },
    date: { type: String, required: true },
    is_checked: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
