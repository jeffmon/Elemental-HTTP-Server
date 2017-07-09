const http = require("http");
const fs = require("fs");
const querystring = require('querystring');

const elements = [];

function generatePage(elementName, elementSymbol, elementNumber, elementDescription){
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${elementName}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${elementName}</h1>
    <h2>${elementSymbol}</h2>
    <h3>${elementNumber}</h3>
    <p>${elementDescription}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>
  `
}

const server = http.createServer(function(request, response) {
  if(request.method === "POST"){
    request.on("data", function(data){
      var info = data.toString();
      var newElem = querystring.parse(info)
      elements.push(newElem);
      console.log(elements);
      fs.appendFile(`public/${newElem.elementName}.html`, generatePage(newElem.elementName, newElem.elementSymbol, newElem.elementAtomicNumber, newElem.elementDescription), function(err){
        if (err) throw err;
        console.log("The file was written!");
      })
    })
    request.on("end", function(){

    })
    response.writeHead(200, {"Content-Type": "application, json", "success": "true"})
  }
})

server.listen(8080, function(){
  console.log("Server running on port 8080");
})
