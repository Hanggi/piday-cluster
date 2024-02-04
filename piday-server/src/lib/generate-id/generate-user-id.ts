import base64url from "base64url";
import crypto from "crypto";
import Hashids from "hashids";

const secretKey = process.env.HASH_ID_SECRET_KEY;

const hashIDForUser = new Hashids(secretKey, 8, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

export const generateUserVisibleId = (userId) => {
  const encrypted = hashIDForUser.encode(userId);
  return encrypted;
};

export const generateInvitationCode = (userId: number) => {
  const initializationVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secretKey,
    initializationVector,
  );
  let inviteCode = cipher.update(JSON.stringify(userId), "utf-8", "hex");
  inviteCode += cipher.final("hex");
  const result = {
    initializationVector: base64url.encode(initializationVector),
    inviteCode,
  };

  return result;
};

export const decodeInviteCode = (
  inviteCode: string,
  initializationVector: string,
) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    base64url.toBuffer(initializationVector),
  );
  let decryptedId = decipher.update(inviteCode, "hex", "utf-8");
  decryptedId += decipher.final("utf-8");
  return decryptedId;
};
