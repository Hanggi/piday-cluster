import Hashids from "hashids";

const secretKey = process.env.HASH_ID_SECRET_KEY;

const hashIDForUser = new Hashids(secretKey, 8, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const hashIDforInviteCode = new Hashids(
  secretKey,
  6,
  "abcdefghijklmnopqrstuvwxyz",
);
export const generateUserVisibleId = (userId) => {
  const encrypted = hashIDForUser.encode(userId);
  return encrypted;
};

export const generateInvitationCode = (userId: number) => {
  const encrypted = hashIDforInviteCode.encode(userId);
  return encrypted;
};

export const decodeInviteCode = (inviteCode: string) => {
  const decodedID = hashIDforInviteCode.decode(inviteCode);
  return decodedID[0] as number
};
