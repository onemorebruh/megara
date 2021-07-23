# check for user
check for username
- `-` check for id
    - `-` redirect to /login
    - `+` load homepage
- `+` load homepage
# log in
user adds username and password
- programm checks does this username exist
    - `-` programm adds new user
        - programm redirects to homepage
    - `+` programm compares db's password and entered password
        - `-` user gets message `acces denied`
        - `+` programm redirects to homepage
user adds id
- programm checks does this id exist
    - `-` programm adds new user by id
    - `+` programm redirects to 
# homepage
## write
- click on the write button
    - site asks you to enter page's name
        - site saves page as .md in user's own directory
## find 
## about
- redirect to the about page
## log out
- redirect to the login page
## who am i
- alert(usme)