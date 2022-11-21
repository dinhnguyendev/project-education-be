const { default: Web3 } = require("web3");
const { BLOCKCHAIN } = require("../constants/contants");
const Contract = require("web3-eth-contract");
class handleContract {
  createContract = () => {
    const abi = BLOCKCHAIN.ABI;
    const addressSM = BLOCKCHAIN.ADDRESS__SM__PEER;
    // var provider = new Web3.provider.WebsocketProvider(
    //   "wss://goerli.infura.io/ws/v3/b1706c239ae04b86a36b141b34796c73"
    // );
    // const web3 = new Web3();
    // window.ethereum.enable();
    Contract.setProvider("wss://goerli.infura.io/ws/v3/b1706c239ae04b86a36b141b34796c73");
    const contract_MN = new Contract(abi, addressSM, {
      from: "0x78E02ebEed978b82B4479a765D0c7f579f25ee38", // default from address
      gasPrice: "30000000000",
    });
    // const contract_MN = new web3.eth.Contract(abi, addressSM);
    return contract_MN;
  };
  createContractGameCaro = () => {
    const abi = BLOCKCHAIN.ABI__GAMES__CARO;
    const addressSM = BLOCKCHAIN.ADDRESS__SM__GAMES;
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    const contract_MN = new web3.eth.Contract(abi, addressSM);
    return contract_MN;
  };
  createContractGameFree = () => {
    const abi = BLOCKCHAIN.ABI__GAMES__FREE;
    const addressSM = BLOCKCHAIN.ADDRESS__SM__FREE;
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    const contract_MN = new web3.eth.Contract(abi, addressSM);
    return contract_MN;
  };
  createContractGameTurtle = () => {
    const abi = BLOCKCHAIN.ABI__GAMES__TURTLE;
    const addressSM = BLOCKCHAIN.ADDRESS__SM__GAMES__TURTLE;
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    const contract_MN = new web3.eth.Contract(abi, addressSM);
    return contract_MN;
  };
}
module.exports = { handleContract };
