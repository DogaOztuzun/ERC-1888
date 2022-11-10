const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners()
  accounts = []
  for (var i = 0; i < signers.length; i++) {
    accounts.push(signers[i].address)
  }
  const deploymentWallet = signers[0]
  console.log(`Deployment account: ${deploymentWallet.address}`)


  let ISSUERCONTRACT = "0x...";
  this.Issuer = await ethers.getContractFactory("Issuer");
  // this.Registry = await ethers.getContractFactory("Registry");
  
  this.IssuerContract = this.Issuer.attach(ISSUERCONTRACT);

  // 1664571600 = 2022-10-01 00:00:00
  // 1667250000 = 2022-11-01 00:00:00
  // let address = "0x..";

  const encoded = encodeData(1664571600, 1667250000, 'Fethiye Solar', '');
  await this.IssuerContract.requestCertification(encoded);
  // await this.IssuerContract.requestCertificationFor(encoded, adress);

  //get certificate  
  let certificate = await this.IssuerContract.callStatic.getCertificationRequest(1);
  console.log(decodeData(certificate.data));

  // await this.IssuerContract.approveCertificationRequest(1, 1);

  // let balance = await this.RegistryContract.balanceOf(deploymentWallet.address, 1);
  // console.log(balance);
}

function encodeData(generationStartTime, generationEndTime, deviceId, metadata) {
  return ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'string', 'string'], [generationStartTime, generationEndTime, deviceId, metadata ?? '']);
}

function decodeData(encoded) {
  return ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256', 'string', 'string'], encoded);
}

main()
  .then(() => {
    console.log("Token minting has finished.")
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
