import type { DatasetCategory, DatasetMetadata } from "../types";

/** Blob-name prefix for metadata packed into the on-chain blob identifier. */
export const META_PREFIX = "sd1.";

/** Shelby blob-name suffix max is 190 characters. */
const MAX_BLOB_NAME = 190;
const MAX_FILE_NAME = 80;

const CATEGORY_VALUES: DatasetCategory[] = [
  "nlp",
  "computer-vision",
  "tabular",
  "audio",
  "time-series",
  "multimodal",
  "reinforcement-learning",
  "other",
];

function isCategory(value: unknown): value is DatasetCategory {
  return typeof value === "string" && CATEGORY_VALUES.includes(value as DatasetCategory);
}

type PackedMeta = {
  n: string;
  d?: string;
  c: DatasetCategory;
  t?: string[];
  l: string;
};

export type StoredDatasetMeta = Pick<
  DatasetMetadata,
  "name" | "description" | "category" | "tags" | "license"
>;

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const padded =
    encoded.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[/\\]/g, "_").replace(/^\.+/g, "_").trim();
  const safe = cleaned || "dataset.bin";
  if (safe.length <= MAX_FILE_NAME) return safe;
  const extIndex = safe.lastIndexOf(".");
  const ext = extIndex > 0 ? safe.slice(extIndex) : "";
  const stem = extIndex > 0 ? safe.slice(0, extIndex) : safe;
  const keep = Math.max(8, MAX_FILE_NAME - ext.length);
  return `${stem.slice(0, keep)}${ext}`;
}

function packName(fileName: string, meta: StoredDatasetMeta, description: string): string {
  const payload: PackedMeta = {
    n: meta.name.trim() || fileName,
    c: meta.category,
    l: meta.license,
  };
  if (description) payload.d = description;
  if (meta.tags.length) payload.t = meta.tags;
  return `${META_PREFIX}${toBase64Url(JSON.stringify(payload))}.${fileName}`;
}

/**
 * Encode listing metadata into the Shelby blob name.
 * The original filename is preserved after the packed payload so downloads keep
 * the right extension. No extra blob / extra transaction is required.
 */
export function encodeDatasetBlobName(fileName: string, meta: StoredDatasetMeta): string {
  const safeFile = sanitizeFileName(fileName);
  let description = meta.description.trim();
  let name = packName(safeFile, meta, description);

  while (name.length > MAX_BLOB_NAME && description.length > 0) {
    description = description.slice(0, Math.max(0, description.length - 40));
    name = packName(safeFile, { ...meta, description }, description);
  }

  if (name.length > MAX_BLOB_NAME) {
    const compact: StoredDatasetMeta = {
      name: (meta.name.trim() || safeFile).slice(0, 48),
      description: "",
      category: meta.category,
      tags: [],
      license: meta.license,
    };
    name = packName(safeFile, compact, "");
  }

  return name;
}

export function decodeDatasetBlobName(blobName: string): {
  fileName: string;
  metadata?: StoredDatasetMeta;
} {
  if (!blobName.startsWith(META_PREFIX)) {
    return { fileName: blobName };
  }

  const rest = blobName.slice(META_PREFIX.length);
  const dot = rest.indexOf(".");
  if (dot <= 0) return { fileName: blobName };

  const encoded = rest.slice(0, dot);
  const fileName = rest.slice(dot + 1) || blobName;

  try {
    const packed = JSON.parse(fromBase64Url(encoded)) as PackedMeta;
    if (!packed?.n || !isCategory(packed.c) || typeof packed.l !== "string") {
      return { fileName };
    }
    return {
      fileName,
      metadata: {
        name: packed.n,
        description: packed.d ?? "",
        category: packed.c,
        tags: Array.isArray(packed.t) ? packed.t.filter((t) => typeof t === "string") : [],
        license: packed.l,
      },
    };
  } catch {
    return { fileName: blobName };
  }
}

export function inferCategoryFromName(name: string): DatasetCategory {
  const lower = name.toLowerCase();
  if (lower.includes("nlp") || lower.includes("text") || lower.includes("language")) {
    return "nlp";
  }
  if (lower.includes("image") || lower.includes("vision") || lower.includes("photo")) {
    return "computer-vision";
  }
  if (lower.includes("audio") || lower.includes("speech") || lower.includes("sound")) {
    return "audio";
  }
  if (lower.includes("time") && lower.includes("series")) {
    return "time-series";
  }
  if (lower.includes("csv") || lower.includes("tabular") || lower.includes("table")) {
    return "tabular";
  }
  if (lower.includes("reinforcement") || lower.includes("-rl")) {
    return "reinforcement-learning";
  }
  if (lower.includes("multimodal")) {
    return "multimodal";
  }
  return "other";
}

export function resolveCategory(
  blobName: string,
  metadata?: { category?: DatasetCategory }
): DatasetCategory {
  return metadata?.category ?? inferCategoryFromName(blobName);
}
