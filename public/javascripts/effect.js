for(var counter=0; counter<3; counter++){
	for(var i=0; i<6; i++){
		let selector1 = "movieImg" + counter + "" + i;
		let selector2 = "movieText" + counter + "" + i;
		let selector3 = "playIcon" + counter + "" + i;
		document.getElementById("movieCard" + counter + "" + i).addEventListener("mouseover", function cardHover(){
			document.getElementById(selector1).style.opacity = "0.3";
			document.getElementById(selector2).style.opacity = "0.3";
			document.getElementById(selector3).classList.remove("invisible");
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

function loginBtn(){
  window.location.href = '/login';
}


var dropdownStatus = 0;

$("#loggedName").hover(function(){
	if(dropdownStatus == 0){
		$(this).dropdown('toggle');
		dropdownStatus = 1;
	}
}, function(){
	if(dropdownStatus == 1){
		$(this).dropdown('toggle');
		dropdownStatus = 0;
	}
});

$("#loggedName").click(function(){
	if(dropdownStatus == 0){
		dropdownStatus = 1;
	} else {
		dropdownStatus = 0;
	}
});

$("#loggedMenu").hover(function(){
	if(dropdownStatus == 0){
		$(this).dropdown('toggle');
		dropdownStatus = 1;
	}
}, function(){
	if(dropdownStatus == 1){
		$(this).dropdown('toggle');
		dropdownStatus = 0;
	}
});

$("#loggedMenu").click(function(){
	if(dropdownStatus == 0){
		dropdownStatus = 1;
	} else {
		dropdownStatus = 0;
	}
});

$("#logout").click(function(){
	window.location.href = '/logout';
});

$("#profileBtn").hover(function(){
	$(this).css("background-color", "rgba(0,0,0,0.5)");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});

$("#BuyTokenBtn").hover(function(){
	$(this).css("background-color", "rgba(0,0,0,0.5)");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});

$("#logout").hover(function(){
	$(this).css("background-color", "rgba(0,0,0,0.5)");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});
