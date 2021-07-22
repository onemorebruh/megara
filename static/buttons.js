var new_remark_name;
//find
FindButton.addEventListener('click', {
	handleEvent(event) {
		document.body.innerHTML += '<div class="right" id="dialoguebox"><p>find remark</p><form id="search1"><input id="search" name="FindSearch" placeholder="type here" type="search"><br><input type="checkbox" id="inPublic" name="inPublic" checked><label for="inPublic">search in public files too</label><br><input type="checkbox" id="inText" name="inText"><lable for="inText">search inside of file</label></form></div>';// here will be line for searching which opens md docs as txt
	}
});
//write
WriteButton.addEventListener('click',{
	handleEvent(event) {
		new_remark_name = prompt("write the name of your new remark");
		document.body.innerHTML += '<div class="right" id="dialoguebox"><p>' + new_remark_name + '</p><textarea name="NewRemark" id="Text"># ' + new_remark_name + '</textarea><table id="editor"><tr><td><form id="save"><button class="editorbutton" id="SaveButton">save</button></form></td></tr><tr><td><form id="view"><button class="editorbutton">view</button></form></td></tr><tr><td><form id="addimage"><button class="editorbutton">add<br>image</button></form></td></tr></table></div>';//it have to open text edditor
		SaveButton.addEventListener('click', function (e) {
			e.preventDefault();
			text = document.getElementById("Text").value;
			console.log("variable " + text);
			let post = JSON.stringify({text: text, title: window.new_remark_name});
			let request = new XMLHttpRequest();
			request.open("POST", "/write", true);   
			request.setRequestHeader("Content-Type", "application/json");
			request.addEventListener("load", function () {
				let receivedUser = JSON.parse(request.response);
				console.log("response " + receivedUser.text);
			});
			request.send(post);
		});
	}
});

