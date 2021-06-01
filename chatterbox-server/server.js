var http = require("http");

//require fs to store history
fs=require("fs");

//creating our server
var server = http.createServer();

//list of users logged in
var users=[];

var history=null;

//initiated our socket
var io = require("socket.io")(server);

//listen for a connection from our Client Socket
io.on("connection", (socket) => {
    
    console.log("A Client connected: " + socket.id);

    //listen for client login request
    socket.on("login:request",(LoginData)=>{

        users.push(LoginData.username);
        console.log(LoginData.username +" requests permission");


    });

    socket.on("userlist:request",(message)=>{
        io.emit("user:list",users);
    });

    //listen for history request
    socket.on("history:request",(message)=>{
        //validation

        //call history function
        getHistory();       

        socket.emit("history:response",history);

    });

    //listen for new messages
    socket.on("message:sent",(newMessage)=>{
        //add to my history array
        history.push(newMessage);
        addToHistory();

        //send new message to all of our clients 
        //socket sends to 1 specific client
        //io sends to all clients
        io.emit("new:message",newMessage);

    });
});
//get my message from history.txt
var getHistory=function(){
    if(history===null){

        //update history variable with the data from our history file as json
       history=JSON.parse(fs.readFileSync("history.txt","utf-8"));

    }
}

//function to update our message history
var addToHistory=function(){
    fs.writeFile("history.txt",JSON.stringify(history),function(err){
        if(err) throw err
    });
}

//host the server on 8888
server.listen(8888, function(){
    console.log("Listening on port 8888...");
});