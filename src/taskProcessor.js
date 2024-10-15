// src/taskProcessor.js
const fs = require('fs');
const path = require('path');
const Task = require('./models/taskModel');

// Function to log task completion in the file
async function logTaskCompletion(user_id) {
    const logMessage = `${user_id} - task completed at - ${new Date().toISOString()}\n`;
    console.log(logMessage);

    const logFilePath = path.join(__dirname, '../logs/task_logs.txt');
    fs.appendFileSync(logFilePath, logMessage);
}

// Function to process the queued tasks and handle rate limiting
async function processTaskQueue(user_id, queue) {
    while (queue.length > 0) {
        try {
            // Fetch the last task time for rate limiting
            const lastTask = await Task.findOne({ user_id }).sort({ completedAt: -1 });

            if (lastTask && (Date.now() - new Date(lastTask.completedAt).getTime()) < 1000) {
                console.log(`Rate limit exceeded for user ${user_id}. Retrying in 1 second...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }

            // Log task completion
            await logTaskCompletion(user_id);

            // Store the completed task in MongoDB
            await Task.create({
                user_id,
                completedAt: new Date(),
            });

            // Remove the processed task from the queue
            queue.shift();

            // Wait 1 second before processing the next task
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            console.log(`Error processing task for user ${user_id}:`, err);
        }
    }
}

module.exports = processTaskQueue;
