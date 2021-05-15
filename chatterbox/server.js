var http = require("http");

//creating server
var server = http.createServer();

//mounting it to the server. initiated socket
//server socket
var io = require("socket.io")(server);

var i=0;
//listen for a connection from  client socket. on csonnesztion listener 
//client socket
io.on("connection", function(socket){
console.log("A client is connected: "+socket.id)

i++;

socket.emit("joined","welcome "+i);
});

server.listen(8888, function(){
    console.log("listening on port 8888...")
});