const http = require("http");
const fs = require("fs");
const querystring = require('querystring');

const server = http.createServer(function(request, response){

})

server.listen(8080, function(){
  console.log("Server running on port 8080");
})
