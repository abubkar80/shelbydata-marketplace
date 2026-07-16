import { useCallback, useMemo, useRef, useState } from "react";
import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  expectedTotalChunksets,
  ShelbyBlobClient,
  type BlobCommitments,
} from "@shelby-protocol/sdk/browser";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "../lib/aptosClient";
import { createShelbyClient, getBlobUrl, getDefaultExpiry } from "../lib/shelbyClient";
import type { Dataset, UploadState } from "../types";

const SHELBY_API_BASE = "https://api.testnet.shelby.xyz";

export function useShelby() {
  const { account, signAndSubmitTransaction } = useWallet();
  const shelbyClient = useMemo(() => createShelbyClient(), []);

  // ── Upload ────────────────────────────────────────────────
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
    async (file: File): Promise<string | null> => {
      if (!account) {
        setUploadState((prev) => ({
          ...prev,
          step: "error",
          error: "No wallet connected.",
        }));
        return null;
      }

      try {
        // ── Step 1: Encode ──────────────────────────────────
        setUploadState({
          step: "encoding",
          progress: 10,
          logs: [],
          error: undefined,
        });
        addLog(`Encoding ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);

        const buffer = Buffer.from(await file.arrayBuffer());
        const provider = await createDefaultErasureCodingProvider();
        const commitments: BlobCommitments = await generateCommitments(provider, buffer);

        addLog(`✓ Commitments generated — merkle root: ${commitments.blob_merkle_root.slice(0, 16)}...`);
        setUploadState((prev) => ({ ...prev, progress: 30 }));

        // ── Step 2: Register on-chain ───────────────────────
        setUploadState((prev) => ({ ...prev, step: "registering", progress: 40 }));
        addLog("Submitting on-chain registration transaction...");

        const payload = ShelbyBlobClient.createRegisterBlobPayload({
          account: account.address,
          blobName: file.name,
          blobMerkleRoot: commitments.blob_merkle_root,
          numChunksets: expectedTotalChunksets(commitments.raw_data_size),
          expirationMicros: getDefaultExpiry(),
          blobSize: commitments.raw_data_size,
        });

        const tx = await signAndSubmitTransaction({ data: payload });
        addLog(`✓ Transaction submitted: ${tx.hash}`);
        setUploadState((prev) => ({
          ...prev,
          progress: 60,
          txHash: tx.hash,
        }));

        await aptosClient.waitForTransaction({ transactionHash: tx.hash });
        addLog("✓ Transaction confirmed on-chain.");
        setUploadState((prev) => ({ ...prev, progress: 70 }));

        // ── Step 3: Upload to RPC ───────────────────────────
        setUploadState((prev) => ({ ...prev, step: "uploading", progress: 80 }));
        addLog("Uploading file data to Shelby RPC...");

        await shelbyClient.rpc.putBlob({
          account: account.address,
          blobName: file.name,
          blobData: new Uint8Array(buffer),
        });

        const url = getBlobUrl(account.address, file.name);
        addLog(`✓ Upload complete! Blob available at:\n  ${url}`);

        setUploadState((prev) => ({
          ...prev,
          step: "done",
          progress: 100,
          blobUrl: url,
        }));

        return url;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred.";
        addLog(`✗ Error: ${message}`);
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

  // ── List datasets ─────────────────────────────────────────
  const fetchDatasets = useCallback(
    async (address?: string): Promise<Dataset[]> => {
      const target = address ?? account?.address;
      if (!target) return [];

      try {
        const blobs = await shelbyClient.coordination.getAccountBlobs({
          account: target,
        });

        return blobs.map((blob) => ({
          blobName: blob.name,
          blobMerkleRoot: blob.blobMerkleRoot,
          size: blob.blobSize ?? 0,
          expirationMicros: blob.expirationMicros ?? 0,
          uploadedAt: Date.now(), // API doesn't always return creation time
          downloadUrl: getBlobUrl(target, blob.name),
          uploader: target,
        }));
      } catch {
        return [];
      }
    },
    [account, shelbyClient]
  );

  // ── Download ──────────────────────────────────────────────
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
    address: account?.address ?? null,
  };
}
