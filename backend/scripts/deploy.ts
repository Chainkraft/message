import "@nomiclabs/hardhat-ethers";
import {ethers} from "hardhat";

async function deployMessage() {
    const [account] = await ethers.getSigners();

    console.log("Deployer account:", account.address);
    console.log("Account balance:", ethers.utils.formatEther(await account.getBalance()));

    const messageFactory = await ethers.getContractFactory("Message");

    console.log('Deploying Message...');
    const message = await messageFactory.deploy();
    await message.deployed();
    console.log('Message deployed to:', message.address);
}

deployMessage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
