document.getElementById("databaseLiLog").addEventListener("click", async function (event) {
		event.preventDefault;
		//generate table
		
		//read logs
		let response = await fetch("/admin/db/log");

        if(response.ok) {
                let result = await response.json();
				console.table(result);
				var table = `
						<table>
						<tr><th>id</th><th>user</th><th>action</th><th>time</th></tr>
						`
				result.forEach(function(item, i, result){
						table += `<tr><td>${item.id}</td><td>${item.userId}</td><td>${item.action}</td><td>${item.createdAt}</td>`;
				});
				table += "</table>"
				document.getElementById("main").insertAdjacentHTML("afterbegin", table);
        }else {
                alert(response.status);
		} 
});

