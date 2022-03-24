var adminArray = [], userArray = [], fileArray = [];
var adminPanel, userPanel, filePanel;

async function readFromDB (readingObject) {//load filenames from db
    var file = JSON.stringify({
        readingObject: readingObject
    })
    let req = new XMLHttpRequest();
    let sortedArray = [];
    req.open("POST", "/readDB", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        let array = [];
        array = answer.array;
        array.forEach(function(doc, i, array) {
            sortedArray.push(doc);
        });
    })
    req.send(file);
    return sortedArray;
}

document.addEventListener("DOMContentLoaded", async function (e) {
    e.preventDefault();
    adminArray = await readFromDB("admin");
    userArray = await readFromDB("user");
    fileArray = await readFromDB("file");
    console.log(adminArray)
    console.log(userArray)
    console.log(fileArray)
});


document.getElementById("usersPanel").addEventListener("keyup", function (e){
    e.preventDefault;
    let name ="", email ="";
    name = document.getElementById("userFilterName").value;
    email = document.getElementById("userFilterEmail").value;
    try {
        userPanel = document.getElementById("usersTable");
        userPanel.remove();
        document.getElementById("usersPanel").insertAdjacentHTML("beforeend", `<div id="usersTable" class="table"></div>`)
    } catch (err){
        console.log(err)
    } finally {
        let userResults ="";
        userArray.forEach(function (doc, i, userArray){
            if(doc.username.includes(name)){
                if(doc.email.includes(email)){
                    userResults += `<div><span>${doc.username}</span><span>${doc.email}</span><span>${doc.documents.length}</span><span onclick="DBedit('${doc._id}', 'user')">${SVG.edit}</span><span onclick="DBdelete('${doc._id}', 'user')">${SVG.trash}</span></div>`
                }
            }
        });
        userPanel = document.getElementById("usersTable");
        userPanel.insertAdjacentHTML("beforeend", userResults);
    }
})

document.getElementById("adminsPanel").addEventListener("keyup", function (e){
    e.preventDefault;
    let name ="", email ="";
    name = document.getElementById("adminFilterName").value;
    email = document.getElementById("adminFilterEmail").value;
    try {
        adminPanel = document.getElementById("adminsTable");
        adminPanel.remove();
        document.getElementById("adminsPanel").insertAdjacentHTML("beforeend", `<div id="adminsTable" class="table"></div>`)
    } catch (err){
        console.log(err)
    } finally {
        let adminResults ="";
        adminArray.forEach(function (doc, i, adminArray){
            if(doc.username.includes(name)){
                if(doc.email.includes(email)){
                    adminResults += `<div><span>${doc.username}</span><span>${doc.email}</span><span>${doc.tables.length}</span><span onclick="DBedit('${doc._id}', 'admin')">${SVG.edit}</span><span onclick="DBdelete('${doc._id}', 'admin')">${SVG.trash}</span></div>`
                }
            }
        });
        adminResults += `<button id="newAdmin">create new admin</button>`
        adminPanel = document.getElementById("adminsTable");
        adminPanel.insertAdjacentHTML("beforeend", adminResults);
    }
})

document.getElementById("filesPanel").addEventListener("keyup", function (e){
    e.preventDefault;
    let name ="", extention ="";
    name = document.getElementById("fileFilterName").value;
    extention = document.getElementById("FilterExtention").value;
    try {
        filePanel = document.getElementById("filesTable");
        filePanel.remove();
        document.getElementById("filesPanel").insertAdjacentHTML("beforeend", `<div id="filesTable" class="table"></div>`)
    } catch (err){
        console.log(err)
    } finally {
        let filesResults ="";
        fileArray.forEach(function (doc, i, fileArray){
            let docName = doc.split("/")[doc.split("/").length -1] //splits and get the last element of array
            if (docName.includes(name)){
                if (docName.includes(extention)){
                    filesResults += `<div><span>${doc}</span><span>${SVG.trash}</span></div>`
                }
            }
        });
        filesPanel = document.getElementById("filesTable");
        filesPanel.insertAdjacentHTML("beforeend", filesResults);
    }
})

document.getElementById("newAdmin").addEventListener('click', function (e){
    e.preventDefault;
    let username = prompt("admin's name");
    let email = prompt("admin's email");
    let password = prompt("admin's password");
    file = JSON.stringify({
        username: username,
        email: email,
        password: password
    });
    let req = new XMLHttpRequest();
    req.open("POST", "/adminReg", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
    })
    req.send(file);
})

function DBdelete (id, database) {
    file = JSON.stringify({
        id: id,
        database: database
    });
    let req = new XMLHttpRequest();
    req.open("POST", "/DBdelete", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
    })
    req.send(file);
}

function DBedit (id, database) {
    let name = prompt("name");
    let email = prompt("eamil");
    let password = prompt("password");
    file = JSON.stringify({
        id: id,
        database: database,
        name: name,
        email: email,
        password: password
    });
    let req = new XMLHttpRequest();
    req.open("POST", "/DBedit", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
    })
    req.send(file);
}