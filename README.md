# megara

- status - DEV

## decription
---
megara is a simple cloud server for easy saving data on your local network

### design
#### colors

| color   | place           |
| ------- | --------------- |
| #f5f5f5 | background      |
| #ff784e | blocks          |
| #808080 | shadow          |
| #b23c17 | buttons         |
| #f5f5f5 | text in buttons |

## avalibale functions
---

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
[ ] design
- [ ] choose fonts
- [ ] choose svgs
- [x] editor template
- [x] card template
- [x] search line template
- [ ] user menu template

[ ] admin
- [x] admin model in database
- [ ] admin panel
- [ ] acces to the database via webpage
- [ ] ability to add new admin ONLY via webpage

[ ] logic
- [x] check for existing in db when registration
- [x] check for existing in db when login
- [ ] validation
- [x] login
- - [x] fix redirects when login or sign up
- - [ ] add check for password and email, so service will be much more secure
- [x] sessions
- [ ] personsal storages
- - [x] add files to personal storage
- - [x] show files on homepage
- - - [x] visualize files as in temlpate
- - [ ] find file in dictionary
- - [ ] delete file
- - [ ] edit file
- - [ ] make acces to saving data more secure

[ ] tests
- [ ] test database
- [ ] requsets test
- [ ] ui test

## bugs

- [ ] crashes when give uncorrect user's data when login
- [ ] writes error in /newFile POST but haven't been crashed