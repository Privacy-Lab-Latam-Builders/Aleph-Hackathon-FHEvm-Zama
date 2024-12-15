import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Check if contract was previously deployed

  const deployed = await deploy("ConfidentialProcurement", {
    from: deployer,
    args: ["Naraggara", "NARA"],
    log: true,
  });

  console.log(`ConfidentialProcurement contract: `, deployed.address);
};
export default func;
func.id = "deploy_confidentialProcurement"; // id required to prevent reexecution
func.tags = ["ConfidentialProcurement"];
