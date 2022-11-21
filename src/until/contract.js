const { handleContract } = require("./blockchain");

const createContractPeerGames = () => {
  const contract = new handleContract();
  if (contract) {
    const result = contract.createContract();
    return result;
  }
};

module.exports = { createContractPeerGames };
