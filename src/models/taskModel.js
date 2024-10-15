// src/models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    completedAt: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('Task', taskSchema);
