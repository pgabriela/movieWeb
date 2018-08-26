var web3js = 0;
var socket = io();

socket.on('oneReview', function(data){
    var oneReviewRow = "";
    oneReviewRow += '<div class="row" id="row2">';
    oneReviewRow += '<div class="col-1"></div>';
    oneReviewRow += '<div class="col-2">';
    oneReviewRow += '<div id="grade_gray">';
    oneReviewRow += '<p id="grade_yello" style="width: ' + data.rRR + '0%"></p>';
    oneReviewRow += '</div>';
    oneReviewRow += '<h6 style="float: left; color: white; margin-left: 7%">' + data.rRR + '/10</h6>';
    oneReviewRow += '</div>';
    oneReviewRow += '<div class="col-7">';
    oneReviewRow += '<h6 style="color: white">' + data.rRCom + '</h6>';
    oneReviewRow += '</div>';
    oneReviewRow += '<div class="col-2">';
    oneReviewRow += '<h6 style="color: white">By: ' + data.rRN + '</h6>';
    oneReviewRow += '</div>';
    oneReviewRow += '</div>';
    document.getElementById("reviewsPlaceholder").innerHTML += oneReviewRow;
});

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        alert('No web3js detected. You should install Metamask or else, you can only see movies available and their details.');
        $("#reviewForm").addClass("invisible");
        socket.emit('fetchReviews', { movieAddr: movieAddr, movieTitle: movieTitle });
	return;
    }

    // Now you can start your app & access web3 freely:
    var theContract = web3js.eth.contract(contract_abi).at(contract_addr);
    if(ethAddr == "") $("#reviewForm").addClass("invisible");
    theContract.hasPaid(movieAddr, ethAddr, movieTitle, function(eHP, rHP){
        if(rHP.toNumber() <= 0){
            $("#reviewForm").html("<h5 class='text-center' style='color: white'>*You can only make a review if you have watched this movie*</h5>");
        }
    });
    theContract.hasReviewed(movieAddr, ethAddr, movieTitle, function(eHR, rHR){
        if(rHR){
            $("#reviewForm").html("<h5 class='text-center' style='color: white'>*You can only make one review for the same movie*</h5>");
        }
    });

    document.getElementById("submitReviewBtn").onclick = function(e){
        e.preventDefault();
        var ratingRaw = $("#ratingField").html();
        var rating = parseInt(ratingRaw.slice(3, 4));
        var comment = $("#commentText").val();
        $("#commentText").val("");
        theContract.writeReview.sendTransaction(movieAddr, movieTitle, comment, rating, {
            'from': ethAddr,
            'gas': 4700000
        }, function(eWR, rWR){
            setInterval(function(){
                theContract.hasReviewed.call(movieAddr, ethAddr, movieTitle, function(eHR, rHR){
                    if(rHR){
                        var oneReviewRow = "";
                        oneReviewRow += "<form action='/review' method='post' id='refresher'>";
                        oneReviewRow += "<input class='invisible' name='producer' value='" + movieAddr + "'/>";
                        oneReviewRow += "<input class='invisible' name='movieName' value='" + movieTitle + "'/>";
                        oneReviewRow += "</form>";
                        document.getElementById("reviewsPlaceholder").innerHTML += oneReviewRow;
                        $("#refresher").submit();
                    }
                });
            }, 500);
        });
    };
    socket.emit('fetchReviews', { movieAddr: movieAddr, movieTitle: movieTitle });
});
