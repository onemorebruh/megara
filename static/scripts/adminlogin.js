var loginButton = document.getElementById("loginButton").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.getElementById("userName").value;
    let password = document.getElementById("userPassword").value;
    let user = JSON.stringify({username: username, password: password});
    let req = new XMLHttpRequest();
    // посылаем запрос на адрес "/user"
     req.open("POST", "/adminlogin", true);   
     req.setRequestHeader("Content-Type", "application/json");
     req.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let answer = JSON.parse(req.response);
        //redirect
        window.location.href = answer.url;
     });
     req.send(user);
     //redirect
})