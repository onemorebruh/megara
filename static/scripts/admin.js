var adminArray = [], userArray = [], fileArray = [];
var adminPanel, userPanel, filePanel;


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
                    userResults += `<div id="${doc._id}">
                                        <span>${doc.username}</span>
                                        <span>${doc.email}</span>
                                        <span>${doc.documents.length}</span>
                                        <span onclick="DBedit('${doc._id}', 'user')">
                                            ${SVG.edit}
                                        </span>
                                        <span onclick="DBdelete('${doc._id}', 'user')">
                                            ${SVG.trash}
                                        </span>
                                    </div>`
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
                    adminResults += `<div id="${doc._id}">
                                        <span>${doc.username}</span>
                                        <span>${doc.email}</span>
                                        <span>${doc.tables.length}</span>
                                        <span onclick="DBedit('${doc._id}', 'admin')">
                                            ${SVG.edit}
                                        </span>
                                        <span onclick="DBdelete('${doc._id}', 'admin')">
                                            ${SVG.trash}
                                        </span>
                                    </div>`
                }
            }
        });
        adminResults += `<button onclick="newAdmin()" id="newAdmin">create new admin</button>`
        adminPanel = document.getElementById("adminsTable");
        adminPanel.insertAdjacentHTML("beforeend", adminResults);
    }
})

// filePanel
document.getElementById("filesPanel").addEventListener("keyup", function(event){
  event.preventDefault;
  let name="", extention="", owner="";
  name = document.getElementById("fileFilters__Name").value;
  owner = document.getElementById("fileFilters__Owner").value;
  extention = document.getElementById("fileFilters__Extention").value;
  try {
    filePanel = document.getElementById("filesTable");
    filePanel.remove();
    document.getElementById("filesPanel").insertAdjacentHTML("beforeend", `
      <div id="filesTable" class="table"></div>
    `);
  } catch (err){
    console.log(err);
  } finally {
    let fileResults = ""
    fileArray.forEach((doc, i, fileArray) => {
      let doc_id = doc._id;
      console.log(doc)
      let docName = doc.filename;
      let docOwner = doc.owner;
      if (docName.includes(name)){
        if (docOwner.includes(owner)){
          if (docName.includes(extention)){
            fileResults += `
              <div id="${doc_id}"
                <span>${docName}</span>
                <span onclick="DBdelete('${doc_id}, file, ${docName}')">
                  ${SVG.trash}
                </span>
              </div>`;//somehow all fileResults have the same id
          }
        }
      }
    })
    let filesPanel = document.getElementById("filesTable");
    filesPanel.insertAdjacentHTML("beforeend", fileResults);
  }
});
      
  


function newAdmin(){
    let username, email, password;
    do{
        username = prompt("admin's name");
    } while (username == "")
    do{
        email = prompt("admin's email");
    } while (username == "")
    do{
        password = prompt("admin's password");
    } while (username == "")
    file = JSON.stringify({
        username: username,
        email: email,
        password: password
    });
    let req = new XMLHttpRequest();
    req.open("POST", "/admin/reg", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
    })
    req.send(file);
}

function DBdelete (id, database, filename="") {
    console.log(id, database, filename)
    file = JSON.stringify({
        id: id,
        database: database,
        filename: filename,
    });
    let req = new XMLHttpRequest();
    req.open("DELETE", "/api/DB/delete", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
        document.getElementById(id).style.display = 'none';
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
    req.open("POST", "/api/DB/edit", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        alert(answer.message)
    })
    req.send(file);
}


async function readFromDB (readingObject) {//load filenames from db
    let request = new XMLHttpRequest();
    let sortedArray = [];
    request.open("GET", `/api/DB/read?${readingObject}`, true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        let answer = JSON.parse(request.response);
        let array = [];
        array = answer.array;
        array.forEach(function(doc, i, array) {
            sortedArray.push(doc);
        });
    })
    request.send();
    return sortedArray;
}
