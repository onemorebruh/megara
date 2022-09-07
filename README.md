# megara

megara is a simple cloud service written on nodejs

## structure

|-index.js		- main file
|-package.json	- contains information about project
|-templates		- contains templates of web pages
||-login		- contains template of login page
|||-login.html	- template of login page
||-admin		- contains template of admin page
|||-index.html	- template of admin page
||-badUser 		- contains template of the page for naughty users
|||-index.html	- template of the page for naughty users
|-static		- contains static files such as css and js
||-styles.css	- main file of styles
||-scripts		- contains all the frontend scripts
|||-login.js	- frontend scripts of the login page
|-README.md		- this file
|-node_modules	- dependencies
|-models.js		- file with models and their's syncronization script

## design

colors: #ffffcc, #99ccff

font: coming soon

padding: 0.5em;
marign: 4px;
border-redius: 1em;

## API

### closed part

type: post
link: /admin
example of request:
``` js
{
		login: "aboba",
		password: "aboba",
}
```
example of response:
``` js
{
		message: "success",
		urr: "/homepage"
}
```

## TODO

- [ ] design
- - [x] do basic design for all site
- - [x] design login page
- - [x] design admin menu
- - [ ] design user's homepage
- - [ ] design text editor
- - [ ] css animations
- - [x] design bad user page
- [ ] logic
- - [x] make wirte each action to the log
- - [x] basic authorization
- [ ] create admin panel
- - [x] add table generator for logs
- - [ ] add table generator for users
- - [ ] add table generator for files
- - [ ] add table generator for roles
- [x] create database's schemas
- [ ] API
- - [x] authorization as admin
- - [ ] db requests
- - - [x] get logs
- - - [ ] get files
- - - [ ] get users
- - - [ ] get roles
- - - [ ] delete user
- - - [ ] delete file
- - - [ ] delete role
- - - [ ] edit user
- - - [ ] edit file
- - [ ] authorization as user
- [ ] made it mvc
- [ ] pages
- - [ ] homepage
- - [x] admin page
- - [ ] about page
- - [x] login page
- - [x] bad user page
