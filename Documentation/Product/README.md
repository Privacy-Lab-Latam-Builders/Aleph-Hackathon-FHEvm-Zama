# Stakeholder Roles and Actions
## Requesters (Public Institutions, Companies, or DAOs):

- **Creator Role:** Responsible for creating the procurement process, filling out the form with the necessary inputs.
- **Tester Role:** Tests the smart contract generated for the procurement process to ensure it works as intended before publishing.
- **Approver Role:** Reviews the test results, ensures everything is correct, and approves the publishing of the procurement process.

## System Administrators:
- Responsible for overseeing the system setup, configuration, and monitoring.
- Admins handle the overall security, maintenance, and functionality of the platform.

## Bidders (Individuals, Organizations, Companies):
- Submit encrypted bids via the dApp.
- Use the dApp to interact with the system, submitting their bids and securely querying the results.
- Each bid submission generates a Zero-Knowledge Proof (ZKP) to ensure the correct encryption and that the bid was made using the latest version of the dApp.

#System Methodology

## 1. Procurement Process Creation & Configuration
### Requester Interaction:
- The Requester (in the Creator role) fills out a form that defines the procurement process.
- Upon form submission, a smart contract is automatically generated using ZAMA Solidity Developer GPT, which will create the contract based on the input parameters (e.g., evaluation rules, timelines, and conditions).
- The Tester role allows the Requester to verify the contract’s behavior by running tests on it, ensuring that the smart contract is functioning as expected.
- Once the contract passes testing, the Approver role publishes the process, and it becomes available for bidding.

## 2. Smart Contract Deployment & Versioning
### Smart Contract Versioning:
The smart contract will not be upgraded once deployed. If there’s a need to modify or create a new procurement process, a completely new smart contract will be created.
This ensures that the bidding process remains transparent and immutable, and any changes in the process would require the creation of a new procurement contract. This minimizes errors caused by human oversight or changes after publishing.
## 3. Bidder Interaction & Zero-Knowledge Proof (ZKP)
### Bid Submission:
- Bidders will submit encrypted bids via the dApp. The system will encrypt all bidder data using Fully Homomorphic Encryption (FHE).
- Each bid submission will generate a Zero-Knowledge Proof (ZKP) to prove that the submission:
- Was made using the latest version of the dApp.
- Has been correctly encrypted before being submitted to the blockchain.
### Wallet Integration:
The dApp will require wallet integration to ensure bidders can submit encrypted bids and interact securely with the blockchain. This could involve using wallets like MetaMask, which can sign transactions and authenticate bidders without revealing any private data.

## 4. Evaluation Process & Result Delivery
### Evaluation:
Once the bidding process ends, the smart contract will evaluate bids based on the rules specified in the contract. Since the data is encrypted with FHE, the contract will evaluate encrypted bids and only store the result (win or not) in the blockchain.
### Result Delivery:
- The dApp will allow bidders to securely query whether they have won the bid, using their wallet’s address to identify the query.
- The result is delivered in an encrypted format, which the dApp decrypts locally to inform the bidder whether they won or not.

## 5. Auditability & Transparency
### Immutable Smart Contract:
The smart contract is immutable once deployed, ensuring the evaluation method is fixed. Auditors can verify that the contract contains the correct evaluation rules, and that the process follows the predefined criteria.
### Zero-Knowledge Proof for Auditability:

Auditors can also verify that each bid was submitted using the correct version of the dApp by reviewing the ZKPs generated during bid submission. This ensures that the system is functioning as intended, without revealing any bidder's private data.
dApp Integrity:

The dApp will be deployed in an immutable environment to prevent any unauthorized changes to the code or interaction with incorrect versions of the smart contract. This guarantees that the dApp is interacting with the correct version and maintaining the integrity of the process.