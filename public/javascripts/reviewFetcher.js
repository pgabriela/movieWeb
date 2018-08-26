var web3js = 0;

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        alert('No web3js detected. You should install Metamask or else, you can only see movies available and read their reviews.');
        window.location.href = '/';
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
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
            var oneReviewRow = "";
            oneReviewRow += "<form action='/review' method='post' id='refresher'>";
            oneReviewRow += "<input class='invisible' name='producer' value='" + movieAddr + "'/>";
            oneReviewRow += "<input class='invisible' name='movieName' value='" + movieTitle + "'/>";
            oneReviewRow += "</form>";
            document.getElementById("reviewsPlaceholder").innerHTML += oneReviewRow;
            $("#refresher").submit();
        });
    };

    theContract.getMovieReviewCount.call(movieAddr, movieTitle, function(eRC, rRC){
        if(eRC) window.location.href = '/';
        for(let c=0; c<rRC.toNumber(); c++){
            theContract.getMovieReviewRatingAtIndex.call(movieAddr, movieTitle, c, function(eRR, rRR){
                if(eRR) window.location.href = '/';
                theContract.getMovieReviewCommentAtIndex.call(movieAddr, movieTitle, c, function(eRCom, rRCom){
                    if(eRCom) window.location.href = '/';
                    theContract.getMovieReviewReviewerNameAtIndex.call(movieAddr, movieTitle, c, function(eRN, rRN){
                        if(eRN) window.location.href = '/';
                        var oneReviewRow = "";
                        oneReviewRow += '<div class="row" id="row2">';
                        oneReviewRow += '<div class="col-1"></div>';
                        oneReviewRow += '<div class="col-2">';
                        oneReviewRow += '<div id="grade_gray">';
                        oneReviewRow += '<p id="grade_yello" style="width: ' + rRR.toNumber() + '0%"></p>';
                        oneReviewRow += '</div>';
                        oneReviewRow += '<h6 style="float: left; color: white; margin-left: 7%">' + rRR.toNumber() + '/10</h6>';
                        oneReviewRow += '</div>';
                        oneReviewRow += '<div class="col-7">';
                        oneReviewRow += '<h6 style="color: white">' + rRCom + '</h6>';
                        oneReviewRow += '</div>';
                        oneReviewRow += '<div class="col-2">';
                        oneReviewRow += '<h6 style="color: white">By: ' + rRN + '</h6>';
                        oneReviewRow += '</div>';
                        oneReviewRow += '</div>';
                        document.getElementById("reviewsPlaceholder").innerHTML += oneReviewRow;
                    });
                });
            });
        }
    });
});
