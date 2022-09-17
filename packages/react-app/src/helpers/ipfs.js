import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import axios from "axios";
const PUBLIC_GATEWAY = "https://spheron.infura-ipfs.io/ipfs";

async function uploadToIPFS({ publicAddress, privateData }) {
  const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN });

  const files = makeFileObjects(publicAddress, privateData);

  const CID = await client.put(files);

  return `${PUBLIC_GATEWAY}/${CID}/${publicAddress}.json`;
}

async function retrieveFromIPFS(CID) {
  const data = await axios.get(CID);

  return data.data;
}

function makeFileObjects(publicAddress, privateData) {
  const obj = { publicAddress: publicAddress, privateData: privateData };

  const buffer = Buffer.from(JSON.stringify(obj));

  const files = [new File([buffer], `${publicAddress}.json`)];

  return files;
}

export { uploadToIPFS, retrieveFromIPFS };
