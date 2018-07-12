const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io')

var app = express();
var publicPath = path.join(__dirname,'../public');
var port = process.env.PORT || 3000 ;
app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server); // web socket server

io.on('connection', (socket)=>{
    console.log('New user connected');
    // //server to client
    // socket.emit('newMessage',{
    //     from: 'John',
    //     text:'hey ! this is server',
    //     createdAt:123
    // });// this data will be sent from server to client

    // TASK 1 : send msg "WELCOME TO CHAT APP" from admin
    socket.emit('newMessage',{
        from : "Admin",
        text : "WELCOME TO CHAT APP"
    });

    // TASK 2: send "NEW USER JOINED" from admin to everyone else
    socket.broadcast.emit('newMessage',{
        from : "Admin",
        text : "New user joined"
    });

    // client to server (client send message)
    socket.on('createMessage',(message)=>{
        // send message to all connections
        io.emit('newMessage',{
            from : message.from,
            text : message.text,
            createdAt : new Date().getTime()
        });

        // // to everyone else
        // socket.broadcast.emit('newMessage',{
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime()
        // });
    });

    socket.on('disconnect',(socket) =>{
        console.log('client Disconnected');
    });

});

server.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});
