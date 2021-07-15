const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static/homepage"), function(request, response){
    console.log("Route: /");
    //logging
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});

app.use(express.static(__dirname + "static/about"), function(request, response, next){
     
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

app.listen(3000);