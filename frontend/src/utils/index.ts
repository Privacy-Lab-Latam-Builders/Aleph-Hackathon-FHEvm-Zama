import { getContract, WalletClient } from 'viem';
import { CONFIDENTIAL_PRODUCREMENT_CONTRACT_ADDRESS } from "../constants";
import ConfidentialProcurement from "../constants/abis/ConfidentialProcurement.json"

export const getConproContract = (client: WalletClient) => {
    return getContract({
        address: CONFIDENTIAL_PRODUCREMENT_CONTRACT_ADDRESS,
        abi: ConfidentialProcurement,
        client,
    });
};
