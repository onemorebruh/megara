const mongoose = require("mongoose");
const assert = require("assert");
const request = require("supertest");
var app = require("./index").app;
const config = require("./config");
const fs = require("fs");
var loginHTML = fs.readFileSync(__dirname + "/static/login/index.html", "utf8")
var bdusrHTML = fs.readFileSync(__dirname + "/static/bdusr/index.html", "utf8")
var adminLoginHTML = fs.readFileSync(__dirname + "/static/adminLogin/index.html", "utf8")
//mongoose.connect(`${config.dburl}`, { useUnifiedTopology: true, useNewUrlParser: true });
const User = require("./models/users");

describe("actions with user", async function() {

    await it("add and find user", async function() {
        let test_user = {username: "username", email: "bar@foo.com", password: "hash"}
        const user = new User(test_user);
        await user.save();
        result = await User.findOne({email: test_user.email}).exec();
        assert.equal(test_user.username, result.username);
    });
    await it("delete user", function () {
        let test_user = {username: "username", email: "bar@foo.com", password: "hash"}
        User.deleteOne({email: test_user.email}, function(err, result){
            if(err) return err;
            return result
        })
    })
  });

describe("get requests", async function() {

    await it("/login", function(done) {
        request(app)
        .get("/login")
        .expect(`${loginHTML}`)
        .end(done);
    })

    await it("/bdusr", function(done) {
        request(app)
        .get("/bdusr")
        .expect(`${bdusrHTML}`)
        .end(done);
    })
    
    await it("/adminlogin", function(done) {
        request(app)
        .get("/adminlogin")
        .expect(`${adminLoginHTML}`)
        .end(done);
    })
    
})