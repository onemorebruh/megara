const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb://localhost:27017/megara", { useUnifiedTopology: true, useNewUrlParser: true });
const User = require("./model/users");
describe("actions with user", function() {

    it("add and find user", function() {
        let test_user = {username: "username", email: "bar@foo.com", password: "hash"}
        const user = new User(test_user);
        user.save(function(err){
            if(err) return console.log(err);
        });
        result = User.find(test_user, function(err, doc){
            if(err) return console.log(err);
            return doc;
        })
        assert.equal(test_user.username, result.username);
    });
    it("delete user", function () {
        let test_user = {username: "username", email: "bar@foo.com", password: "hash"}
        User.deleteMany(test_user, function(err, result){
            if(err) return console.log(err);
            return console.log(result)
        })
    })
  
  });