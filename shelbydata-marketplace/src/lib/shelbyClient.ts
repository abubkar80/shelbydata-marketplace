import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

const SHELBY_API_BASE = "https://api.testnet.shelby.xyz";

/**
 * Create a Shelby browser client instance.
 * Call this once per session — not per render.
 */
export function createShelbyClient(): ShelbyClient {
  return new ShelbyClient({
    network: Network.TESTNET,
    apiKey: import.meta.env.VITE_SHELBY_API_KEY ?? "",
  });
}

/**
 * Build a direct download URL for a blob stored on Shelby.
 */
export function getBlobUrl(address: string, blobName: string): string {
  return `${SHELBY_API_BASE}/shelby/v1/blobs/${address}/${encodeURIComponent(blobName)}`;
}

/**
 * Format file size into a human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Get 30-day expiry timestamp in microseconds.
 */
export function getDefaultExpiry(): number {
  return (Date.now() + 1000 * 60 * 60 * 24 * 30) * 1000;
}

/**
 * Truncate an Aptos address for display.
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

/**
 * Determine if a file is previewable in the browser.
 */
export function isPreviewable(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ["txt", "md", "csv", "json", "png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
}

export function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
}
