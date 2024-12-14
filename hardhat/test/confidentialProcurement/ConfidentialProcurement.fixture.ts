import { ethers } from "hardhat";

import type { ConfidentialProcurement } from "../../types";
import { getSigners } from "../signers";

export async function deployConfidentialProcurementFixture(): Promise<ConfidentialProcurement> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("ConfidentialProcurement");
  const contract = await contractFactory.connect(signers.alice).deploy();
  await contract.waitForDeployment();

  return contract;
}
