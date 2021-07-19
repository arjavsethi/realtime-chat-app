const express = require("express");
const PORT = 8000 || process.env.PORT;
const Path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { on } = require("events");
const formatMessage = require('./utils/messages');
const { userJoin , getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatCordBot';

//set static folder
app.use(express.static(Path.join(__dirname,'public')));

// run when client get connexted
io.on('connection' , socket =>{
        socket.on('joinRoom',({username ,room})=>{


            const user = userJoin(socket.id,username ,room);

                socket.join(user.room);




            socket.emit('message',formatMessage(botName,'welcome to chat cord'));

            // brodcating when user gets connected
            socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined a chat`));
        
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
              });
        });



    // console.log('New Connection');

   
    //run when user disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat!`));



            // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });


        }
       
    
    });
               
    //sending msg back to client side.
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));





    });

});



server.listen(PORT,()=>{ console.log(`server is running on port 8000`)});




