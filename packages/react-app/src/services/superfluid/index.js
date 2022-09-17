import { Framework } from "@superfluid-finance/sdk-core"

class SuperFluid {

    constructor(_provider, _chainId) {
        this.provider = _provider
        this.chainId = _chainId
    }

    async superFluidInit() {
        this.sf = await Framework.create({
            chainId: this.chainId, // you can also use chainId here instead
            provider: this.provider
        })
    }

    async superFluidCreateSigner() {
        const metaMaskSigner = this.sf.createSigner({ web3Provider: this.provider })
        return metaMaskSigner
    }

    superFluidLoadSuperToken(addr) {
        // const usdcx = sf.loadSuperToken("0xCAa7349CEA390F89641fe306D93591f87595dc1F") 
        const usdcx = sf.loadSuperToken(addr)
        return usdcx
    }

    superFluidTxnExec(addr) {

        const token = this.superFluidLoadSuperToken(addr)
        // create an approve operation
        const approveOperation = token.approve({ receiver: "0xab...", amount: ethers.utils.parseUnits("100").toString() })

        // execute the approve operation, passing in a signer
        const txn = await approveOperation.exec(signer)

        // wait for the transaction to be confirmed
        const receipt = await txn.wait()

        // or you can create and execute the transaction in a single line
        const approveTxn = await token.approve({ receiver: "0xab...", amount: ethers.utils.parseUnits("100").toString() }).exec(signer)
        const approveTxnReceipt = await approveTxn.wait()

    }
}

export default SuperFluid