var http = require('http');//a dependency
var querystring=require("querystring");
var fs=require('fs');
var templates=require("es6-template-strings");

//host files
var static=require("node-static");
var fileServer=new static.Server("./public");


//init my client socket
var io=require("socket.io-client");

// connect client to server
var socket=io("http://localhost:8888/", {reconnect:true, transports:['websocket']});

//function to respond with form on GET request
var handleFormGet = function(request, response){

    response.writeHead(200, {"Content-Type": "text/html"});

    //fs
    fs.readFile("templates/index.html", "utf8", function(err, data) {
        if(err) {throw err;}

        response.write(data);
        response.end();
    });

}

//respond with 501 on POST request
//write welcome message here


//function to respond with welcoming message on POST request
var handleFormPost = function(request, response){

    response.writeHead(200, {"Content-Type": "text/html"});

    var payload = "";

    //event on our request's data
    request.on("data", function(data) {
        payload += data;
    });


    //event on our request's end
    request.on("end", function() {

        response.writeHead(200, {"Content-Type": "text/html"});

        var post = querystring.parse(payload);

// array of object called authUsers = [ 
// {username: "Isla", password: 12345}
// ]
// async await Promise setTimeout


                   socket.emit("login:request",post); 

        fs.readFile("templates/chat.html", "utf8", function(err, data) {
            if(err) {throw err;}

            //compile template first to include our JS post data
            var compiled = templates(data, {username: post["username"]});

            response.end(compiled);
            
        });//readfile 
  
    });

}

//getting our server
var server=http.createServer();

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
    {method:"POST", path:"/chat", handler:handleFormPost}
  ];

  for(i=0;i<routes.length;i++){
      var route=routes[i];

      if(route.method===suppliedRoute.method&& route.path===suppliedRoute.path){
          return route.handler;
      }
  }
  return null;

}// end of simple router helper function

//on request event occurs
server.on("request", function(request, response){

    var handler = simpleRouter(request);

    if(handler != null) {
        handler(request, response);
    } else {
        fileServer.serve(request, response, function(e, res){
            if(e&&(e.status === 404)){
                fileServer.serveFile('../templates/index.html',404,{}, request, response);
            }
        });
    }
});

//listen or PORT 3000
server.listen(3000, function(){
    console.log("Listening on port 3000...");
});