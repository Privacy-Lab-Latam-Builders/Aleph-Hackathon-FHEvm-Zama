// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/config/ZamaGatewayConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";
import "hardhat/console.sol";

/// @title ConfidentialProcurement
/// @notice Contrato para manejar licitaciones confidenciales utilizando FHE y Gateway.
contract ConfidentialProcurement is SepoliaZamaFHEVMConfig, SepoliaZamaGatewayConfig, GatewayCaller {
    address public decryptedWinner;
    uint256 public decryptedLowestPrice;
    struct Bid {
        euint256 price; // Precio cifrado
    }

    eaddress winner;
    euint256 lowestPrice;

    mapping(address => Bid) public bids; // Licitaciones de los participantes
    address[] public bidders; // Lista de licitantes para iteracion

    uint256 public latestRequestID; // Ultima solicitud de desencriptacion

    /// @notice Permite que los licitantes envien sus ofertas
    /// @param encryptedPrice Precio cifrado
    /// @param priceInputProof Prueba de validez para datos cifrados
    function submitBid(
        einput encryptedPrice,
        bytes calldata priceInputProof
    ) public {
        euint256 price = TFHE.asEuint256(encryptedPrice, priceInputProof);
        address bidder = msg.sender;

        if (!TFHE.isInitialized(lowestPrice)){
            lowestPrice = price;
            winner = TFHE.asEaddress(bidder);
        }else{
            ebool isNewWinner = TFHE.lt(price , lowestPrice);
            lowestPrice = TFHE.select(isNewWinner, price, lowestPrice);
            winner = TFHE.select(isNewWinner, TFHE.asEaddress(bidder), winner);
        }
        TFHE.allowThis(lowestPrice);
        TFHE.allowThis(winner);

        TFHE.allow(lowestPrice, msg.sender);
        TFHE.allow(winner, msg.sender);
    }

    function decryptWinner() public{
        console.log("DECRYPT WINNER ");
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(winner);
        Gateway.requestDecryption(cts, this.setDecryptedWinner.selector, 0, block.timestamp + 100, false);
    }

    function setDecryptedWinner(uint256, address resultDecryption) public onlyGateway {
        console.log("Decrypted Winner: ");
        decryptedWinner = resultDecryption;
        console.log(resultDecryption);
    }

    function decryptLowestPrice() public{
        console.log("DECRYPT LOWEST PRICE ");
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(lowestPrice);
        Gateway.requestDecryption(cts, this.setDecryptedLowestPrice.selector, 0, block.timestamp + 100, false);
    }

    function setDecryptedLowestPrice(uint256, uint256 resultDecryption) public onlyGateway returns (uint256){
        console.log("Decrypted Lowest Price: ");
        decryptedLowestPrice = resultDecryption;
        return resultDecryption;
    }

   }
