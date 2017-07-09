const http = require("http");
const fs = require("fs");
const querystring = require('querystring');

const elements = [];
var date = new Date().toUTCString();

function generatePage(elementName, elementSymbol, elementNumber, elementDescription) {
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
  if (request.method === "POST") {
    request.on("data", function(data) {
      var info = data.toString();
      var newElem = querystring.parse(info)
      fs.appendFile(`public/${newElem.elementName}.html`, generatePage(newElem.elementName, newElem.elementSymbol, newElem.elementAtomicNumber, newElem.elementDescription), function(err) {
        if (err) throw err;
        console.log(newElem.elementName + " file was written!");
      })

      response.writeHead(200, {
        "Content-Type": "application/json",
        "success": "true",
        "Date": `${date}`
      })
      response.end();
    })

  } else if (request.method === "GET") {
    if(request.url === "/"){
      var path = "./public".concat(request.url).concat('index.html');
      console.log(path);
      var data = fs.readFileSync(path).toString();
      console.log(data);
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/html",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${data.length}`
      });
      response.write(data);
      response.end();
    }
  }
})

server.listen(8080, function() {
  console.log("Server running on port 8080");
})
