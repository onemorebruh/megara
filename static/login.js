document.getElementById("LoginButton").addEventListener("click", function (e) {
        //get user's data
        let username =UserName.value;
        console.log(UserName.value);
        let password =PassWord.value;
        console.log(PassWord.value);
        //format data as json
        let user = JSON.stringify({username: username, password: password});
        let request = new XMLHttpRequest();
        //send message to the server
        request.open("POST", "/user", true);// "/" is the uri
        request.setRequestHeader("Content-Type", "application/json");
        // get response
        request.addEventListener("load", function () {
                let receivedUser = JSON.parse(request.response); //check data by myself
		console.log(receivedUser.username + " - " + receivedUser.password);
        });
        request.send(user);
        setTimeout(function(){;window.location.href = "http://127.0.0.1:3000";}, 1000);
});
