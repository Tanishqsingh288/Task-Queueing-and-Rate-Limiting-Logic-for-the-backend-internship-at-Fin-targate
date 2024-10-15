// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const taskProcessor = require('./taskProcessor'); // Import task processing logic
const Task = require('./models/taskModel'); // Import the task model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskQueue', { useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Initialize task queues (will be used per user)
const taskQueues = {};

const app = express();
app.use(express.json());

// POST route for submitting tasks
app.post('/task', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Initialize task queue for user if it doesn't exist
    if (!taskQueues[user_id]) {
        taskQueues[user_id] = [];
    }

    // Add the task to the queue and process it
    taskQueues[user_id].push({ taskId: Date.now() });

    taskProcessor(user_id, taskQueues[user_id]);
    res.status(202).json({ message: 'Task queued successfully' });
});

// Start server on port 4000
app.listen(4000, () => {
    console.log('Server running on port 4000');
});
