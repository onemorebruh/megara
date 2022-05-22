const config = require("./config");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/adminuser");
var username = process.argv[2];
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(process.argv[3], salt);
var email = process.argv[4];
var tables = [  "users",
                "admins",
                "logs"
            ];


async function main(){
    await console.log("almost done");
    await mongoose.connect(config.dburl, { useUnifiedTopology: true, useNewUrlParser: true});
    var admin = new Admin({username: username, email: email, password: hash, tables: tables});
    await admin.save(function(err){
        if(err) return console.log(err);
    });
    await console.log("succes")
    setTimeout(function (){process.exit(1)}, 5000); 
}
main();