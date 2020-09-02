const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//Create a room id  
const { v4: uuidv4 } = require('uuid');
//Create a room id  
// peer to peer connection
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
})
// peer to peer connection
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection' , socket => {
socket.on('join-room', (roomId, userId) => {
    // console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('message', message =>{
     io.to(roomId).emit('createMessage', message)

    })
})
})





server.listen(3030);