export function generateUsername(email: string): string {
  const emailPrefix = email.split("@")[0];
  const randomSuffix = generateRandomSuffix(4);
  return `${emailPrefix}_${randomSuffix}`;
}

function generateRandomSuffix(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
