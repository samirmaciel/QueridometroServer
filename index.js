const express = require('express'); //requires express module
const socket = require('socket.io'); //requires socket.io module
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT); //tells to host server on localhost:3000


//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
const io = socket(server);

var count = 0;

const usersConnected = new Map()
const usersData = new Map()

//Socket.io Connection------------------
io.on('connection', (connection) => {

    connection.on('registerUser', (userName) => {  
        usersConnected.set(connection.id, userName)
        usersData.set(userName, [0,0,0,0,0,0])
        console.log('User ' + userName + ' registed...')
        io.emit('usersUpdate', Object.fromEntries(usersData.entries()))
    })

    connection.on('sendEmojiForUser', (userData) => {
        usersData.set(Object.keys(userData)[0], Object.values(userData)[0])
        io.emit('usersUpdate', Object.fromEntries(usersData.entries()))
    })

    connection.on('disconnect', () => {
        const userName = usersConnected.get(connection.id)
        usersData.delete(userName)
        console.log('User ' + userName + ' disconnected')
        io.emit('usersUpdate', Object.fromEntries(usersData.entries()))
    })
})

