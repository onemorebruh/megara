var loginButton = document.getElementById('loginButton');
var signupButton = document.getElementById('signupButton');

loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    loginButton.style.backgroundColor = '#ed9277';
    setTimeout(() =>{
        loginButton.style.backgroundColor = '#b23c17';
    }, 1000)

}
);
signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    signupButton.style.backgroundColor = '#ed9277';
    setTimeout(() =>{
        signupButton.style.backgroundColor = '#b23c17';
    }, 1000)

}
);