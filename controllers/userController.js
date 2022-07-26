const config = require("../config");

exports.showUsers= async function(req, res) {
    res.sendFile(__dirname.slice(0, (__dirname.length -11)) + "static/users/index.html"); //it's __dirname contains controller
}