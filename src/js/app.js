
// Above-mentioned will work or use this simple form
App = {
web3Provider: null,
  contracts: {},
  salts : {},
  init: function() {
    // Load pets.    

    $.getJSON('../candidatos.json', function(data) {
      
    	
      let candRow = $('#petsRow');
      let candTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        candTemplate.find('.panel-title').text(data[i].name);
        candTemplate.find('img').attr('src', data[i].picture);
        candTemplate.find('.pet-breed').text(data[i].party);
        candTemplate.find('.pet-age').text(data[i].age);
        candTemplate.find('.pet-location').text(data[i].location);
        candTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        candRow.append(candTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
if (typeof web3 !== 'undefined') {
	  App.web3Provider = web3.currentProvider;
	} else {
	  // If no injected web3 instance is detected, fall back to Ganache
	  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	}
	web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Ballot.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  let BallotArtifact = data;
  App.contracts.Ballot = TruffleContract(BallotArtifact);

  // Set the provider for our contract
  App.contracts.Ballot.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted pets
  return App.insertVoters();
  //return App.markAdopted();
});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  handleAdopt: function() {
    event.preventDefault();

    let petId = parseInt($(event.target).data('id'));

let BallotInstance;
// a mudança é na maneira que se manda a requisição dessa vez com seu valor.
web3.eth.getAccounts((error, accounts) => {
  if (error) {
    console.log(error);
  }
  let account = accounts[0];

  App.contracts.Ballot.deployed().then(function(instance) {
    BallotInstance = instance;

    return BallotInstance.vote(petId,CryptoJS.SHA256(account + salts[account]), {from: account});
  }).then((result) => {
    document.write(JSON.stringify(result))
  }).catch((err) => {document.getElementsByClassName("alternativeprice")[2].value
    console.log(err.message);
  });
}); 
 },


  insertVoters: function(){
  let BallotInstance;
  web3.eth.getAccounts((error, accounts) => {
  if (error) {
    console.log(error);
  }
  let account = accounts[0];
  App.contracts.Ballot.deployed().then(function(instance) {
  BallotInstance = instance;
  	$.getJSON('../voters.json',function(data){
  		for(i = 0; i < data.length; i ++){
  			var salt = CryptoJS.lib.WordArray.random(128/8);
      		salts[data[i].Address] = salt;
  			BallotInstance.addVoter(data[i].Address + salt,{from: account});
  		}
  	});
  });
});

  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
