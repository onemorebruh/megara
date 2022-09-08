async function start (){
let response = await fetch("/user/db/files");

        if(response.ok) {
                let result = await response.json();
				console.table(result);
				result.forEach(function(item, i, result){
                    document.getElementById("filesUl").insertAdjacentHTML("afterbegin", `<li class="fileLi" id=file${i}>${item.name}</li>`);
				});
        }else {
                alert(response.status);
		}
        
        
}

start();