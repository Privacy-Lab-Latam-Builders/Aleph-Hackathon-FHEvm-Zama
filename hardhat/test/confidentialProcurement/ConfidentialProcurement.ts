import { expect } from "chai";

import { createInstance } from "../instance";
// import { reencryptEuint256 } from "../reencrypt";
import { getSigners, initSigners } from "../signers";
import { deployConfidentialProcurementFixture } from "./ConfidentialProcurement.fixture";

describe("ConfidentialProcurement", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const contract = await deployConfidentialProcurementFixture();
    this.contractAddress = await contract.getAddress();
    this.procurement = contract;
    this.fhevm = await createInstance();
  });

  it("should select winner with lowest price", async function () {
    // Create encrypted bids
    const bidder1Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    await bidder1Input.add256(800); // Price: 800
    const encryptedPrice1 = await bidder1Input.encrypt();

    // Submit first bid
    const tx1 = await this.procurement
      .connect(this.signers.bob)
      .submitBid(
        encryptedPrice1.handles[0],
        encryptedPrice1.inputProof,
      );
    await tx1.wait();

    // Submit second bid with lower price
    const bidder2Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.carol.address);
    await bidder2Input.add256(1000);
    const encryptedPrice2 = await bidder2Input.encrypt();


    const tx2 = await this.procurement
      .connect(this.signers.carol)
      .submitBid(
        encryptedPrice2.handles[0],
        encryptedPrice2.inputProof,
      );
    await tx2.wait();

    // Decrypt winner
      const evalTx = await this.procurement.decryptWinner();
      await evalTx.wait();

    // Decrypt Lowest Price
      const evalTx1 = await this.procurement.decryptLowestPrice();
      await evalTx1.wait();

      // const winnerPrice = await reencryptEuint256(this.signers.bob, this.fhevm, this.lowestPrice, this.contractAddress);

    expect(await this.procurement.decryptedWinner()).to.equal(this.signers.bob.address);
    expect(await this.procurement.decryptedLowestPrice()).to.equal(1000);
  });
});
