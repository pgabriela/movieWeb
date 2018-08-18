var web3js = 0;
var account = 0;

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
	if(web3js != 0){
		if(account == 0){
			document.getElementById("modalBody").innerHTML = "<p>Please login first if you want to watch this movie</p>";
			document.getElementById("modalBody").innerHTML += "<p>Your are going to be redirected to review page of this movie</p>";
			document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
			document.getElementById("chosenMovieForm").action = '/review';
			document.getElementById("modalYes").onclick = function(e){
				document.getElementById("chosenMovieForm").submit();
			};
		} else {
			// HAVENT CHECK MAIN NET
			var theToken = web3js.eth.contract(token_abi).at(token_addr);
			var theContract = web3js.eth.contract(contract_abi).at(contract_addr);
			theToken.balanceOf(account, function(error, result){
				var currToken = result;
				var producer = document.getElementById("chosenMovieProd").value;
				var movieName = document.getElementById("chosenMovieName").value;
				var moviePrice = 0;
				theContract.getMoviePrice(producer, movieName, function(er, pr){
					if(er) throw er;
					moviePrice = pr.toNumber();
					theContract.hasPaid(producer, account, movieName, function(e, hasP){
						if(hasP.toNumber() > 0){
							document.getElementById("modalBody").innerHTML = "<p>Your current balance: " + currToken + " Token</p>";
							document.getElementById("modalBody").innerHTML += "<p>This movie is free for you</p>";
							document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
							document.getElementById("modalYes").onclick = function(e){
								document.getElementById("chosenMovieForm").submit();
							};
						} else {
							if(currToken < moviePrice){
								document.getElementById("modalBody").innerHTML = "<p>You don't have enough token</p>";
								document.getElementById("modalBody").innerHTML += "<p>You are going to be redirected to Token Store</p>";
								document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
								document.getElementById("modalYes").href = '/tokenstore';
							} else {
								document.getElementById("modalBody").innerHTML = "<p>Your current balance: " + currToken + " Token</p>";
								document.getElementById("modalBody").innerHTML += "<p>This movie costs " + moviePrice + " Token</p>";
								document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
								document.getElementById("modalYes").onclick = function(e){
									document.getElementById("chosenMovieForm").submit();
								};
							}
						}
					});
				});
			});
		}
	} else {
		// CAN ONLY READ REVIEWS
		document.getElementById("modalBody").innerHTML = "<p>No web3js detected</p>";
		document.getElementById("modalBody").innerHTML += "<p>You can only read this movie's reviews</p>";
		document.getElementById("modalBody").innerHTML += "<p>Do you want to continue</p>";
		document.getElementById("chosenMovieForm").action = "/review";
		document.getElementById("modalYes").onclick = function(e){
			document.getElementById("chosenMovieForm").submit();
		};
	}
});

function loginBtn(){
  window.location.href = '/login';
}


var dropdownStatus = 0;

$("#loggedName").hover(function(){
	$(this).css("color", "#ffc107");
	if(dropdownStatus == 0){
		$(this).dropdown('toggle');
		dropdownStatus = 1;
	}
}, function(){
	$(this).css("color", "#ffc107");
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
	$(this).css("color", "#ffc107");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});

$("#BuyTokenBtn").hover(function(){
	$(this).css("background-color", "rgba(0,0,0,0.5)");
	$(this).css("color", "#ffc107");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});

$("#logout").hover(function(){
	$(this).css("background-color", "rgba(0,0,0,0.5)");
	$(this).css("color", "#ffc107");
}, function(){
	$(this).css("background-color", "rgba(0,0,0,0)");
});


window.addEventListener('load', function() {

	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
		web3js = new Web3(web3.currentProvider);
	} else {
		alert('No web3js detected. You should install Metamask or else, you can only see movies available and read their reviews.');
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	}

	// Now you can start your app & access web3 freely:
	account = ethAddr;
	console.log(account);
});
