var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);
const {joinUser,removeUser,getuser} = require('./user')


app.get('/chat', function(req,res){
    res.sendFile(__dirname + '/public/index.html');
}); 
app.get('/style.css',function(req,res){
  res.sendFile(__dirname + '/public/css.css')
})
let thisRoom = "";
io.on("connection", function (socket) {
  console.log("connected");
  socket.on("join room", (data) => {
    console.log('in room');
    let Newuser = joinUser(socket.id, data.username,data.roomName)
   socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
    thisRoom = Newuser.roomname;
    console.log(Newuser);
    socket.join(Newuser.roomname);
  });
  socket.on("chat message", (data) => {
    let usr = getuser(data.user);
    io.to(usr.roomname).emit("chat message", {data:data,id : socket.id});
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if(user) {
      console.log(user.username + ' has left');
    }
    console.log("disconnected");
  });
});


http.listen(3000)
