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
    var theToken = web3js.eth.contract(token_abi).at(token_addr);
    theContract.getMoviePrice.call(producer, movieName, function(error, result) {
        if (error) throw error;
        theToken.approveAndCall.sendTransaction(contract_addr, result.toNumber(), producer, movieName, {
            'from': ethAddr,
            'gas': 4700000
        }, function(error2, result2) {
            if (error2) throw error2;
            if (result2) {
                window.location.href = '/mov?producer=' + producer + '&movieName=' + movieName;
            } else {
                console.log(result2);
                console.log("Error");
            }
        });
    });
});
