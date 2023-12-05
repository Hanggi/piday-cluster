export function hexIDtoDecimal(hexID: string): string {
  const bigIntValue = BigInt(`0x${hexID}`);

  return bigIntValue.toString(10);
}

export function decimalToHexID(decimal: string): string {
  return BigInt(decimal).toString(16);
}
