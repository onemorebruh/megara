var new_remark_name;
//find
FindButton.addEventListener('click', {
	handleEvent(event) {
		document.body.innerHTML += '<div class="right" id="DialogueBox"><p>find remark</p><form id="search1"><input id="Search" name="FindSearch" placeholder="type here" type="search"><br><input type="checkbox" id="InPublic" name="InPublic" checked><label for="InPublic">search in public files too</label><br><input type="checkbox" id="InText" name="InText"><lable for="InText">search inside of file</label><br><button type="submit" id="SearchButton">find</button></form></div>';// here will be line for searching which opens md docs as txt
		SearchButton.addEventListener("click", function (e) {
			e.preventDefault();
			let name = document.getElementById("Search").value;
			let InPublic = document.getElementById("InPublic").checked;
			let InText = document.getElementById("InText").checked;
			console.log("variables " + name, InPublic, InText);
			let post = JSON.stringify({name: name, InPublic: InPublic, InText: InText});
			let request = new XMLHttpRequest();
			request.open("POST", "/find", true);   
			request.setRequestHeader("Content-Type", "application/json");
			request.addEventListener("load", function () {
				let found_data = JSON.parse(request.response);
				console.log("response " + found_data);
				for(var number in found_data){
					document.body.innerHTML += '<tr><td><div><form id="file' + number + '" class="FoundFile"><p>' + found_data[number] + '</p><button id="Edit' + number + '" onclick="edit(' + number + ')">edit</button><button id="Delete' + number + '">delete</button><button id="Publish' + number + '">to publish</button></form></div></td></tr>';
				};
			});
			request.send(post);//send message to the server
		});
	}
});
//write
WriteButton.addEventListener('click',{
	handleEvent(event) {
		new_remark_name = prompt("write the name of your new remark");
		document.body.innerHTML += '<div class="right" id="DialogueBox"><p>' + new_remark_name + '</p><textarea name="NewRemark" id="Text"># ' + new_remark_name + '</textarea><table id="editor"><tr><td><form id="save"><button class="editorbutton" id="SaveButton">save</button></form></td></tr><tr><td><form id="view"><button class="editorbutton">view</button></form></td></tr><tr><td><form id="addimage"><button class="editorbutton">add<br>image</button></form></td></tr></table></div>';//it have to open text edditor
		SaveButton.addEventListener('click', function (e) {
			e.preventDefault();
			text = document.getElementById("Text").value;
			console.log("variable " + text);
			let post = JSON.stringify({text: text, title: window.new_remark_name});
			let request = new XMLHttpRequest();
			request.open("POST", "/write", true);   
			request.setRequestHeader("Content-Type", "application/json");
			request.addEventListener("load", function () {
				let written_text = JSON.parse(request.response);
				console.log("response " + written_text.text);
			});
			request.send(post);
		});
	}
});

WhoAmIButton.addEventListener('click', function (e) {
	e.preventDefault();
	let post = JSON.stringify({action: 'WhoAmI'});
	let request = new XMLHttpRequest();
	request.open("POST", "/action", true);   
	request.setRequestHeader("Content-Type", "application/json");
	request.addEventListener("load", function () {
		let action = JSON.parse(request.response);
		console.log(action.action);
		alert(action.action);
	});
	request.send(post);
});

function edit(number){
	let post = JSON.stringify({action: 'Edit', number: number});
	console.log({action: 'Edit', number: number})
	let request = new XMLHttpRequest();
	request.open("POST", "/action", true);
	request.setRequestHeader("Content-Type", "application/json");
	request.addEventListener("load", function () {
		let action = JSON.parse(request.response);
		console.log('post ' + action);
	});
	request.send(post);
	setTimeout(function(){}, 5000);
}
//not finished
RelogButton.addEventListener('click', function (e) {
	document.body.innerHTML += "";
	window.location.href = (window.location + "login").replace("?", "");
});
AboutButton.addEventListener('click', function (e) {
	document.body.innerHTML += "";
	window.location.href = (window.location + "about").replace("?", "");
});