import Hashids from "hashids";

const secretKey = process.env.HASH_ID_SECRET_KEY;

// User ID

const hashIDForUser = new Hashids(secretKey, 8);

export const getUserVisibleID = (userId) => {
  const encrypted = hashIDForUser.encode(userId);
  return encrypted;
};

// Invitation Code

const hashIDforInviteCode = new Hashids(
  secretKey,
  6,
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
);

export const generateInvitationCode = (userId: number) => {
  const encrypted = hashIDforInviteCode.encode(userId);
  return encrypted;
};

export const decodeInviteCode = (inviteCode: string) => {
  const decodedID = hashIDforInviteCode.decode(inviteCode);
  return decodedID[0] as number;
};
