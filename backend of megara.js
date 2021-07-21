const express = require("express");
const app = express();
const jsonParser = express.json();
const mysql = require("mysql2");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "megara",
	password: "Password123#@!"
});
var usme="not saved (",
    pawd="not saved (";

//catch aunthefication data
app.post("/user", jsonParser, function (request, response) {
    console.log('###post###');
    if(!request.body) return response.sendStatus(400);
    response.json(request.body);
    usme = request.body.username;
    console.log(usme);
    pawd = request.body.password;
    console.log(pawd);
    // connection with mysql database
    connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
    });
        if (request.body.username != null){// tries to find user in db
            connection.query("SELECT password FROM users WHERE username = '"+ request.body.username +"'", function(err, results) {
                if(err) console.log(err);
                try{//get password and check it
                    console.log(results[0].password);
                    console.log(request.body.password);
                    if (results[0].password == pawd){
                        //succes!!! user moves to the homepage
                        response.redirect('')
                    } else {
                        alert("acces denied")
                    };
                } catch {// can't find username

                }
              });
            /*
            / here must be check
            / is username in db at all?
            / if there is no such user then programm have to create new one
            / if it finds such user then user gets message "acces denied"
            */
        };
        
});

app.get("/", function(request, response){//this code does work
    console.log("username: " + usme);
    console.log("password: " + pawd);
    //check for aunthefication data
    try{
        switch("not saved ("){
            // variants of data for aunthefication
            case usme:
                console.log("usme: " + usme)
                response.statusCode = 302;
                console.log("post is empty");
                response.redirect("login");
                break;
            default:
                /* post was caught
                /  you can work with the site
                */
                response.sendFile(__dirname + "/static/home/index.html");
        };
    } catch (err) {/*programm didn't catch the post
                   / so it redirects you to try again
                   */
        console.log("something is wrong");
        response.redirect("login");
    }

    //logging
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});

app.get("/about", function(request, response, next){
    response.sendFile(__dirname + "/static/about/index.html");
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
    response.sendFile(__dirname + "/static/login/index.html");
    //logging
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    //logging
});
app.use(express.static(__dirname + "/static"));
app.listen(3000);