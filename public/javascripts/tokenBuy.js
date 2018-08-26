var web3js = 0;
var currentVal = 0;
var buyingPrice = 0;
var sellingPrice = 0;

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        alert('No web3js detected. You should install Metamask first');
        window.location.href = '/';
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    }

    // Now you can start your app & access web3 freely:
    var theContract = web3js.eth.contract(contract_abi).at(contract_addr);
    var theToken = web3js.eth.contract(token_abi).at(token_addr);
    theToken.balanceOf.call(ethAddr, function(error, result) {
        if (error) throw error;
        currentVal = result;
        document.getElementById("currentTokenAmount").innerHTML = currentVal + " Tokens";
    });
    theContract.tokenPerEther_buyPrice.call(function(error, result) {
        if (error) throw error;
        buyingPrice = result;
        document.getElementById("buyingPrice").innerHTML = buyingPrice + " Tokens";
    });
    theContract.tokenPerEther_sellPrice.call(function(error, result) {
        if (error) throw error;
        sellingPrice = result;
        document.getElementById("sellingPrice").innerHTML = sellingPrice + " Tokens";
    });

    document.getElementById('TokenBuy').onclick = function() {
        $("#ErrorMsg").addClass('invisible');
        buy();
    };
    document.getElementById('TokenSell').onclick = function() {
        $("#ErrorMsg").addClass('invisible');
        sell();
    };

    function buy() {
        var buyTokenBy = parseInt(document.getElementById("TokenBuyValue").value);
        $("#TokenBuyValue").val("");
        var wei = web3js.toWei(String(buyTokenBy), 'ether');
        theContract.buyToken.sendTransaction(buyTokenBy, {
            'from': ethAddr,
            'gas': 4700000,
            'value': wei / buyingPrice,
        }, function(error7, result7) {
            $("#ErrorMsg").removeClass("invisible");
            $("#ErrorMsg").html("Your transaction is still in process\nPlease wait...");
            setInterval(function() {
                theToken.balanceOf.call(ethAddr, function(err8, res8) {
                    if (err8) throw err8;
                    if (res8.toNumber() != currentVal.toNumber()) {
                        window.location.href = '/tokenstore';
                    }
                });
            }, 2000);
        });
    }

    function sell() {
        var sellTokenBy = parseInt(document.getElementById("TokenSellValue").value);
        $("#TokenSellValue").val("");
        if (currentVal >= sellTokenBy) {
            theToken.approveAndCallSellToken.sendTransaction(contract_addr, sellTokenBy, {
                'from': ethAddr,
                'gas': 4700000,
            }, function(error7, result7) {
                $("#ErrorMsg").removeClass("invisible");
                $("#ErrorMsg").html("Your transaction is still in process\nPlease wait...");
                setInterval(function() {
                    theToken.balanceOf.call(ethAddr, function(err8, res8) {
                        if (err8) throw err8;
                        if (res8.toNumber() != currentVal.toNumber()) {
                            window.location.href = '/tokenstore';
                        }
                    });
                }, 2000);
            });
        } else {
            $("#ErrorMsg").removeClass('invisible');
            $("#ErrorMsg").html('You do not have that much token to be sold');
        }
    }
});
