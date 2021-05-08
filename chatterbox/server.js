var http = require('http');//a dependency
var querystring=require("querystring");
var fs=require('fs');
var templates=require("es6-template-strings");

//so we can display all the data in the html file
var path = require('path');

//contact list global
var contacts=[];

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

//function to respond with form on GET request
var handleFormGet = function(request, response){

    //displaying all html images
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = 'templates/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }//end of switch

    fs.readFile(filePath, function(error, data) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, data) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(data, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data, 'utf-8');
        }
    });

}

//respond with 501 on POST request
//write welcome message here
var handleFormPost=function(request,response){
    response.writeHead(200, {"Content-Type":"text/html"});//page not found, not taking you anywhere

    var payload='';
   
    //event on request data
    request.on("data",function(data){
        payload+=data;
    });

    request.on("end",function(){

        var post=querystring.parse(payload);
        contacts.push(post["email"]);
        
    //displaying all html images
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = 'templates/loggedIn.html';

        var extname = path.extname(filePath);
        var contentType = 'text/html';
         switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }//end of switch

    fs.readFile(filePath, function(error, data) {

        var compiled=templates(data,{email:post["email"],userList:contacts.join(", ")});
        
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, data) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(data, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(compiled, 'utf-8');
        }
    });
        });

}//end of on end request

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

server.listen(8888, function(){
    console.log("listening on port 8888...")
});
