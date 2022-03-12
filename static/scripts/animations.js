var loginButton = document.getElementById('loginButton');
var signupButton = document.getElementById('signupButton');
var newFileButton = document.getElementById('newFile');
var findFileButton = document.getElementById('findFile');
var userButton = document.getElementById('user');
var serachButton = document.getElementById('searchButton');
var saveButton = document.getElementById('saveButton');

if (loginButton){
    loginButton.addEventListener('click', function (e) {
        e.preventDefault();
        loginButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            loginButton.style.backgroundColor = '#b23c17';
        }, 1000)
    
    }
    );
}
if (signupButton){
    signupButton.addEventListener('click', function (e) {
        e.preventDefault();
        signupButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            signupButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}
if (newFileButton){
    newFileButton.addEventListener('click', function (e) {
        e.preventDefault();
        newFileButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            newFileButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}
if (findFileButton){
    findFileButton.addEventListener('click', function (e) {
        e.preventDefault();
        findFileButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            findFileButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}
if (userButton){
    userButton.addEventListener('click', function (e) {
        e.preventDefault();
        userButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            userButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}
if (serachButton){
    serachButton.addEventListener('click', function (e) {
        e.preventDefault();
        serachButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            serachButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}
if (saveButton){
    saveButton.addEventListener('click', function (e) {
        e.preventDefault();
        saveButton.style.backgroundColor = '#ed9277';
        setTimeout(() =>{
            saveButton.style.backgroundColor = '#b23c17';
        }, 1000)

    }
    );
}