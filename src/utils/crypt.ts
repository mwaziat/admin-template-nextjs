import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.SALT as string
export const Encrypt = (message: string) => {
  return CryptoJS.AES.encrypt(message, key).toString();
}
export const Decrypt = (encryptedData: string) => {
  return CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
}