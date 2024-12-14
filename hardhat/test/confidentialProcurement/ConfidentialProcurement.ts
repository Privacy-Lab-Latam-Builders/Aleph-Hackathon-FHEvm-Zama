import { expect } from "chai";

import { createInstance } from "../instance";
import { reencryptEuint64 } from "../reencrypt";
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

  it("should select winner with lowest price and valid compliance", async function () {
    // Create encrypted bids
    const bidder1Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    bidder1Input.add64(1000); // Price: 1000
    const encryptedPrice1 = await bidder1Input.encrypt();

    const compliance1Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.bob.address);
    compliance1Input.addBool(true); // Has compliance
    const encryptedCompliance1 = await compliance1Input.encrypt();

    // Submit first bid
    const tx1 = await this.procurement
      .connect(this.signers.bob)
      .submitBid(
        encryptedPrice1.handles[0],
        encryptedCompliance1.handles[0],
        encryptedPrice1.inputProof,
        encryptedCompliance1.inputProof,
      );
    await tx1.wait();

    // Submit second bid with lower price but no compliance
    const bidder2Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.carol.address);
    bidder2Input.add64(800);
    const encryptedPrice2 = await bidder2Input.encrypt();

    const compliance2Input = this.fhevm.createEncryptedInput(this.contractAddress, this.signers.carol.address);
    compliance2Input.addBool(false);
    const encryptedCompliance2 = await compliance2Input.encrypt();

    const tx2 = await this.procurement
      .connect(this.signers.carol)
      .submitBid(
        encryptedPrice2.handles[0],
        encryptedCompliance2.handles[0],
        encryptedPrice2.inputProof,
        encryptedCompliance2.inputProof,
      );
    await tx2.wait();

    // Evaluate bids
    const evalTx = await this.procurement.requestEvaluation();
    await evalTx.wait();

    // Get and verify results
    const result = await this.procurement.results();
    const winnerPrice = await reencryptEuint64(this.signers.bob, this.fhevm, result.lowestPrice, this.contractAddress);

    expect(result.winner).to.equal(this.signers.bob.address);
    expect(winnerPrice).to.equal(1000);
  });
});
