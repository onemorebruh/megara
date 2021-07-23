const express = require("express");
const app = express();
const fs = require("fs");
const jsonParser = express.json();
const mysql = require("mysql2");
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "megara",
	password: "Password123#@!"
});
function log(usme, pawd) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${usme}`;
    console.log("\n" + data);
};
var usme="guest",
    pawd="guest",
    free_access=true;// todo add config

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
          console.log("MySQL database is conected succesfully");
        }
    });
        if (request.body.username != null){// tries to find user in db
            connection.query("SELECT password FROM users WHERE username = '"+ usme +"'", function(err, results) {
                if(err) console.log(err);
                
              });
            try{//get password and check it
                console.log("###try###");// anyone can enter

                                         // maybe pawd and results[0].password lost somewhere
                console.log(results[0].password);
                console.log(pawd);
                if (results[0].password == pawd){
                    //succes!!! user moves to the homepage
                    response.redirect('')
                } else {
                    alert("acces denied")
                };
            } catch (err){// can't find username
                /*
                let line = [usme, pawd];
                let dbrequest = "INSERT INTO users(username, password) VALUES(?, ?)";
                try {
                    connection.query(dbrequest, line);
                        console.log("user succesfully added to database");
                        response.redirect('');
                } catch (err) {
                    console.log(err)
                    console.log(usme + "'s registration failed, password was: " + pawd)
                };
                */
                };
            /*
            / here must be check
            / is username in db at all?
            / if there is no such user then programm have to create new one
            / if it finds such user then user gets message "acces denied"
            */
        };
        
});

app.post("/write", jsonParser, function (request, response) {
    console.log("###file###")
    if(!request.body) return response.sendStatus(400);
	//write file with sended text on it
	let text_of_file = request.body.text;
    let title = request.body.title
	console.log(text_of_file);
    if (!fs.existsSync("files/" + usme)){
        fs.mkdirSync("files/" + usme);
    }
	let file_content = fs.writeFileSync("files/" + usme + "/" + title + "-" + usme +".md" , text_of_file);
	//send it back
	response.json(request.body);
});

app.post("/find", jsonParser, function (request, response) {
    console.log("###find###")
    console.log("post " + request.body.name, request.body.InPublic, request.body.InText);
    if(!request.body) return response.sendStatus(400);
    //read files' names
    let current_name = request.body.name;//post must have name in it
    let list_of_files = fs.readdirSync(__dirname + "/files/" + usme);
    console.log("files" + list_of_files)
    // filter files
    let found_files = [];
    for (var number in list_of_files){
        if (list_of_files[number].includes(current_name)){
            found_files.push(list_of_files[number]);
        };
    }
    console.log("found files" + found_files);
    response.json(found_files); // отправляем пришедший ответ обратно
});

app.get("/", function(request, response){//this code does work
    console.log("username: " + usme);
    console.log("password: " + pawd);
    //check for aunthefication data
    try{
        switch("guest"){
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

    log(usme, pawd);
    console.log(`${request.method} ${request.url} ${request.get("user-agent")}`);
});



app.get("/about", function(request, response, next){
    response.sendFile(__dirname + "/static/about/index.html");
    log(usme, pawd);
    console.log(`${request.method} ${request.url} ${request.get("user-agent")}`);
});

app.get("/login", function(request, response, next){
    response.sendFile(__dirname + "/static/login/index.html");
    log(usme, pawd);
    console.log(`${request.method} ${request.url} ${request.get("user-agent")}`);
});
app.use(express.static(__dirname + "/static"));
app.listen(3000);