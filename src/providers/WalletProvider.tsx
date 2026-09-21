import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { type PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  const aptosApiKey = import.meta.env.VITE_APTOS_API_KEY ?? "";

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{
        network: Network.SHELBYNET,
        aptosApiKeys: {
          [Network.SHELBYNET]: aptosApiKey,
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
