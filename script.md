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