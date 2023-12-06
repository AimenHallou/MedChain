// src/utils/fetchAndDecryptFromIPFS.ts
import { create } from 'ipfs-http-client';
import crypto from 'crypto';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });
const algorithm = 'aes-256-cbc';
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/${env}.js`);

const AES_ENCRYPTION_KEY = config.AES_ENCRYPTION_KEY;
const key = Buffer.from(AES_ENCRYPTION_KEY, 'hex');

export const fetchFileFromIPFS = async (cid: string): Promise<string> => {
  try {
    const chunks: Uint8Array[] = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }

    const encryptedBuffer = Buffer.concat(chunks);
    return decryptBuffer(encryptedBuffer);
  } catch (error) {
    console.error(`Failed to fetch file from IPFS with CID ${cid}:`, error);
    throw new Error(`Failed to fetch file from IPFS: ${error}`);
  }
};

const decryptBuffer = (buffer: Buffer): string => {
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  
  return decrypted.toString('base64');
};
