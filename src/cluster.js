// src/cluster.js
const cluster = require('cluster');
const os = require('os');
const app = require('./server'); // Import the server logic

const numCPUs = 2; // Number of replicas (2 worker processes)

if (cluster.isMaster) {
    console.log(`Master process is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // If a worker dies, log and restart it
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Run the server in worker processes
    console.log(`Worker ${process.pid} started`);
    app();
}
