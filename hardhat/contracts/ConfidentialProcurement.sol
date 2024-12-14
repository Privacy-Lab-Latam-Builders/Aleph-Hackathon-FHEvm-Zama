// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";

/// @title ConfidentialProcurement
/// @notice Contrato para manejar licitaciones confidenciales utilizando FHE y Gateway.
contract ConfidentialProcurement is SepoliaZamaFHEVMConfig, GatewayCaller {
    struct Bid {
        euint64 price; // Precio cifrado
        ebool compliance; // Cumplimiento (si/no) cifrado
    }

    struct Result {
        address winner;
        euint64 lowestPrice;
    }

    mapping(address => Bid) public bids; // Licitaciones de los participantes
    address[] public bidders; // Lista de licitantes para iteracion
    Result public results; // Resultado final

    uint256 public latestRequestID; // Ultima solicitud de desencriptacion

    /// @notice Permite que los licitantes envien sus ofertas
    /// @param encryptedPrice Precio cifrado
    /// @param encryptedCompliance Cumplimiento cifrado
    /// @param priceInputProof Prueba de validez para datos cifrados
    /// @param complianceInputProof Prueba de validez para datos cifrados
    function submitBid(
        einput encryptedPrice,
        einput encryptedCompliance,
        bytes calldata priceInputProof,
        bytes calldata complianceInputProof
    ) public {
        euint64 price = TFHE.asEuint64(encryptedPrice, priceInputProof);
        ebool compliance = TFHE.asEbool(encryptedCompliance, complianceInputProof);

        // Guardar la oferta
        bids[msg.sender] = Bid(price, compliance);

        // Agregar a la lista de licitantes
        bidders.push(msg.sender);

        // Otorgar permisos al contrato para acceder a las variables cifradas
        TFHE.allowThis(price);
        TFHE.allowThis(compliance);
    }

    /// @notice Solicita la desencriptacion de las ofertas
    function requestEvaluation() public {
        uint256[] memory cts = new uint256[](bidders.length * 2); // Precio y cumplimiento

        // Construir la solicitud de desencriptacion para todos los licitantes
        for (uint256 i = 0; i < bidders.length; i++) {
            cts[i * 2] = Gateway.toUint256(bids[bidders[i]].price);
            cts[i * 2 + 1] = Gateway.toUint256(bids[bidders[i]].compliance);
        }

        // Solicitar desencriptacion en modo trustless
        uint256 requestID = Gateway.requestDecryption(
            cts,
            this.callbackEvaluation.selector,
            0,
            block.timestamp + 100,
            true // Modo trustless
        );

        latestRequestID = requestID; // Guardar el ID de la solicitud
        saveRequestedHandles(requestID, cts);
    }

    /// @notice Callback para procesar los datos desencriptados
    /// @param requestID ID de la solicitud de desencriptacion
    /// @param decryptedPrices Precios desencriptados
    /// @param decryptedCompliance Estados de cumplimiento desencriptados
    /// @param signatures Firmas del KMS para verificacion
    function callbackEvaluation(
        uint256 requestID,
        uint64[] memory decryptedPrices,
        bool[] memory decryptedCompliance,
        bytes[] memory signatures
    ) public onlyGateway {
        // Verificar que el ID de solicitud es el correcto
        require(latestRequestID == requestID, "ID de solicitud incorrecto");

        // Verificar las firmas del KMS
        uint256[] memory requestedHandles = loadRequestedHandles(requestID);
        bool isKMSVerified = Gateway.verifySignatures(requestedHandles, signatures);
        require(isKMSVerified, "El KMS no verifico los resultados");

        // Evaluar las ofertas desencriptadas
        address winner;
        uint64 lowestPrice = type(uint64).max; // Precio inicial maximo

        for (uint256 i = 0; i < decryptedPrices.length; i++) {
            if (decryptedCompliance[i] && decryptedPrices[i] < lowestPrice) {
                lowestPrice = decryptedPrices[i];
                winner = bidders[i];
            }
        }

        // Guardar los resultados
        results = Result(winner, TFHE.asEuint64(lowestPrice));
        TFHE.allowThis(results.lowestPrice); // Permitir acceso al contrato
    }
}
