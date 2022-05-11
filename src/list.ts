import HDWalletProvider from "@truffle/hdwallet-provider";
import { OpenSeaPort, Network } from "opensea-js";
import { config } from "dotenv";

config();

let providerUrl = process.env.ETH_RPC_URL;
let apiKey = process.env.OPENSEA_API_KEY;
let tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
let tokenId = process.env.TOKEN_ID;
let rinkeby = process.env.RINKEBY;
let mnemonic = process.env.MNEMONIC;

let networkName = Network.Main;

if (rinkeby) {
  networkName = Network.Rinkeby;
}

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonic,
  },
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

  const accountAddress = "...";
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
}

main();
