const MerkleTreeContract = artifacts.require("MerkleTree");

const { MerkleTree } = require("merkletreejs");
const kekkak256 = require("keccak256");

contract("test", async (accounts) => {
  printAccounts = {};
  accounts.forEach((a) => {
    printAccounts[accounts.indexOf(a)] = a;
  });
  console.log(printAccounts);

  /**
   * LOGIC STARING HERE 
   * ===========================================================================
   */

  // init wallets
  const whitelistAccounts = accounts.slice(0, 5);

  // create tree and nodes
  const leafNodes = whitelistAccounts.map((addr) => kekkak256(addr));
  const merkleTree = new MerkleTree(leafNodes, kekkak256, { sortPairs: true });
  const root = merkleTree.getHexRoot();

  // load root to contract
  //   await contract.setMerkleRoot(root);

  // verify wallet
  const walletHash = kekkak256(accounts[0]);
  const proof = merkleTree.getHexProof(walletHash);
  //   const verified = await contract.verifyWallet(proof);

  /**
   * ===========================================================================
   */

  it("deploy", async () => {
    contract = await MerkleTreeContract.new({
      from: accounts[0],
    });
    console.log("contract", contract.address);
  });

  it("set merkle root", async () => {
    await contract.setMerkleRoot(root);

    const contractRoot = await contract.merkleRoot();

    assert.equal(contractRoot, root);
  });

  it("verify wallet", async () => {
    const verified = await contract.verifyWallet(proof);

    assert.equal(verified, true);
  });

  it("verify fail", async () => {
    const walletHash2 = kekkak256(accounts[9]);
    const proof2 = merkleTree.getHexProof(walletHash2);

    const verified = await contract.verifyWallet(proof2);

    assert.equal(verified, false);
  });
});
