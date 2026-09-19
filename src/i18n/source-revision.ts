import { createHash } from "node:crypto";

export function sourceRevision(source: string) {
  return createHash("sha256").update(source.replace(/\r\n/g, "\n")).digest("hex");
}
