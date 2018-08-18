var token_addr = "0x62d69f6867A0A084C6d313943dC22023Bc263691";
var contract_addr = "0x7C276DcAab99BD16163c1bcce671CaD6A1ec0945";
var token_abi = [
	{
		"constant":true,
		"inputs":[],
		"name":"name",
		"outputs":[
			{
				"name":"",
				"type":"string"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_spender",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"approve",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[],
		"name":"totalSupply",
		"outputs":[
			{
				"name":"",
				"type":"uint256"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_spender",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			},
			{
				"name":"producer",
				"type":"address"
			},
			{
				"name":"movieName",
				"type":"string"
			}
		],
		"name":"approveAndCall",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_from",
				"type":"address"
			},
			{
				"name":"_to",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"transferFrom",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[],
		"name":"decimals",
		"outputs":[
			{
				"name":"",
				"type":"uint8"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_spender",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"approveAndCall",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"burn",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},{
		"constant":true,
		"inputs":[
			{
				"name":"",
				"type":"address"
			}
		],
		"name":"balanceOf",
		"outputs":[
			{
				"name":"",
				"type":"uint256"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"target",
				"type":"address"
			},
			{
				"name":"mintedAmount",
				"type":"uint256"
			}
		],
		"name":"mintToken",
		"outputs":[],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_from",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"burnFrom",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[],
		"name":"symbol",
		"outputs":[
			{
				"name":"",
				"type":"string"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"_to",
				"type":"address"
			},
			{
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"transfer",
		"outputs":[
			{
				"name":"success",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"second_owner",
				"type":"address"
			}
		],
		"name":"setSecondOwner",
		"outputs":[],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"",
				"type":"address"
			},
			{
				"name":"",
				"type":"address"
			}
		],
		"name":"allowance",
		"outputs":[
			{
				"name":"",
				"type":"uint256"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"inputs":[
			{
				"name":"initialSupply",
				"type":"uint256"
			},
			{
				"name":"tokenName",
				"type":"string"
			},
			{
				"name":"tokenSymbol",
				"type":"string"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"constructor"
	},
	{
		"anonymous":false,
		"inputs":[
			{
				"indexed":true,
				"name":"from",
				"type":"address"
			},
			{
				"indexed":true,
				"name":"to",
				"type":"address"
			},
			{
				"indexed":false,
				"name":"value",
				"type":"uint256"
			}
		],
		"name":"Transfer",
		"type":"event"
	},
	{
		"anonymous":false,
		"inputs":[
			{
				"indexed":true,
				"name":"_owner",
				"type":"address"
			},
			{
				"indexed":true,
				"name":"_spender",
				"type":"address"
			},
			{
				"indexed":false,
				"name":"_value",
				"type":"uint256"
			}
		],
		"name":"Approval",
		"type":"event"
	},
	{
		"anonymous":false,
		"inputs":[
			{
				"indexed":true,
				"name":"from",
				"type":"address"
			},
			{
				"indexed":false,
				"name":"value",
				"type":"uint256"
			}
		],
		"name":"Burn",
		"type":"event"
	}
];
var contract_abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "user",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      }
    ],
    "name": "hasPaid",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "releaseDate",
        "type": "string"
      },
      {
        "name": "genre",
        "type": "string"
      },
      {
        "name": "desc",
        "type": "string"
      },
      {
        "name": "country",
        "type": "string"
      },
      {
        "name": "moviePrice",
        "type": "uint256"
      }
    ],
    "name": "addMovie",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      }
    ],
    "name": "deleteProducer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "OWNER",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "castName",
        "type": "string"
      }
    ],
    "name": "addCast",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      }
    ],
    "name": "getProducerName",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getMovieReviewAtIndex",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addProducer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "buyToken",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getMovieCastAtIndex",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieGenre",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieReleaseDate",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieRaterSum",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "user",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addUser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieCountry",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenUsed",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "user",
        "type": "address"
      }
    ],
    "name": "deleteUser",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenPerEther_sellPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenPerEther",
        "type": "uint256"
      }
    ],
    "name": "setBuyPrice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      }
    ],
    "name": "getMovieReviewCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      }
    ],
    "name": "deleteMovie",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieRatingSum",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMoviePrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "review",
        "type": "string"
      }
    ],
    "name": "writeReview",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "rateMovie",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getMovieDesc",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserName",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      }
    ],
    "name": "getMovieCastCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenPerEther_buyPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      }
    ],
    "name": "watchMovie",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "producer",
        "type": "address"
      },
      {
        "name": "movieName",
        "type": "string"
      },
      {
        "name": "reviewer",
        "type": "address"
      }
    ],
    "name": "deleteReview",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "sellToken",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenPerEther",
        "type": "uint256"
      }
    ],
    "name": "setSellPrice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_tokenUsed",
        "type": "address"
      },
      {
        "name": "_buyPrice",
        "type": "uint256"
      },
      {
        "name": "_sellPrice",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "success",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "desc",
        "type": "string"
      }
    ],
    "name": "WriteReview",
    "type": "event"
  }
];