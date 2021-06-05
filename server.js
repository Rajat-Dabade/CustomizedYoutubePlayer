const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);


app.get('/playVideo', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
    socket.on('data', (data) => {
        io.emit('data', data);
    });
});


server.listen(3000, () => {
    console.log('Listening on port 3000');
})
