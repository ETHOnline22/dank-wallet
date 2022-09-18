import { ethers } from "ethers";
// import { ExternalProvider } from "@ethersproject/providers";
// import { Biconomy } from "@biconomy/mexa";

class EtherProvider {
  init() {
    const url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
    // `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`

    // ethers.providers.AlchemyProvider(80001, process.env.REACT_APP_ALCHEMY_API_KEY)
    // const web3Provider = new ethers.providers.AlchemyProvider({ name: "maticmum", chainId: 80001 }, process.env.REACT_APP_ALCHEMY_API_KEY)
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

    // this.biconomy = new Biconomy(customHttpProvider, { apiKey: process.env.REACT_APP_BICONOMY_TOKEN, debug: true, contractAddresses: ['0x6a05A1eC1A33E2a3525254ce6E59E09822B67351'] })
    this.provider = customHttpProvider;
    // new ethers.providers.Web3Provider(this.biconomy)
  }
}

// const ethersProvider = new EtherProvider()
export default EtherProvider;
