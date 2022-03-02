# megara

- status - DEV

## decription
---
megara is a simple cloud server for easy saving data on your local network

### design
#### colors

color  | place
-------|----------
#f5f5f5| background
#b23c17| blocks
#808080| shadow
#b23c17| buttons

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
7. `node index.js`

## configuration
---
- fedora 35
- mongodb:4.4.4
- nodejs:16.13.2

## TODO
---
[] design
- [] choose fonts
- [] choose svgs
- [] design lists


[] admin
- [x] admin model in database
- [] admin panel
- [] acces to the database via webpage

[] logic
- [x] check for existing in db when registration
- [x] check for existing in db when login
- [] validation
- [x] login
- - [] fix redirects when login or sign up

- [x] sessions
- [] personsal storages

[] tests
- [] test database