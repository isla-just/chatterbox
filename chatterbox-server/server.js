var http = require("http");

//creating our server
var server = http.createServer();

//list of users logged in
var users=[];

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

        var history=[
            {author:"Isla", message:"Hi there!"},
            {author:"Simon", message:"Hi Isla, how are you?"},
            {author:"Isla", message:"I'm good thanks for asking. How are you?"},
        ];

        socket.emit("history:response",history);

    });
});

//host the server on 8888
server.listen(8888, function(){
    console.log("Listening on port 8888...");
});