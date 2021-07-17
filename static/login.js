function login_by_username_and_password() {
        //get user's data
        let username =UserName.value
        console.log(UserName.value);
        let password =PassWord.value
        console.log(PassWord.value);
        //format data as json
        let user = JSON.stringify({username: username, password: password});
        let request = new XMLHttpRequest();
        //send message to the server
        request.open("POST", "/user", true)// "/" is the uri
        request.setRequestHeader("Content-Type", "application/json");
        // get response
        // it doesn't work(it could but it is not used)
        request.addEventListener("load", function () {
                let receivedUser = JSON.parse(request.response);
                console.log(receivedUser.username, "-", receivedUser.password); //check data by myself
        });
        request.send(user);
};