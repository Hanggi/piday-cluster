import Cryptr from "cryptr";

export function encrypt(text: string) {
  const secretKey = process.env.NEXTAUTH_SECRET;
  const cryptr = new Cryptr(secretKey || "piday-secret");

  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
}

export function decrypt(encryptedString: string) {
  const secretKey = process.env.NEXTAUTH_SECRET;
  const cryptr = new Cryptr(secretKey || "piday-secret");

  const text = cryptr.decrypt(encryptedString);
  return text;
}
