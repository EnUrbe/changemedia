import "server-only";
import crypto from "crypto";

interface SignatureParams {
  [key: string]: string | number | undefined;
}

export function createCloudinarySignature(params: SignatureParams, apiSecret: string) {
  const filteredEntries = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");
  const sorted = filteredEntries.sort(([a], [b]) => (a > b ? 1 : -1));
  const toSign = sorted.map(([key, value]) => `${key}=${value}`).join("&");
  return crypto.createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}
