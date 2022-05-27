import 'dotenv/config'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import {HardhatUserConfig} from "hardhat/types";

const config: HardhatUserConfig = {
    solidity: "0.8.0",
    networks: {
        goerli: {
            url: process.env.GOERLI_API_URL,
            accounts: [`${process.env.PRIVATE_KEY}`]
        }
    }
};

export default config;
