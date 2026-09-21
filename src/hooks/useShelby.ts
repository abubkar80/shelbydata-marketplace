import { useCallback, useMemo, useState } from "react";
import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  expectedTotalChunksets,
  ShelbyBlobClient,
  NetworkToDefaultLocationHint,
  SHELBY_DEPLOYER,
  type BlobCommitments,
} from "@shelby-protocol/sdk/browser";
import { AccountAddress, type CommittedTransactionResponse } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "../lib/aptosClient";
import { createShelbyClient, getBlobUrl } from "../lib/shelbyClient";
import { toAccountAddress, toAddressString } from "../lib/address";
import {
  decodeDatasetBlobName,
  encodeDatasetBlobName,
  type StoredDatasetMeta,
} from "../lib/datasetMeta";
import type { Dataset, DatasetMetadata, UploadState } from "../types";

const PAGE_SIZE = 50;

function transactionEvents(
  tx: CommittedTransactionResponse
): Array<{ type: string; data: unknown }> {
  if ("events" in tx && Array.isArray(tx.events)) {
    return tx.events as Array<{ type: string; data: unknown }>;
  }
  throw new Error("On-chain transaction had no events; cannot continue the Shelby upload.");
}

function transactionHash(result: { hash?: string } | string): string {
  if (typeof result === "string") return result;
  if (result.hash) return result.hash;
  throw new Error("Wallet did not return a transaction hash.");
}

