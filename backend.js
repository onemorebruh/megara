const express = require("express");
const app = express();
const fs = require("fs");
const jsonParser = express.json();
const mysql = require("mysql2");
const { runInNewContext } = require("vm");
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
    answer="-"
    free_access=true,
    ip=process.argv[2],
    port=process.argv[3],
    found_files=[];// todo add config
//catch aunthefication data
app.post("/user", jsonParser, function (request, response) {
    console.log('###post###');
    if(!request.body) return response.sendStatus(400);
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
    connection.query("SELECT password FROM users where username = '" + usme + "'", function(err, results){
        if(err) console.log(err);
        try{
            if(results[0].password == pawd){
                console.log("do not catch");
                answer = {answer: "+", ip:ip + ":" + port };
                response.json(answer);
            } else {
                console.log("permission denied");
                
            }
        } catch(err) {
            console.log("catch");
            let line = [usme, pawd];
            let dbrequest = "INSERT INTO users(username, password) VALUES(?, ?)";
            try {
                connection.query(dbrequest, line);
                    console.log("user succesfully added to database");
            } catch (err) {
                console.log(err)
                console.log(usme + "'s registration failed, password was: " + pawd)
            };
        }
    })
    
});

// writing file
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
// finding file
app.post("/find", jsonParser, function (request, response) {
    global.found_files = [];
    console.log("###find###")
    console.log("post " + request.body.name, request.body.InPublic, request.body.InText);
    if(!request.body) return response.sendStatus(400);
    //read files' names
    let current_name = request.body.name;//post must have name in it
    let list_of_files = fs.readdirSync(__dirname + "/files/" + usme);
    console.log("files" + list_of_files)
    // filter files
    for (var number in list_of_files){
        if (list_of_files[number].includes(current_name)){
            global.found_files.push(list_of_files[number]);
        };
    }
    if (request.body.InPublic == true) {
        let list_of_files = fs.readdirSync(__dirname + "/files/public/");
    console.log("files" + list_of_files)
    // filter files
    for (var number in list_of_files){
        if (list_of_files[number].includes(current_name)){
            global.found_files.push(list_of_files[number]);
        };
    }
    }
    console.log("found files" + global.found_files);
    response.json(global.found_files);
});
//actions
/*
WhoAmI - shows alert where user sees username
Edit - shows text of file.md
*/
app.post("/action", jsonParser, function (request, response) {
    console.log("###action###")
    console.log("post " + request.body.action);
    var action
    switch (request.body.action){//i can ad more actons later
        case "WhoAmI":
            action = {action: usme};
            break;
	    case "Edit":
		    // open file !!! does not open public files
            let text = fs.readFileSync(__dirname + "/files/" + usme + "/" + global.found_files[request.body.number], "utf8");
            action = {title: (global.found_files[request.body.number]).replace("-" + usme + ".md", ""), text: text}
            break;
        default:
            action = "something is wrong";
            break;
    }
    console.log(action);
    response.json(action);
});
//sites
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
app.listen(port, ip);
