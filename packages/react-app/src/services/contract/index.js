import { ethers } from "ethers";
import web3Utils from 'web3-utils'
import { DANK_WALLET_ABI } from "./ABI"

class ContractDankWallet {
    constructor(_contractAddress, _provider) {
        this.provider = _provider
        this.contractAddress = _contractAddress
        this.contract = new ethers.Contract(this.contractAddress, DANK_WALLET_ABI, this.provider);
    }

    async registerUser(from, userName, publicAddress, ipfsUri, privateKey) {

        const tx = {
            from,
            to: this.contractAddress,
            data: this.contract.interface.encodeFunctionData('registerUser', [userName, publicAddress, ipfsUri]),
            gas: web3Utils.hexToNumber((await this.contract.estimateGas.registerUser(userName, publicAddress, ipfsUri, { from }))._hex),
            gasPrice: web3Utils.hexToNumber((await this.provider.getGasPrice())._hex),
            value: '0'
        };

        const wallet = new ethers.Wallet(privateKey, this.provider)
        const signedTx = await wallet.signTransaction(tx)

        const signAndSendTx = await wallet.sendTransaction(tx)
        return signAndSendTx;

    }

    async createTxn(fnName, arrayOfParams, from) {
        const tx = {
            from,
            to: this.contractAddress,
            data: this.contract.interface.encodeFunctionData(`${fnName}`, [...arrayOfParams]),
            gas: web3Utils.hexToNumber((await this.contract.estimateGas.registerUser(...arrayOfParams, { from }))._hex),
            gasPrice: web3Utils.hexToNumber((await this.provider.getGasPrice())._hex),
            value: '0'
        };
        return tx
    }

    async signTxn(tx, privateKey) {
        const wallet = new ethers.Wallet(privateKey, this.provider)
        const signedTx = await wallet.signTransaction(tx)

        return signedTx
    }

    async signAndSendTxn(tx, privateKey) {
        const wallet = new ethers.Wallet(privateKey, this.provider)
        const signAndSendTx = await wallet.sendTransaction(tx)

        return signAndSendTx
    }
}

export default ContractDankWallet