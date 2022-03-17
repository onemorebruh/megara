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
    findForm.style.display = 'block';
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
            document.body.insertAdjacentHTML('beforeend', `<div class="fileDiv"><p class="fileName">${docName}</p><img class="fileImg"><form class="editButtons"><button class="downloadButton">download</button><button class="editButton">edit</button><button class="deleteButton">delete</button><button class="shareButton">share</button></form></div>`);
        });
    });
    req.send(file);
});

document.addEventListener("keyup", function (e){
    e.preventDefault;
    var text = document.getElementById("dataToFind").value;
    search(text);
})

async function search(text){
    let results = "";
    arrayOfDocumentsFromDB.forEach(function (doc, i, arrayOfDocumentsFromDB){
        doc = doc.split("/");
        var docName = doc[doc.length - 1]
        if (docName.includes(text)){
            //source -> templates/searchResult.html
            results += `<div class="searchResult"><svg class="resultSVG"></svg><span class="resultName">${docName}</span><button class="downloadButtonResult">download</button><button class="editButtonResult">edit</button><button class="deleteButtonResult">delete</button><button class="shareButtonResult">share</button></div>`
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