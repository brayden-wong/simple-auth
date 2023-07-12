import { SHA256 } from 'crypto-js';

export const createSHA256 = (data: string) => SHA256(data).toString();

export const compareHash = (data: string, hash: string) =>
  hash === createSHA256(data);
