let filesUl = document.getElementById("filesUl");
let editor = document.getElementById("editor");
let id = NaN;

async function start (){
let response = await fetch("/user/db/files");

        if(response.ok) {
                let result = await response.json();
				console.table(result);
				result.forEach(function(item, i, result){
                                        document.getElementById("filesUl").insertAdjacentHTML("afterbegin", `<li class="fileLi" id=file${i}>${item.name}</li>`);
				});
                                Array.from(result).forEach(function(item, i ,result){
                                        document.getElementById(`file${i}`).addEventListener("click", function(event){
                                                event.preventDefault;
                                                //set id for editor's buttons
                                                id = i;
                                                //load editor
                                                editor.insertAdjacentHTML("afterbegin", `
                                                        <h3>${result[i].name}</h3>
                                                        <textarea id="textEditor">${result[i].text}</textarea>
                                                        <span id="textVisual">${result[i].text}</span>
                                                `);

                                                filesUl.insertAdjacentHTML("afterend", `
                                                        <ul id="editorButtons">
                                                                <li class="editorButton" id="saveButton">save file</li>
                                                                <li class="editorButton" id="deleteButton">delete file</li>
                                                        </ul>
                                                `);

                                                document.getElementById("saveButton").addEventListener("click", async function(event){
                                                        newFile = {
                                                                id: id,
                                                                name: result[i].name,
                                                                text: document.getElementById("textEditor").value
                                                        };


                                                        let response = await fetch("/user/db/saveFile", {
                                                                method: "POST",
                                                                headers: {
                                                                                "Content-Type": "application/json;charset=utf-8"
                                                                },
                                                                body: JSON.stringify(newFile)
                                                        });

                                                        if(response.ok) {
                                                                        let result = await response.json();
                                                                        alert(result.message);
                                                        }else {
                                                                        alert(response.status);
                                                        }
                                                })

                                                document.getElementById("deleteButton").addEventListener("click", async function(event){
                                                        newFile = {
                                                                id: id,
                                                                name: result[i].name,
                                                                text: document.getElementById("textEditor").value,
                                                        };
                                                        let response = await fetch("/user/db/deleteFile", {
                                                                method: "DELETE",
                                                                headers: {
                                                                                "Content-Type": "application/json;charset=utf-8"
                                                                },
                                                                body: JSON.stringify(newFile)
                                                        });

                                                        if(response.ok) {
                                                                        let result = await response.json();
                                                                        alert(result.message);
                                                        }else {
                                                                        alert(response.status);
                                                        }
                                                })

                                        })
                                })
        }else {
                alert(response.status);
		}
        
        
}


start();

var newFileButton = document.getElementById("newFileButton").addEventListener("click", function(event){
        //generate empty file in editor
        let filename = prompt("type filename");
        event.preventDefault;
        filesUl.insertAdjacentHTML("afterend", `
                <ul id="editorButtons">
                        <li class="editorButton" id="saveButton">save file</li>
                        <!-- <li class="editorButton" id="deleteButton">delete file</li> -->
                </ul>
        `);
        editor.insertAdjacentHTML("afterbegin", `
                <h3>${filename}</h3>
                <textarea id="textEditor"></textarea>
                <span id="textVisual"></span>
        `);
        document.getElementById("saveButton").addEventListener("click", async function(event){
                newFile = {
                        name: filename,
                        text: document.getElementById("textEditor").value
                };

                let response = await fetch("/user/db/saveFile", {
                        method: "POST",
                        headers: {
                                        "Content-Type": "application/json;charset=utf-8"
                        },
                        body: JSON.stringify(newFile)
                });

                if(response.ok) {
                                let result = await response.json();
                                alert(result.message);
                }else {
                                alert(response.status);
                }
        })

        document.getElementById("deleteButton").addEventListener("click", async function(event){
                newFile = {
                        id: id,
                        name: filename,
                        text: document.getElementById("textEditor").value
                };
                let response = await fetch("/user/db/deleteFile", {
                        method: "DELETE",
                        headers: {
                                        "Content-Type": "application/json;charset=utf-8"
                        },
                        body: JSON.stringify(newFile)
                });

                if(response.ok) {
                                let result = await response.json();
                                alert(result.message);
                }else {
                                alert(response.status);
                }
        })
})