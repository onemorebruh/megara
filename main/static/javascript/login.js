var password, username, id

try {
    LoginButton.addEventListener('click',{
        handleEvent(event) {
            console.log('it works');
            document.body.innerHTML += ''
            window.username = window.document.getElementById('username')
            console.log(window.username);
            window.username = window.username.value
            console.log(window.username);
            window.location='.'
            }
    });} catch (err){
    console.log("you are home")
    }