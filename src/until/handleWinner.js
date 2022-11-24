const Web3 = require("web3");
const handleWinnerToken = async (abi, addressSM, addreceive, coin) => {
  const privateKeyssss = "bed5fcb69dddc5104c312475816a6ebd6e0464e62e83d64f1c4d3a1dc8bb8b10";
  const web3 = new Web3("wss://goerli.infura.io/ws/v3/f8b38abf525d46cd9c72d3604a533d49");
  const addressWallet = "0x1aD4f733F54758e5386cECa1DC3c310C175d2AA6";
  //   const addreceive = "0xF60E4C205a8853D893c57B5C0649c2f0Df3cbbD3";
  const contract = new web3.eth.Contract(abi, addressSM);
  const amount = BigInt(coin * 1000000000000000000);
  const tx = contract.methods.transferWinner(addreceive, amount);
  const gas = await tx.estimateGas({ from: addressWallet });
  const getgasPrice = await web3.eth.getGasPrice();
  const gasPrice = +getgasPrice;
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(addressWallet);
  const txData = {
    from: addressWallet,
    to: addressSM,
    data: data,
    gasPrice: getgasPrice,
    gas: 21000,
    gasLimit: 1000000,
    nonce,
    value: "0x00",
  };
  console.log(txData);
  const signedTx = await web3.eth.accounts.signTransaction(txData, privateKeyssss);
  web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on("receipt", (receipt) => {
      console.log(receipt);
    })
    .on("error", (err) => {
      console.log("err");
      console.log(err);
    });
};
module.exports = { handleWinnerToken };
