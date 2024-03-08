import crypto from "crypto";

const salt = "PiUidPassSalt";

export function generatePasswordFromPiUid(piUid: string) {
  // 使用 SHA-256 哈希算法
  const hash = crypto.createHash("sha256");

  // 将 Pi uid 和盐值组合后进行哈希处理
  hash.update(piUid + salt);

  // 返回十六进制字符串形式的哈希值
  return hash.digest("hex");
}
