var web3js = 0;
var loopLimit = 10;

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        alert('No web3js detected. You should install Metamask or else, you can only see movies available.');
        window.location.href = '/';
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    }

    // Now you can start your app & access web3 freely:
    var theContract = web3js.eth.contract(contract_abi).at(contract_addr);
    setInterval(function() {
        if (loopLimit < 0) {
            alert("The movie has not been paid");
            window.location.href = '/';
        }
        loopLimit--;
        theContract.hasPaid(producer, ethAddr, movieName, function(error, result) {
            if (error) throw error;
            if (result.toNumber() > 0) {
                window.location.href = '/mov?producer=' + producer + '&movieName=' + movieName;
            } else {
                console.log(result.toNumber());
                console.log("Error");
            }
        });
    }, 2000);
});
