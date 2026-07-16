import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { type PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKeys: {
          testnet: import.meta.env.VITE_APTOS_API_KEY ?? "",
        },
      }}
      onError={(error) => {
        console.error("[Wallet] Connection error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
