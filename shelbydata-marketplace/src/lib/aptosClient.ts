import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const aptosClient = new Aptos(
  new AptosConfig({
    network: Network.TESTNET,
    clientConfig: {
      API_KEY: import.meta.env.VITE_APTOS_API_KEY ?? "",
    },
  })
);

export { Network };
