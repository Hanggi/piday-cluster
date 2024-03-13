import * as bcrypt from "bcrypt";

export function encodePaymentPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePaymentPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
