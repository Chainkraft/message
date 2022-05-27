import "@nomiclabs/hardhat-ethers";
import {ethers} from "hardhat";
import {Message__factory} from "../typechain-types";

async function readMessage() {
    // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

    // Signer
    const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, alchemyProvider);

    // Contract
    const message = new ethers.Contract(`${process.env.CONTRACT_ADDRESS}`, Message__factory.abi, signer);

    console.log('Reading Message...');
    console.log("Message:", await message.message());
    console.log("Price:", ethers.utils.formatEther(await message.price()));
    console.log("Author:", await message.author());
}

readMessage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
