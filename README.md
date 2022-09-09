# megara

megara is a simple cloud service written on nodejs

## structure
```
|-index.js		- main file
|-package.json	- contains information about project
|-templates		- contains templates of web pages
||-login		- contains template of login page
|||-login.html	- template of login page
||-admin		- contains template of admin page
|||-index.html	- template of admin page
||-badUser 		- contains template of the page for naughty users
|||-index.html	- template of the page for naughty users
||-homepage		- contains template of user's homepage(page with editor)
|||-index.html	- templateof the page with editor
|-static		- contains static files such as css and js
||-styles.css	- main file of styles
||-scripts		- contains all the frontend scripts
|||-login.js	- frontend scripts of the login page
|||-admin.js	- frontend scripts of the admin panel
|||-homepage.js	- frontend scripts of the homepage
|-README.md		- this file
|-node_modules	- dependencies
|-models.js		- file with models and their's syncronization script
```
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
		url: "/homepage"
}
```

---
type:  get
link: /admin/db/log

example of response:
``` js 
[
		{
		id: 1,
		user: 1,
		action: "tried to log as admin",
		time: "2022-09-07T08:13:55.000Z",
		},
]
```

---
type: post
link /user/reg

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
		url: "/user
}
```

---
type: post
link /user/login

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
		url: "/user"
}
```

---

type: get
link: /user/db/files
example of response:
``` js
[
		{
				id: 1,
				name: "filename.txt"
				text: "text",
				blob: null,
				createdAt: '2022-0908 15:00:42',
				userId: 1,
		},
]
```
## TODO

- [ ] design
- - [x] do basic design for all site
- - [x] design login page
- - [x] design admin menu
- - [x] design user's homepage
- - [ ] design text editor
- - [ ] css animations
- - [x] design bad user page
- [ ] logic
- - [x] requests of user(files of one user)
- - [ ] hash passwords
- - [ ] compare hashed passwords
- - [ ] make wirte each action to the log
- - [x] basic authorization
- [ ] create admin panel
- - [x] add table generator for logs
- - [ ] add table generator for users
- - [ ] add table generator for files
- [x] create database's schemas
- - [x] make no roles just check for access by user
- [ ] API
- [x] registration
- [x] authorization
- - [x] authorization as admin
- - [ ] admin db requests
- - - [x] get logs
- - - [ ] get files
- - - [ ] get users
- - - [ ] delete user
- - - [ ] delete file
- - - [ ] edit user
- - - [ ] edit file
- [x] abbility to make new files
- [ ] syntax highlight
- [ ] abbility to modify files
- [ ] made it mvc
- [ ] pages
- - [x] homepage
- - [x] admin page
- - [ ] about page
- - [x] login page
- - [x] bad user page
- [ ] install script
- - [ ] make it create database and user
- - [ ] make it create users record user with all accesses equal true
