var http = require("http");


//contact list global
var contacts=[];

//creating server
var server = http.createServer();


var simpleRouter=function(request){

    var method=request.method;
    var path=request.url;

    //find the query index
  var queryindex=path.indexOf("?");
  if(queryindex>=0){
      path = request.url.slice(0, queryindex);
  }// end of if

    //route entered
    var suppliedRoute={method:method, path:path};

      //possible routes for user
  var routes=[
    {method:"GET", path:"/", handler:handleFormGet},
    {method:"POST", path:"/", handler:handleFormPost}
  ];

  for(i=0;i<routes.length;i++){
      var route=routes[i];

      if(route.method===suppliedRoute.method&& route.path===suppliedRoute.path){
          return route.handler;
      }
  }
  return null;

}// end of simple router helper function

var querystring = require("querystring");

var handleFormGet = function(request, response){
    //already on the dom because of react
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end();
}

var handleFormPost=function(request,response){
    response.writeHead(200, { 'Content-Type': 'text/html' });
    var payload='';
   
    //event on request data
    request.on("data",function(data){
        payload+=data;
    });

    request.on("end",function(){

        var post=querystring.parse(payload);
        contacts.push(post["email"]);
        

        var compiled=templates(data,{username:post["username"],userList:contacts.join(",")});

        response.write(compiled);
        response.end();
    });
}

//response on request
server.on("request",function(request, response){
    // response.writeHead(200,{"Content-type":"text/html"})
    
    if("GET" === request.method){
     handleFormGet(request,response);    
     }else if("POST" === request.method){
     handleFormPost(request,response);
     }else{
     response.writeHead(404);
     response.end();
 }
 
 });

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