const WebSocket = require('ws');
const ip = require('ip');
const path = require('path');
const express = require('express');

// Create Express app for serving static files
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;
const HTTP_PORT = 3000;

// Start HTTP server for the UI
app.listen(HTTP_PORT, () => {
    console.log(`\n🌐 UI is available at: http://localhost:${HTTP_PORT}`);
});

// WebSocket server setup
const server = new WebSocket.Server({ port: PORT });

console.log('\n🚀 WebSocket Server is running!');
console.log(`\nConnection Information:`);
console.log(`IP Address: ${ip.address()}`);
console.log(`Port: ${PORT}`);
console.log(`\nClients can connect using: ws://${ip.address()}:${PORT}`);

server.on('connection', (socket) => {
    console.log('\n✨ New client connected!');

    socket.on('message', (message) => {
        console.log(`📩 Received: ${message}`);
        
        // Echo back the message to confirm receipt
        socket.send(`Server received: ${message}`);
    });

    socket.on('close', () => {
        console.log('❌ Client disconnected');
    });
});

// Error handling
server.on('error', (error) => {
    console.error('WebSocket Server Error:', error);
});