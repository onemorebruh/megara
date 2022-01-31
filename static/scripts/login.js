var loginButton = document.getElementById("loginButton").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.getElementById("userName").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;
    let user = JSON.stringify({username: username, email: email, password: password});
    let req = new XMLHttpRequest();
    // посылаем запрос на адрес "/user"
     req.open("POST", "/login", true);   
     req.setRequestHeader("Content-Type", "application/json");
     req.addEventListener("load", function () {
        // получаем и парсим ответ сервера
         let answer = JSON.parse(req.response);
         prompt(answer.message)
     });
     req.send(user);
     //redirect
})
var signupButton = document.getElementById("signupButton").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.getElementById("userName").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;
    let user = JSON.stringify({username: username, email: email, password: password});
    let req = new XMLHttpRequest();
    // посылаем запрос на адрес "/user"
    req.open("POST", "/userReg", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(req.response);
        console.log(receivedUser);   // смотрим ответ сервера
    });
    req.send(user);
    //redirect
})