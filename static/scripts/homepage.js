
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username")
var userButton = document.getElementById('user');
var newFileButton = document.getElementById("newFile");
var findFileButton = document.getElementById('findFile');
var editor = document.getElementById('editor');
var findForm = document.getElementById('searchLine');
var arrayOfDocumentsFromDB = [];

async function checkForUser (){
    let lengthOfURL;
    if(url.searchParams.get("username") == undefined){
        lengthOfURL = window.location.href.length
        window.location.href = `${url_string.slice(0,lengthOfURL-1)}/login`;
    }
}
checkForUser();
//write username in the button
userButton.insertAdjacentHTML('afterbegin', `<span>${username}</span>`);//writes username

newFileButton.addEventListener("click", function (e) {// shows text editor
  e.preventDefault();
    editor.style.display = 'block';
})

findFileButton.addEventListener("click", function (e) {
    e.preventDefault();
    if(findForm.style.display == 'block'){//hides search if it is visible
        findForm.style.display = 'none';
        document.getElementById("searchResults").style.display = "none";
    } else {
        findForm.style.display = 'block';//shows search
    }
})

var saveButton = document.getElementById('form__saveButton').addEventListener("click", async function (e) {//saves file
  e.preventDefault();
  
  var file = await JSON.stringify({//makes object
      text: document.getElementById('textForm__text').value,
      filename: document.getElementById("form__filename").value,
      username: username,
  });
  console.log(file)
  let req = new XMLHttpRequest();//generates request
  req.open("POST", "/api/file/new", true);   
  req.setRequestHeader("Content-Type", "application/json");
  req.addEventListener("load", function () {//when response came back
      let answer = JSON.parse(req.response);
      alert(answer.message);
  });
  //send request, hide editor and update the page so new file will appear
  req.send(file);
  editor.style.display = 'none';
  setTimeout(function(){
    location.reload(true);
  }, 2000);
})

document.addEventListener("DOMContentLoaded", async function readFromDBAndVisualaze (e) {//load filenames from db
    e.preventDefault();
    var file = await JSON.stringify({
        username: username
    })
    let req = new XMLHttpRequest();
    req.open("GET", "/api/readFiles", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let answer = JSON.parse(req.response);
        let docName;
        arrayOfDocumentsFromDB = answer.documents;
        // visualize each file
        arrayOfDocumentsFromDB.forEach(function(doc, i, arrayOfDocumentsFromDB) {
            //split
            docName = doc.filename;
            //visualize
            //source -> templates/cards.html                    file object template
            document.body.insertAdjacentHTML('beforeend', `<div class="file" id="file${i}" style="--i:${i}">
                                                                <p class="file__name">${docName}</p>
                                                                <div class="file__img">${SVG.txt}</div>
                                                                <div class="editButtons">
                                                                    <button class="downloadButton" onclick="event.preventDefault; downloadFile('${docName}')">download</button>
                                                                    <button class="editButton" onclick="event.preventDefault; editFile('${docName}')">edit</button>
                                                                    <button class="deleteButton" onclick="event.preventDefault; deleteFile('${docName}', '${docName}')">delete</button>
                                                                </div>
                                                            </div>`);
        });
    });
    req.send(file);
});

document.addEventListener("keyup", function (e){// reloads search each time user pressed any button
    if (findForm.style.display == "block"){
        e.preventDefault;
        var text = document.getElementById("searchLine__input").value;
        search(text);
    }
})

document.getElementById("user").addEventListener('click', function (e) {//opens and close user menu
    e.preventDefault;
    if(document.getElementById("userMenu").style.display == 'block'){
    document.getElementById("userMenu").style.display = 'none';
    } else {
        document.getElementById("userMenu").style.display = 'block';
    }
})

document.getElementById("userMenu__logOut").addEventListener("click", function() {
    let link = url_string.split("?")
    window.location.href = `${link[0]}/login`;
})

async function search(text){
    let results = "";
  arrayOfDocumentsFromDB.forEach(function (doc, i, arrayOfDocumentsFromDB){
    docName = doc.filename;
      if (docName.includes(text)){//TODO refactor with filter
            //source -> templates/searchResult.html
            results += `<div class="searchResult" id="${docName}">
                            <div class="resultSVG">${SVG.txt}</div>
                            <span class="resultName">${docName}</span>
                            <button class="buttonResult__download" onclick="event.preventDefault; downloadFile('${docName}')">download</button>
                            <button class="buttonResult__edit" onclick="event.preventDefault; editFile('${docName}')">edit</button>
                            <button class="buttonResult__delete" onclick="event.preventDefault; deleteFile('${docName}', '${docName}')">delete</button>
                        </div>`
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

function deleteFile(filename, docName){
    var message = JSON.stringify({filename: filename, username: username})
    console.log(message)
    let req = new XMLHttpRequest();
    req.open("POST", "/api/file/delete", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        console.log(req.response);
        alert("file is deleted");
        document.getElementById(docName).style.display = "none";
    });
    setTimeout(() => {
      location.reload()
    }, 1000);
    req.send(message);
}

function editFile(filename){
    var message = JSON.stringify({filename: filename, username: username})
    console.log(message)
    let req = new XMLHttpRequest();
    req.open("POST", "/api/file/edit", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", async function () {
        console.log(req.response);
        var answer = await JSON.parse(req.response);
        console.log(answer.text)
        editor.style.display = 'block';
        document.getElementById("filename").value = filename;
        document.getElementById("text").value = answer.text;
        return false
        });
    req.send(message);
}

function downloadFile(filename){
    var message = JSON.stringify({filename: filename, username: username})
    let req = new XMLHttpRequest();
    req.open("POST", "/api/file/edit", true);   //it reads file's data but not edit
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", async function () {
        var answer = await JSON.parse(req.response);
        console.log(answer.text)
        var downloadElement = document.createElement('a');
        downloadElement.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(answer.text));
        downloadElement.setAttribute('download', filename);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        return false
        });
    req.send(message);

}
document.getElementById("editor").addEventListener("drop", function(e){//TODO rewrite
    e.preventDefault;
    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            var file = e.dataTransfer.items[i].getAsFile();
            console.log(file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
        }
      }
    message = new FormData();
    message.append("photo", file);
        let req = new XMLHttpRequest();
        req.open("POST", "/api/file/edit", true);   
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", async function () {
        console.log(req.response);
        var answer = await JSON.parse(req.response);
        console.log(answer.text)
        editor.style.display = 'none';
        });
        req.send(message);
})
