import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

/** Shelby lives on Shelbynet, not Aptos Testnet. */
export const SHELBY_NETWORK = Network.SHELBYNET;

export const aptosClient = new Aptos(
  new AptosConfig({
    network: SHELBY_NETWORK,
    clientConfig: {
      API_KEY: import.meta.env.VITE_APTOS_API_KEY ?? "",
    },
  })
);

export { Network };
