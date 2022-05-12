var loginButton = document.getElementById("loginButton").addEventListener("click", async function (e) {
    e.preventDefault();
    let username = document.getElementById("userName").value;
    let isUsernameValid = await validation(username, "username");
    if (isUsernameValid == true){

        let password = document.getElementById("userPassword").value;
        let isPasswordValid = await validation(password, "password");
        if (isPasswordValid == true){
            let user = JSON.stringify({username: username, password: password});
            let req = new XMLHttpRequest();
            // посылаем запрос на адрес "/user"
            req.open("POST", "/admin/login", true);   
            req.setRequestHeader("Content-Type", "application/json");
            req.addEventListener("load", function () {
               // получаем и парсим ответ сервера
               let answer = JSON.parse(req.response);
               //redirect
               window.location.href = answer.url;
            });
            req.send(user);
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