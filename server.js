const express = require('express');
const path = require('path');
const { Server } = require('socket.io')
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


//  ROUTE
app.get('/action', (req, res) => {
    res.sendFile(`${__dirname}/public/action.html`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// ROUTE END


const server = app.listen(3000, () => {
    console.log('server runs at http://127.0.0.1:3000');
});


// CREATE SOCKET IO CONNECTION
var userConnections = [];

const io = new Server(server);
io.on('connection', (socket) => {
    console.log('socket id is: ', socket.id);

    socket.on("userconnect", (data) => {
        console.log('my-user-id: ', data.displayName);
        console.log('my-meeting-id: ', data.meetingId);

        var otherUsers = userConnections.filter((p) => p.meeting_id === data.meetingId);

        userConnections.push({
            connectionId: socket.id,
            userId: data.displayName,
            meeting_id: data.meetingId
        });

        //  NOTIFY NEW USER
        otherUsers.forEach((v) => {
            socket.to(v.connectionId).emit("inform_others_about_me", {
                otherUserId: data.displayName,
                connectionId: socket.id
            });
        });

        //  INFORM ME ABOUT OTHER USERS
        socket.emit("inform_me_about_other_user", otherUsers);


    });


    socket.on("SDPProcess", (data) => {
        socket.to(data.toConnectionId).emit("SDPProcess", {
            message: data.message,
            fromConnectionId: socket.id
        });
    });

});