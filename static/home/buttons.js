var new_remark_name;
FindButton.addEventListener('click', {
	handleEvent(event) {
		document.body.innerHTML += '<div class="right" id="dialoguebox"><p>find remark</p><form id="search1"><input id="search" name="FindSearch" placeholder="type here" type="search"><br><input type="checkbox" id="inPublic" name="inPublic" checked><label for="inPublic">search in public files too</label><br><input type="checkbox" id="inText" name="inText"><lable for="inText">search inside of file</label></form></div>';// here will be line for searching which opens md docs as txt
	}
});
WriteButton.addEventListener('click',{
	handleEvent(event) {
new_remark_name = prompt("write the name of your new remark");
		document.body.innerHTML += '<div class="right" id="dialoguebox"><p>' + new_remark_name + '</p><textarea name="NewRemark">## ' + new_remark_name + '</textarea><table id="editor"><tr><td><form id="save"><button class="editorbutton">save</button></form></td></tr><tr><td><form id="view"><button class="editorbutton">view</button></form></td></tr><tr><td><form id="addimage"><button class="editorbutton">add<br>image</button></form></td></tr></table></div>';//it have to open text edditor
	}
});
