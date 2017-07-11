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

var index = fs.readFileSync("./public/index.html");
var css = fs.readFileSync("./public/css/styles.css");
var error404 = fs.readFileSync("./public/404.html");

const server = http.createServer(function(request, response) {
  if (request.method === "POST") {
    request.on("data", function(data) {
      var info = data.toString();
      var newElem = querystring.parse(info)
      fs.writeFile(`public/${newElem.elementName}.html`, generatePage(newElem.elementName, newElem.elementSymbol, newElem.elementAtomicNumber, newElem.elementDescription), function(err) {
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
    console.log(request.url);
    var exists = fs.existsSync(`./public${request.url}`)
    if (request.url === "/") {
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/html",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${index.length}`
      });
      response.write(index);
      response.end();
    } else if (request.url === "/css/styles.css") {
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/css",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${css.length}`
      });
      response.write(css.toString());
      response.end();
    } else if (exists) {
      var existingElement = fs.readFileSync(`./public${request.url}`);
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/html",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${existingElement.length}`
      });
      response.write(existingElement);
      response.end();
    } else {
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/html",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${error404.length}`
      });
      response.write(error404);
      response.end();
    }
  }
})

server.listen(8080, function() {
  console.log("Server running on port 8080");
})
