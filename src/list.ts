import HDWalletProvider from "@truffle/hdwallet-provider";
import { OpenSeaPort, Network } from "opensea-js";
import { config } from "dotenv";
import { sleep } from "./util.js";

// config();
config({ path: "./.env" });
config({ path: "./.secret" });

let providerUrl = process.env.ETH_RPC_URL;
let apiKey = process.env.OPENSEA_API_KEY;
let tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS;
let tokenId = process.env.TOKEN_ID;
let rinkeby = false;
let secret = process.env.SECRET;
let accountAddress = process.env.ACCOUNT_ADDRESS;
let numListings = +process.env.NUM_LISTINGS;
let price = +process.env.PRICE;
let batch = +process.env.BATCH;

let networkName = Network.Main;
if (rinkeby) {
  networkName = Network.Rinkeby;
}
const provider = new HDWalletProvider({
  privateKeys: ["0x" + secret],
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
  const listingTime = 1654608600;
  // expires in 1 month
  const expirationTime = listingTime + 60 * 60 * 24 * 30;
  let i = 0;
  const orderArgs = {
    asset: { ...OpenSeaAsset, schemaName: "ERC1155" },
    accountAddress,
    startAmount: price,
    listingTime,
    expirationTime,
  };
  for (; i < numListings; i += batch) {
    console.log(`listed ${i}`);

    let promises = [];
    for (let i = 0; i < batch; i++) {
      promises.push(
        seaport.createSellOrder(orderArgs).catch((err) => {
          console.log("failed; decrementing counter");
          i -= 1;
        })
      );
      await sleep(111);
    }
    await Promise.all(promises);
    // console.log(promises);
  }

  while (i < numListings) {
    console.log(`listed ${i}`);
    await seaport.createSellOrder(orderArgs).catch((err) => {
      console.log(err);
      i -= 1;
    });
    i++;
  }
}

main();
