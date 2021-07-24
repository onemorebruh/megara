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
                let answer = JSON.parse(request.response); //check data by myself
                console.log(answer)
                setTimeout(function(){;if (answer == "+"){//server doesn't send json back but it have to
                        window.location.href = "http://127.0.0.1:3000";
                        } else{
                        document.body.innerHTML += '<div class="alert"><h>permission denied</h></div>'
                }}, 1000);
        });
        request.send(user);
        
});
