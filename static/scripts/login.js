var adminPanelButton = document.getElementById("adminPanelButton");

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
				console.log(result);
		}else {
				alert(response.status);
		}
});
