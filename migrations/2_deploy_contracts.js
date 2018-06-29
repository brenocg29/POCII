var Adoption = artifacts.require("Adoption");
var Ballot = artifacts.require("Ballot");
module.exports = function(deployer){

	deployer.deploy(Adoption);
	deployer.deploy(Ballot);

};