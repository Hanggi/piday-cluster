import Hashids from "hashids";

const sk = "byz9VFNtbRQM0yBODcCb1lrUtVVH3D3x";

const hashIDforInviteCode = new Hashids(
  sk,
  6,
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);

const decodeInviteCode = (inviteCode: string) => {
  const decodedID = hashIDforInviteCode.decode(inviteCode);
  return decodedID[0] as number;
};

function main() {
  const ic = "G0NLM1";

  console.log(decodeInviteCode(ic));
}

main();
