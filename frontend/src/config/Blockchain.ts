import {ethers} from "ethers";
import MESSAGE_ABI from "./Message.abi.json";
import {Provider} from "@ethersproject/abstract-provider";

// Provider is a class which provides an abstraction for a connection to the Ethereum Network
// Alchemy Provider allows accessing Blockchain and its status without a personal wallet (read-only access)
const getAlchemyProvider = () => new ethers.providers.AlchemyProvider(
    process.env.REACT_APP_NETWORK,
    process.env.REACT_APP_API_KEY
);

// Web3Provider Provider uses browser plugin MetaMask which populates window.ethereum
const getWalletProvider = () => new ethers.providers.Web3Provider(window.ethereum)

// Contract is an abstraction that represents a connection to a specific contract on the Ethereum Network,
// so that applications can use it like a normal JavaScript object
const getMessageContract = (provider: Provider) =>
    new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        MESSAGE_ABI.abi,
        provider
    );

export {getAlchemyProvider, getWalletProvider, getMessageContract};