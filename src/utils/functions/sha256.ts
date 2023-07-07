import { SHA256 } from 'crypto-js';

export const createSHA256 = (data: string) => {
  // const hash = crypto.createHash('sha256');
  // hash.update(data);

  // return hash.digest('hex');

  return SHA256(data).toString();
};

export const compareHash = (data: string, hash: string) => {
  const newHash = createSHA256(data);

  return newHash === hash;
};
