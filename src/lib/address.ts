import { AccountAddress } from "@aptos-labs/ts-sdk";

/** Normalize wallet / SDK address values to a 0x hex string. */
export function toAddressString(address: unknown): string {
  if (address == null) return "";
  if (typeof address === "string") return address;
  if (address instanceof AccountAddress) return address.toString();
  if (typeof address === "object" && "toString" in address) {
    return String((address as { toString(): string }).toString());
  }
  return String(address);
}

export function toAccountAddress(address: unknown): AccountAddress {
  if (address instanceof AccountAddress) return address;
  return AccountAddress.from(toAddressString(address));
}
