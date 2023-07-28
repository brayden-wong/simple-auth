import { AES, enc } from 'crypto-js';

export const createAES = (
  data: string,
  secret: string = process.env.PASSWORD_SECRET,
) => AES.encrypt(data, secret).toString();

export const compareAES = (
  data: string,
  hash: string,
  secret: string = process.env.PASSWORD_SECRET,
) => {
  const decryptedHash = AES.decrypt(hash, secret).toString(enc.Utf8);

  return data === decryptedHash;
};
