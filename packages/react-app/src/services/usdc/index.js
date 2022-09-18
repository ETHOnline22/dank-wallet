import { ethers } from "ethers"
import web3Utils from 'web3-utils'
import TOKEN_CONTRACT_ABI from "./TokenContract.json"

class ContractUsdc {
    constructor(_contractAddress, _provider) {
        this.provider = _provider
        this.contractAddress = _contractAddress
        this.contract = new ethers.Contract(this.contractAddress, TOKEN_CONTRACT_ABI, this.provider)
    }

    async transferUsdc(from, to, quantiy, privateKey) {
        const tx = {
            from,
            to: this.contractAddress,
            data: this.contract.interface.encodeFunctionData('transfer', [to, quantiy]),
            gasLimit: web3Utils.hexToNumber((await this.contract.estimateGas.transfer(to, quantiy, { from }))._hex),
            gasPrice: web3Utils.hexToNumber((await this.provider.getGasPrice())._hex),
            value: '0x0'
        }

        const wallet = new ethers.Wallet(privateKey, this.provider)
        const signedTx = await wallet.signTransaction(tx)

        const signAndSendTx = await wallet.sendTransaction(tx)
        return signAndSendTx

    }


    async createTxn(fnName, arrayOfParams, from) {
        console.log(...arrayOfParams)
        const tx = {
            from,
            to: this.contractAddress,
            data: this.contract.interface.encodeFunctionData(`${fnName}`, arrayOfParams),
            gasLimit: web3Utils.hexToNumber((await this.contract.estimateGas[fnName](...arrayOfParams, { from }))._hex),
            gasPrice: web3Utils.hexToNumber((await this.provider.getGasPrice())._hex),
            value: '0x0'
        }
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

    async getViews(fnName, paramsArr) {
        const data = await this.contract[fnName](...paramsArr)
        return data
    }
}

export default ContractUsdc