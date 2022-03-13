var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username")
var userButton = document.getElementById('user');
var newFileButton = document.getElementById("newFile");
var findFileButton = document.getElementById('findFile');
var editor = document.getElementById('editorMainDiv');
var arrayOfDocumentsFromDB = [];


//write username in the button
userButton.insertAdjacentHTML('afterbegin', `<span>${username}</span>`);

newFileButton.addEventListener("click", function (e) {
    e.preventDefault();
    editor.style.display = 'block';
})

var saveButton = document.getElementById('SaveButton').addEventListener("click", async function (e) {
  e.preventDefault();
  var file = await JSON.stringify({
      text: document.getElementById('text').value,
      filename: document.getElementById("filename").value,
      username: username,
  });
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

document.addEventListener("DOMContentLoaded", async function readFromDBAndVisualaze (e) {
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
        console.log(arrayOfDocumentsFromDB);//proof that data appearse in browser
        //TODO visualize each file
        arrayOfDocumentsFromDB.forEach(function(doc, i, arrayOfDocumentsFromDB) {
            //split
            doc = doc.split("/");
            docName = doc[doc.length - 1]
            //visualize
            document.body.insertAdjacentHTML('beforeend', `<div class="fileDiv"><p class="fileName">${docName}</p><img class="fileImg"><form class="editButtons"><button class="downloadButton">download</button><button class="editButton">edit</button><button class="deleteButton">delete</button><button class="shareButton">share</button></form></div>`);
        });
    });
    req.send(file);
});