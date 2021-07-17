const express = require("express");
const app = express();
const jsonParser = express.json();
const NULL = null

app.use(express.static(__dirname + "/static"))

app.post("/user", jsonParser, function (request, response) {
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);
});

app.get("/", function(request, response){
    switch(NULL){
        case request.body.username:
            //trying to get know any data
        case request.body.id:
            response.statusCode = 302;
            console.log("ajax is not empty");
            response.setHeader("Location", "/login");
            break;
        default:
            response.sendFile(__dirname + "/static/index.html");
    };

    //logging
    console.log("Route: /");
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});

app.get("/about", function(request, response, next){
    response.sendFile(__dirname + "/static/about.html");
    console.log("Route: /about");
    //logging
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});

app.get("/login", function(request, response, next){
    response.sendFile(__dirname + "/static/login.html");
    console.log("Route: /login");
    //logging
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});
app.listen(3000);