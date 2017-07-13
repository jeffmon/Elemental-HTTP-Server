const http = require("http");
const fs = require("fs");
const querystring = require('querystring');

var date = new Date().toUTCString();
var index = fs.readFileSync("./public/index.html");
var css = fs.readFileSync("./public/css/styles.css");
var error404 = fs.readFileSync("./public/404.html");
var elementHTML = [{name: "Hydrogen", html: "/hydrogen.html"}, {name: "Helium", html: "/helium.html"}]
var elementList = ``;
var count = 2;

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

function addElementHTML(arr){
  for(var i = 0; i < arr.length; i++){
    var name = arr[i].replace(/.html/, "");
    elementList += `
    <li>
      <a href="${arr[i]}">${name}</a>
    </li>
    `
  }
  return elementList;
}

function generateIndex(text){
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are ${count}</h3>
    <ol>
      ${text}
    </ol>
  </body>
  </html>
  `
}

function currentElements(arr){
  var newArr = [];
  for(var i = 0; i < arr.length; i++){
    if(arr[i] !== ".keep"&&arr[i] !== "404.html"&&arr[i] !== "index.html"&&arr[i] !== "css"){
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

const server = http.createServer(function(request, response) {
  if (request.method === "POST") {
    request.on("data", function(data) {
      var info = data.toString();
      var newElem = querystring.parse(info);
      count++;
      fs.writeFile(`public/${newElem.elementName}.html`, generatePage(newElem.elementName, newElem.elementSymbol, newElem.elementAtomicNumber, newElem.elementDescription), function(err) {
        if (err) throw err;
        console.log(newElem.elementName + " file was written!");
      })

      response.writeHead(200, {
        "Content-Type": "application/json",
        "success": "true",
        "Date": `${date}`
      })
      response.write(index);
      response.end();
    })

  } else if (request.method === "GET") {

    var files = fs.readdirSync("./public/");
    var onlyElements = currentElements(files);
    var exists = fs.existsSync(`./public${request.url}`)
    //console.log(generateIndex(addElementHTML(onlyElements)))

    if (request.url === "/") {
      response.writeHead(200, {
        "Server": "Facebook",
        "Content-Type": "text/html",
        "success": "true",
        "Date": `${date}`,
        "Content-Length": `${index.length}`
      });
      index = fs.readFileSync("./public/index.html");
      //console.log(generateIndex(addElementHTML(onlyElements)))
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
