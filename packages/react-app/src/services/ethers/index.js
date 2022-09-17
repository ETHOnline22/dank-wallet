import Web3 from "web3";
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";

class EtherProvider {
    constructor() {
        const url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`
        // `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;

        const web3Provider = new Web3.providers.HttpProvider(url)
        // const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

        this.biconomy = new Biconomy(web3Provider, { apiKey: process.env.REACT_APP_BICONOMY_TOKEN, debug: true });
        this.provider = new ethers.providers.Web3Provider(this.biconomy);
    }

}

const ethersProvider = new EtherProvider()
export default ethersProvider