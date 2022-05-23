import HDWalletProvider from "@truffle/hdwallet-provider";
import { OpenSeaPort, Network } from "opensea-js";
import { config } from "dotenv";
import { sleep } from "./util.js";

config();

let providerUrl = process.env.ETH_RPC_URL;
let apiKey = process.env.OPENSEA_API_KEY;
let tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
let tokenId = process.env.TOKEN_ID;
let rinkeby = !!process.env.RINKEBY;
let secret = process.env.SECRET;
let accountAddress = process.env.ACCOUNT_ADDRESS;
let numListings = +process.env.NUM_LISTINGS;

let networkName = Network.Main;

console.log(providerUrl);
if (rinkeby) {
  networkName = Network.Rinkeby;
}
console.log(secret);
const provider = new HDWalletProvider({
  privateKeys: [secret],
  providerOrUrl: providerUrl,
});

async function main(): Promise<any> {
  const seaport = new OpenSeaPort(provider, {
    networkName,
    apiKey,
  });

  const OpenSeaAsset = await seaport.api.getAsset({
    tokenAddress,
    tokenId,
  });

  for (let i = 0; i < numListings; i++) {
    // listing starts in 10 seconds
    const listingTime = Math.round(Date.now() / 1000) + 10;
    // expires in 24 hours
    const expirationTime = listingTime + 60 * 60 * 24;

    const orderArgs = {
      asset: { ...OpenSeaAsset, schemaName: "ERC1155" },
      accountAddress,
      startAmount: 1.2,
      listingTime,
      expirationTime,
    };
    const listing = await seaport.createSellOrder(orderArgs);
    console.log(listing);
    // approximately 10/sec
    await sleep(100);
  }
}

main();
