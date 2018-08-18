$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a,.links a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

$("#registerForm").on('submit', function(e){
  var addrVal = $("#ethAddr").val();
  if(addrVal == ""){
    e.preventDefault();
    alert("Registration process failed because you have not logged in to the Metamask. Please login to Metamask and refresh this page");
  }
  $('#ethAddr').prop("disabled", false);
});


var web3js = 0;

window.addEventListener('load', function() {

	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
		web3js = new Web3(web3.currentProvider);
	} else {
		alert('No web3js detected. You should install Metamask');
		window.location.href = '/';
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	}

	// Now you can start your app & access web3 freely:
	web3js.eth.getAccounts(function(err, res){
		if(typeof res[0] != 'undefined'){
			document.getElementById("ethAddr").value = res[0];
		}
	});
});
