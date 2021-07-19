const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
//join chat room
socket.emit('joinRoom',{username ,room});


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });











socket.on("message",message =>{
     outputMessage(message);

     //scroll down
     chatMessages.scrollTop = chatMessages.scrollHeight;
 });


 //message sent 
 chatForm.addEventListener('submit',(e)=>{
     e.preventDefault();

     const msg = e.target.elements.msg.value;
    // console.log(msg);
    //sending message to server
    socket.emit('chatMessage',msg);
    
    
    
    //clr input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

 });


 // output message to dom 
function outputMessage(message){
const div = document.createElement('div');
div.classList.add('message');
div.innerHTML = `
<p class="meta">${message.username}<span>${message.time}</span></p>
<p class="text">
    ${message.text}
</p>
`
document.querySelector('.chat-messages').appendChild(div);


};

//add room name to dom 
function outputRoomName(room){
    roomName.innerText = room;

}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user=> `<li>${user.username}</li>`).join('')}`;
   
  }
//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });
