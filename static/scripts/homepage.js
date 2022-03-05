var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username")
var userButton = document.getElementById('user');
var newFileButton = document.getElementById("newFile");
var findFileButton = document.getElementById('findFile');


//write username in the button
userButton.insertAdjacentHTML('afterbegin', `<span>${username}</span>`);