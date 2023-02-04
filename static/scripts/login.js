
var loginButton = document.getElementById("login__loginButton").addEventListener("click", async function (e) {
    e.preventDefault();
    let username = document.getElementById("form__Name").value;
    let isUsernameValid = await validation(username, "username");
    if (isUsernameValid == true){

        let email = document.getElementById("form__Email").value;
        let isEmailValid = await validation(username, "username");
        if (isEmailValid == true){
            let password = document.getElementById("from__Password").value;
            let isPasswordValid = validation(username, "username");
            if (isPasswordValid == true){
                let user = JSON.stringify({username: username, email: email, password: password});
                let req = new XMLHttpRequest();
                // посылаем запрос на адрес "/user"
                req.open("POST", "/user/login", true);   
                req.setRequestHeader("Content-Type", "application/json");
                req.addEventListener("load", function () {
                    // получаем и парсим ответ сервера
                    let answer = JSON.parse(req.response);
                    window.location.href = answer.url;
                });
                req.send(user);
            } else {
                alert(isPasswordValid);
                req.send('');
            }
        } else {
            alert(isEmailValid);
            req.send('');
        }
    } else {
        alert(isUsernameValid);
        req.send('');
    }
})
var signupButton = document.getElementById("login__signupButton").addEventListener("click", async function (e) {
    e.preventDefault();
    let username = document.getElementById("form__Name").value;
    let isUsernameValid = await validation(username, "username");
    if (isUsernameValid == true){

        let email = document.getElementById("from__Email").value;
        let isEmailValid = await validation(email, "email");
        if (isEmailValid == true){
            let password = document.getElementById("from__Password").value;
            let isPasswordValid = validation(password, "password");
            if (isPasswordValid == true){
                let user = JSON.stringify({username: username, email: email, password: password});
                let req = new XMLHttpRequest();
                // посылаем запрос на адрес "/user"
                req.open("POST", "/user/reg", true);   
                req.setRequestHeader("Content-Type", "application/json");
                req.addEventListener("load", function () {
                    // получаем и парсим ответ сервера
                    let answer = JSON.parse(req.response);
                    console.log(answer);   // смотрим ответ сервера
                    window.location.href = answer.url;
                });
                req.send(user);
            } else {
                alert(isPasswordValid);
            }
        } else {
            alert(isEmailValid);
        }
    } else {
        alert(isUsernameValid);
    }
})

function validation (field, fieldName){
    if (field != ""){
        return true
    } else {
        return `${fieldName} is empty`
    }
}
