pragma solidity ^0.4.17;
// apenas o unuario do petshop pode realizar certas ações
contract owned {
    address public owner;

    function owned()  public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner  public {
        owner = newOwner;
    }
}

contract Adoption is owned{
	// a mudançã é feita de maneira a armazenar as doações
	event LogFundsReceived(address sender, uint amount);
	event LogFundsSent(address receiver, uint amount);
	event Received(uint256 amount);
	address[16] public adopters;
	mapping (uint256 => uint256) payed;
	function adopt(uint petId) public payable returns (uint){
		require(petId >= 0 && petId <=15);
		if(adopters[petId] != address(0x0000000000000000000000000000000000000000)){
			acceptadopt(petId);
		}
		adopters[petId] = msg.sender;
		payed[petId] = msg.value;
		//log
		LogFundsReceived(msg.sender, msg.value);
		return petId;
	}

	function getAdopters() public returns (address[16]){
		return adopters;
	}
	function getPetDonation(uint256 petId) returns (uint256){
		Received(payed[petId]);
		//log
		return payed[petId];

	}
	function acceptadopt(uint256 petId) onlyOwner public {
		var addressfrom = msg.sender;
		addressfrom.transfer(payed[petId]);
		payed[petId] = 0;
		//log
		LogFundsSent(msg.sender, payed[petId]);
	
	}
}