export function useShelby() {
  const { account, signAndSubmitTransaction } = useWallet();
  const shelbyClient = useMemo(() => createShelbyClient(), []);

  const [uploadState, setUploadState] = useState<UploadState>({
    step: "idle",
    progress: 0,
    logs: [],
  });

  const addLog = useCallback((msg: string) => {
    setUploadState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${msg}`],
    }));
  }, []);

  const uploadDataset = useCallback(
    async (file: File, meta: StoredDatasetMeta): Promise<string | null> => {
      if (!account) {
        setUploadState((prev) => ({
          ...prev,
          step: "error",
          error: "No wallet connected.",
        }));
        return null;
      }

      const owner = toAccountAddress(account.address);
      const blobName = encodeDatasetBlobName(file.name, meta);

      try {
        setUploadState({
          step: "encoding",
          progress: 10,
          logs: [],
          error: undefined,
        });
        addLog(`Encoding ${file.name} (${(file.size / 1024).toFixed(1)} KB) as Uint8Array...`);
        addLog(`Blob name includes listing metadata: ${blobName.slice(0, 48)}...`);

        const blobData = new Uint8Array(await file.arrayBuffer());
        const provider = await createDefaultErasureCodingProvider();
        const commitments: BlobCommitments = await generateCommitments(provider, blobData);

        addLog(
          `Commitments generated — merkle root: ${commitments.blob_merkle_root.slice(0, 16)}...`
        );
        setUploadState((prev) => ({ ...prev, progress: 25 }));

        setUploadState((prev) => ({ ...prev, step: "registering", progress: 35 }));
        addLog("Wallet signature 1/2: register blob on Shelbynet...");

        const registerPayload = ShelbyBlobClient.createRegisterBlobPayload({
          account: owner,
          blobName,
          blobMerkleRoot: commitments.blob_merkle_root,
          numChunksets: expectedTotalChunksets(commitments.raw_data_size),
          blobSize: commitments.raw_data_size,
          encoding: provider.config.enumIndex,
          locationHint: NetworkToDefaultLocationHint.shelbynet,
        });

        const registerTx = await signAndSubmitTransaction({ data: registerPayload });
        const registerHash = transactionHash(registerTx);
        addLog(`Register tx submitted: ${registerHash}`);
        setUploadState((prev) => ({ ...prev, progress: 45, txHash: registerHash }));

        const registerCommitted = await aptosClient.waitForTransaction({
          transactionHash: registerHash,
        });
        const uid = ShelbyBlobClient.registeredBlobUid(
          transactionEvents(registerCommitted),
          AccountAddress.from(SHELBY_DEPLOYER)
        );
        addLog(`On-chain blob UID: ${uid.toString()}`);
        setUploadState((prev) => ({ ...prev, progress: 55 }));

        setUploadState((prev) => ({ ...prev, step: "uploading", progress: 65 }));
        addLog("Uploading erasure-coded chunksets to Shelby RPC...");

        const putResult = await shelbyClient.rpc.putBlobChunksets({
          accountAddress: owner,
          uid,
          blobData,
          commitments,
          onProgress: (progress) => {
            const pct =
              progress.totalBytes > 0
                ? Math.min(20, Math.round((progress.uploadedBytes / progress.totalBytes) * 20))
                : 0;
            setUploadState((prev) => ({ ...prev, progress: 65 + pct }));
          },
        });
        addLog(`RPC upload complete (${putResult.spAcks.length} storage-provider ack(s)).`);

        setUploadState((prev) => ({ ...prev, step: "committing", progress: 88 }));
        addLog("Wallet signature 2/2: commit object so the name resolves...");

        const commitPayload = ShelbyBlobClient.createCommitObjectPayload({
          uid,
          blobName,
          overwrite: false,
          storageProviderAcks: putResult.spAcks,
        });
        const commitTx = await signAndSubmitTransaction({ data: commitPayload });
        const commitHash = transactionHash(commitTx);
        addLog(`Commit tx submitted: ${commitHash}`);

        await aptosClient.waitForTransaction({ transactionHash: commitHash });
        addLog("Commit confirmed — object is listed under this account.");

        const url = getBlobUrl(owner, blobName);
        addLog(`Blob URL:\n  ${url}`);

        setUploadState((prev) => ({
          ...prev,
          step: "done",
          progress: 100,
          txHash: commitHash,
          blobUrl: url,
        }));

        return url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error occurred.";
        addLog(`Error: ${message}`);
        setUploadState((prev) => ({
          ...prev,
          step: "error",
          error: message,
        }));
        return null;
      }
    },
    [account, signAndSubmitTransaction, shelbyClient, addLog]
  );

  const resetUpload = useCallback(() => {
    setUploadState({ step: "idle", progress: 0, logs: [] });
  }, []);

  const fetchDatasets = useCallback(
    async (address?: unknown): Promise<Dataset[]> => {
      const target = toAddressString(address ?? account?.address);
      if (!target) return [];

      try {
        const objects = [];
        let startAfterKey: string | undefined;
        while (true) {
          const page = await shelbyClient.index.listObjectsByPrefix({
            owner: target,
            prefix: "",
            startAfterKey,
            limit: PAGE_SIZE,
          });
          objects.push(...page);
          if (page.length < PAGE_SIZE) break;
          startAfterKey = page[page.length - 1]?.key;
          if (!startAfterKey) break;
        }

        return objects.map((obj) => {
          const decoded = decodeDatasetBlobName(obj.key);
          const owner = toAddressString(obj.owner);
          const metadata: DatasetMetadata | undefined = decoded.metadata
            ? {
                ...decoded.metadata,
                size: obj.plaintextSize,
                format: decoded.fileName.split(".").pop() ?? "",
                uploadedAt: new Date(obj.committedAtMicros / 1000).toISOString(),
                uploader: owner,
              }
            : undefined;

          return {
            blobName: obj.key,
            fileName: decoded.fileName,
            size: obj.plaintextSize,
            uploadedAt: obj.committedAtMicros / 1000,
            metadata,
            downloadUrl: getBlobUrl(owner, obj.key),
            uploader: owner,
          };
        });
      } catch {
        return [];
      }
    },
    [account, shelbyClient]
  );

  const downloadBlob = useCallback(async (url: string, filename: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  return {
    uploadState,
    uploadDataset,
    resetUpload,
    fetchDatasets,
    downloadBlob,
    isConnected: !!account,
    address: account ? toAddressString(account.address) : null,
  };
}
