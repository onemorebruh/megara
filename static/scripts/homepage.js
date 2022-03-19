var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username")
var userButton = document.getElementById('user');
var newFileButton = document.getElementById("newFile");
var findFileButton = document.getElementById('findFile');
var editor = document.getElementById('editorMainDiv');
var findForm = document.getElementById('searchLineDiv');
var arrayOfDocumentsFromDB = [];


//write username in the button
userButton.insertAdjacentHTML('afterbegin', `<span>${username}</span>`);

newFileButton.addEventListener("click", function (e) {
    e.preventDefault();
    editor.style.display = 'block';
})

findFileButton.addEventListener("click", function (e) {
    e.preventDefault();
    if(findForm.style.display == 'block'){
        findForm.style.display = 'none';
        document.getElementById("searchResults").style.display = "none";
    } else {
        findForm.style.display = 'block';
    }
})

var saveButton = document.getElementById('SaveButton').addEventListener("click", async function (e) {
  e.preventDefault();
  var file = await JSON.stringify({
      text: document.getElementById('text').value,
      filename: document.getElementById("filename").value,
      username: username,
      binary: document.getElementById("editorFileInput").value
  });
  console.log(file)
  let req = new XMLHttpRequest();
  req.open("POST", "/newFile", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {
      let answer = JSON.parse(req.response);
      alert(answer.message);
      //alert(answer.message);
  });
  req.send(file);
  editor.style.display = 'none';
})

document.addEventListener("DOMContentLoaded", async function readFromDBAndVisualaze (e) {//load filenames from db
    e.preventDefault();
    var file = await JSON.stringify({
        username: username
    })
    let req = new XMLHttpRequest();
    req.open("POST", "/readFiles", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        let docName;
        arrayOfDocumentsFromDB = answer.documents;
        //TODO visualize each file
        arrayOfDocumentsFromDB.forEach(function(doc, i, arrayOfDocumentsFromDB) {
            //split
            doc = doc.split("/");
            docName = doc[doc.length - 1]
            //visualize
            //source -> templates/cards.html
            document.body.insertAdjacentHTML('beforeend', `<div class="fileDiv"><p class="fileName">${docName}</p><img class="fileImg"><form class="editButtons"><button class="downloadButton">download</button><button class="editButton" onclick="editFile('${docName}')">edit</button><button class="deleteButton" onclick="deleteFile('${docName}')">delete</button></form></div>`);
        });
    });
    req.send(file);
});

document.addEventListener("keyup", function (e){
    if (findForm.style.display == "block"){
        e.preventDefault;
        var text = document.getElementById("dataToFind").value;
        search(text);
    }
})

async function search(text){
    let results = "";
    arrayOfDocumentsFromDB.forEach(function (doc, i, arrayOfDocumentsFromDB){
        doc = doc.split("/");
        var docName = doc[doc.length - 1]
        if (docName.includes(text)){
            //source -> templates/searchResult.html
            results += `<div class="searchResult"><svg class="resultSVG"></svg><span class="resultName">${docName}</span><button class="downloadButtonResult">download</button><button class="editButtonResult" onclick="editFile('${docName}')">edit</button><button class="deleteButtonResult" onclick="deleteFile('${docName}')">delete</button></div>`
        }
    }
    )
    if (results != ""){
        try{
            document.getElementById("searchResults").remove()
        } catch {
    
        }
        document.body.insertAdjacentHTML('beforeend', `<div id="searchResults">${results}</div>`);}
}

function deleteFile(filename){
    var message = JSON.stringify({filename: filename, username: username})
    console.log(message)
    let req = new XMLHttpRequest();
    req.open("POST", "/deleteFile", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        console.log(req.response);
        alert("file is deleted, please refresh page")
        return false
        });
    req.send(message);
}

function editFile(filename){
    var message = JSON.stringify({filename: filename, username: username})
    console.log(message)
    let req = new XMLHttpRequest();
    req.open("POST", "/editFile", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        console.log(req.response);
        var text = req.response.text
        console.log(text)
        var binary = req.response.binary
        if (binary == undefined) {
            editor.style.display = 'block';
            document.getElementById("filename").value = filename;
            document.getElementById("text").value = text;
        } else {
            alert("this function is unavaliable now. comming soon")
        }
        return false
        });
    req.send(message);
}