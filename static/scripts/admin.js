document.getElementById("databaseLiLog").addEventListener("click", async function (event) {
		event.preventDefault;
		//generate table
		
		//read logs
		let response = await fetch("/admin/db/log");

        if(response.ok) {
                let result = await response.json();
				console.table(result);
				var table = `
						<table id="table">
						<tr><th>id</th><th>user</th><th>action</th><th>time</th></tr>
						`
				result.forEach(function(item, i, result){
						table += `<tr><td>${item.id}</td><td>${item.userId}</td><td>${item.action}</td><td>${item.createdAt}</td>`;
				});
				table += "</table>"

			try{
				document.getElementById("table").remove();
				} catch{
					document.getElementById("main").insertAdjacentHTML("afterbegin", table);
				}
        }else {
                alert(response.status);
		} 
});

document.getElementById("databaseLiUser").addEventListener("click", async function (event) {
	event.preventDefault;
	//generate table
	
	//read logs
	let response = await fetch("/admin/db/user");

	if(response.ok) {
			let result = await response.json();
			console.table(result);
			var table = `
					<table id="table">
					<tr><th>id</th><th>login</th><th>access to log</th><th>access to file</th><th>access to user</th><th>time</th></tr>
					`
			result.forEach(function(item, i, result){
					table += `<tr><td>${item.id}</td><td>${item.userId}</td><td>${item.accessToLog}</td><td>${item.accessToFile}</td><td>${item.accessToUser}</td><td>${item.createdAt}</td>`;
			});
			table += "</table>"
			try{
				document.getElementById("table").remove();
				} catch{
			}
			document.getElementById("main").insertAdjacentHTML("afterbegin", table);
	}else {
			alert(response.status);
	} 
});

document.getElementById("databaseLiFile").addEventListener("click", async function (event) {
	event.preventDefault;
	//generate table
	
	//read logs
	let response = await fetch("/admin/db/file");

	if(response.ok) {
			let result = await response.json();
			console.table(result);
			var table = `
					<table id="table">
					<tr><th>id</th><th>user</th><th>filename</th><th>time</th></tr>
					`
			result.forEach(function(item, i, result){
					table += `<tr><td>${item.id}</td><td>${item.userId}</td><td>${item.name}</td><td>${item.createdAt}</td>`;
			});
			table += "</table>"
			try{
				document.getElementById("table").remove();
				} catch{
			}
			document.getElementById("main").insertAdjacentHTML("afterbegin", table);
	}else {
			alert(response.status);
	} 
});