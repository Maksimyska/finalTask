import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

// Функция развертывания
const deployToDoList: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Развертывание контракта ToDoList
  const deploymentResult = await deploy("ToDoList", {from: deployer, args: [], log: true, autoMine: true,});

  // Получение развернутого контракта
  const toDoList = await hre.ethers.getContract<Contract>("ToDoList", deployer);
  console.log(`Контракт развернут по адресу: ${toDoList.address}`);
};

export default deployToDoList;

// Теги для развертывания контракта
deployToDoList.tags = ["ToDoList"];
