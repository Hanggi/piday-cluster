import FlakeIdGen from "flake-idgen";

export const createFlakeGenID = (): number => {
  const generator = new FlakeIdGen();

  const idBuffer = generator.next();

  // 将 Buffer 转换为 BigInt，然后转换为十进制字符串
  const idDecimalString = BigInt("0x" + idBuffer.toString("hex")).toString();

  return parseInt(idDecimalString);
};
