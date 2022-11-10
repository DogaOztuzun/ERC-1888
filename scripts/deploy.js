const { ethers, upgrades } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners()
  accounts = []
  for (var i = 0; i < signers.length; i++) {
    accounts.push(signers[i].address)
  }
  const deploymentWallet = signers[0]
  console.log(`Deployment account: ${deploymentWallet.address}`)


  this.Registry = await ethers.getContractFactory("Registry");
  this.Issuer = await ethers.getContractFactory("Issuer");
  this.PrivateIssuer = await ethers.getContractFactory("PrivateIssuer");

  this.RegistryContract = await this.Registry.deploy("");
  await this.RegistryContract.deployed();
  console.log("Registry deployed to:", this.RegistryContract.address);

  this.IssuerContract = await upgrades.deployProxy(this.Issuer, [123, this.RegistryContract.address], { kind: 'uups' });

  await this.IssuerContract.deployed();
  console.log("Issuer deployed to:", this.IssuerContract.address);

  this.PrivateIssuerContract = await upgrades.deployProxy(this.PrivateIssuer, [this.IssuerContract.address], { kind: 'uups' });
  await this.PrivateIssuerContract.deployed();
  console.log("PrivateIssuer deployed to:", this.PrivateIssuerContract.address);
}

main()
  .then(() => {
    console.log("Registry and Issuers deployment has finished.")
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })