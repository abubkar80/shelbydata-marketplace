import {
  NetworkToDefaultLocationHint,
  NetworkToShelbyRPCBaseUrl,
  ShelbyClient,
} from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";
import { toAddressString } from "./address";

const SHELBY_RPC_BASE =
  NetworkToShelbyRPCBaseUrl.shelbynet ?? "https://shelby.shelbynet.shelby.xyz/shelby";

/**
 * Create a Shelby browser client for Shelbynet.
 * Call this once per session — not per render.
 */
export function createShelbyClient(): ShelbyClient {
  return new ShelbyClient({
    network: Network.SHELBYNET,
    apiKey: import.meta.env.VITE_SHELBY_API_KEY ?? "",
    locationHint: NetworkToDefaultLocationHint.shelbynet,
  });
}

/**
 * Direct download URL for a blob stored on Shelby RPC.
 */
export function getBlobUrl(address: unknown, blobName: string): string {
  const account = toAddressString(address);
  return `${SHELBY_RPC_BASE}/v1/blobs/${account}/${encodeURIComponent(blobName)}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function truncateAddress(address: unknown, chars = 6): string {
  const value = toAddressString(address);
  if (!value) return "";
  if (value.length <= chars + 4) return value;
  return `${value.slice(0, chars)}...${value.slice(-4)}`;
}

export function isPreviewable(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ["txt", "md", "csv", "json", "png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
}

export function isImageFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
}
