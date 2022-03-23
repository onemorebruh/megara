# megara

- status - DEV

## decription
---
megara is a simple cloud server for easy saving data on your local network

## design
### colors

| color   | place           |
| ------- | --------------- |
| #f5f5f5 | background      |
| #ff784e | blocks          |
| #808080 | shadow          |
| #b23c17 | buttons         |
| #f5f5f5 | text in buttons |

## api
---
### /userReg
>example of json:
{
    "username": "foo",
    "email": "foo@bar.com",
    "password": "foo"
}

>example of answer:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhciIsImVtYWlsIjoiYmFyQGZvby5jb20iLCJpYXQiOjE2NDc3NzQxNTksImV4cCI6MTY0Nzc5NTc1OX0.H7525ZWJMK-Myapw_Ow2ecsiWwgVCB9xPtyRAY6VxLY",
    "url": "http://localhost:3000?username=foo"
}

while the last commit is deed4ae3 token is useless

### /login
>example of json:
{
    "username": "foo",
    "email": "foo@bar.com",
    "password": "foo"
}

>example of answer:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhciIsImVtYWlsIjoiYmFyQGZvby5jb20iLCJpYXQiOjE2NDc3NzQxNTksImV4cCI6MTY0Nzc5NTc1OX0.H7525ZWJMK-Myapw_Ow2ecsiWwgVCB9xPtyRAY6VxLY",
    "url": "http://localhost:3000?username=foo"
}

difference between /userReg and /login:
- in /login user have to exist in database
- in /userReg database gets new user's data

### /adminlogin
>example of json:
{
    "username": "foo",
    "password": "foo"
}

>example of answer:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhciIsImVtYWlsIjoiYmFyQGZvby5jb20iLCJpYXQiOjE2NDc3NzQxNTksImV4cCI6MTY0Nzc5NTc1OX0.H7525ZWJMK-Myapw_Ow2ecsiWwgVCB9xPtyRAY6VxLY",
    "url": "http://localhost:3000?username=foo"
}

have to give acces to the admin's page if data is correct

while the last commit is deed4ae3 is not released

### /newFile
>example of json:
{
    "username": "foo",
    "filename": "foo.txt",
    "text": "bar"
}

>example of answer:
{
    "message": "file is succesfully saved"
}

usage:
- checks file for existing
- add file in database(if it still is not in database)
- rewrite file if it already exists in directory
- creates directories if they don't exist

### /readFiles
>example of json:
{
    "username": "foo"
}

>example of answer:
{
    "documents": [
        "/home/ira/backup/megara/public/foo/bar.txt", "/home/ira/backup/megara/public/foo/f.txt", "/home/ira/backup/megara/public/foo/foo.txt"
    ]
}

reads files from database so homepage.js script will visualaize it in browser

### /deleteFile
>example of json:
{
    "username": "foo",
    "filename": "foo.txt"
}

>example of answer:
{
    "message": "file is succesfully deleted"
}

deletes file from directory and database

### /editFile
>example of json:
{
    "username": "foo",
    "filename": "foo.txt",
}

>example of answer:
{
    "text": "foo",
    "binary": undefined(mostly does not exist)
}

sends the data of the file to the browser

## instalation
---
> author used fedora so instalation can be different on your machine
1. `git clone https://github.com/onemorebruh/megara.git`
2. `sudo vim /etc/yum.repos.d/mongodb.repo`
3. ```[Mongodb]
    name=MongoDB Repository
    baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/4.4/x86_64/
    gpgcheck=1
    enabled=1
    gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
    ```
    paste this into file and save

4. `sudo dnf install mongodb-org mongodb-org-server`
5. `sudo systemctl enable mongod.service && sudo systemctl start mongod.service`
6. `sudo dnf install npm nodejs -y`
7. `cd megara`
8. `npm install`
9. `node index.js`

## configuration
---
- fedora 35
- mongodb:4.4.4
- nodejs:16.13.2

## TODO
---
[mvp] design
- [x] choose svgs
- [x] editor template
- [x] card template
- [x] search line template
- [x] user menu template
- [x] admin tables templates
- [ ] add animations
- [x] make admin panel's buttons look better

[ ] admin
- [x] admin model in database
- [x] admin panel
- [mvp] acces to the database via webpage
- - [x] get 3 responses(not 1) and visualize them
- - [ ] add new lines via webpage
- - [ ] delete lines via webpage
- - [ ] ability to add new admin ONLY via webpage

[mvp] logic
- [x] check for existing in db when registration
- [x] check for existing in db when login
- [ ] validation
- [mvp] login
- - [x] fix redirects when login or sign up
- - [ ] add check for password and email, so service will be much more secure
- [x] sessions
- [mvp] personsal storages
- - [x] make both buttons and resultButtons work(now work resultButtons only)
- - [x] add files to personal storage
- - [x] show files on homepage
- - - [x] visualize files as in temlpate
- - [x] find file in dictionary
- - [x] delete file
- - - [x] make it run function after press the button
- - [x] edit file
- - - [x] the server's response in not json, so it does not work as it have to
- - [x] download button
- - [ ] make acces to saving data more secure

[ ] tests
- [ ] test database
- [ ] requsets test
- [ ] ui test

## bugs

- [ ] crashes when give uncorrect user's data when login
- [ ] writes error in /newFile POST but haven't been crashed
- [x] duplicates file in database when saves file