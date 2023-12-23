import FlakeIdGen from "flake-idgen";
import { Int64BE } from "int64-buffer";

const idGen = new FlakeIdGen();

export function generateFlakeID(): string {
  const idBuffer = idGen.next();
  const id = new Int64BE(idBuffer).toString();
  return id;
}
