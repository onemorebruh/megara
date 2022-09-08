var adminPanelButton = document.getElementById("adminPanelButton");
var loginButton = document.getElementById("loginButton");
var signUpButton = document.getElementById("signUpButton");

adminPanelButton.addEventListener("click", async function(event){
		event.preventDefault();
		let response = await fetch("/admin", {
				method: "POST",
				headers: {
						"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify({
						"login": document.getElementById("loginInput").value, 
						"password": document.getElementById("loginPassword").value})
		});

		if(response.ok) {
				let result = await response.json();
				alert(result.message);
				window.location.replace(document.URL + result.url);
		}else {
				alert(response.status);
		}
});


signUpButton.addEventListener("click", async function(event){
		event.preventDefault();
		let response = await fetch("/user/reg", {
				method: "POST",
				headers: {
						"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify({
						"login": document.getElementById("loginInput").value, 
						"password": document.getElementById("loginPassword").value})
		});

		if(response.ok) {
				let result = await response.json();
				alert(result.message);
				window.location.replace(document.URL + result.url);
		}else {
				alert(response.status);
		}
});


loginButton.addEventListener("click", async function(event){
		event.preventDefault();
		let response = await fetch("/user/login", {
				method: "POST",
				headers: {
						"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify({
						"login": document.getElementById("loginInput").value, 
						"password": document.getElementById("loginPassword").value})
		});

		if(response.ok) {
				let result = await response.json();
				alert(result.message);
				window.location.replace(document.URL + result.url);
		}else {
				alert(response.status);
		}
});
