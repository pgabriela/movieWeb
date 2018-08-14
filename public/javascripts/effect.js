for(var counter=0; counter<3; counter++){
	for(var i=0; i<6; i++){
		let selector1 = "movieImg" + counter + "" + i;
		let selector2 = "movieText" + counter + "" + i;
		let selector3 = "playIcon" + counter + "" + i;
		document.getElementById("movieCard" + counter + "" + i).addEventListener("mouseover", function cardHover(){
			document.getElementById(selector2).style.opacity = "0.3";
			document.getElementById(selector3).classList.remove("invisible");
			document.getElementById(selector1).style.opacity = "0.3";
		});
	}
}

for(var counter=0; counter<3; counter++){
	for(var i=0; i<6; i++){
		let selector1 = "movieImg" + counter + "" + i;
		let selector2 = "movieText" + counter + "" + i;
		let selector3 = "playIcon" + counter + "" + i;
		document.getElementById("movieCard" + counter + "" + i).addEventListener("mouseout", function cardHover(){
			document.getElementById(selector1).style.opacity = "1";
			document.getElementById(selector2).style.opacity = "1";
			document.getElementById(selector3).classList.add("invisible");
		});
	}
}

$("#exampleModal").on("show.bs.modal", function(event){
	if(true){ // check if user token is not enough
		document.getElementById("modalBody").innerHTML = "<p>You don't have enough token</p>";
		document.getElementById("modalBody").innerHTML += "<p>You are going to be redirected to Token Store</p>";
		document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
	}
});
